import { createClient } from "@/utils/supabase/server";

export const projectImageService = {
  /**
   * Sube una imagen de proyecto
   * @param userId - ID del usuario propietario
   * @param projectId - ID del proyecto
   * @param file - Archivo de imagen
   * @param index - Índice de la imagen (para múltiples imágenes)
   * @returns URL pública de la imagen subida
   */
  uploadProjectImage: async (
    userId: string, 
    projectId: string, 
    file: File, 
    index: number = 0
  ): Promise<string> => {
    const supabase = await createClient();
    
    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${projectId}_${index}_${Date.now()}.${fileExtension}`;
    
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Error al subir imagen: ${error.message}`);
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  /**
   * Elimina una imagen de proyecto
   * @param userId - ID del usuario propietario
   * @param imageUrl - URL de la imagen a eliminar
   */
  deleteProjectImage: async (userId: string, imageUrl: string): Promise<void> => {
    const supabase = await createClient();
    
    // Extraer el nombre del archivo de la URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) {
      throw new Error('URL de imagen inválida');
    }

    // Verificar que el archivo pertenezca al usuario
    const fullPath = `${userId}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('projects')
      .remove([fullPath]);

    if (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  },

  /**
   * Lista todas las imágenes de un proyecto
   * @param userId - ID del usuario propietario
   * @param projectId - ID del proyecto
   * @returns Array de URLs de imágenes
   */
  getProjectImages: async (userId: string, projectId: string): Promise<string[]> => {
    const supabase = await createClient();
    
    const { data, error } = await supabase.storage
      .from('projects')
      .list(userId, {
        limit: 100,
        offset: 0
      });

    if (error) {
      throw new Error(`Error al obtener imágenes: ${error.message}`);
    }

    // Filtrar archivos que pertenezcan al proyecto
    const projectFiles = data.filter(file => 
      file.name.startsWith(`${projectId}_`)
    );

    // Generar URLs públicas
    const imageUrls = projectFiles.map(file => {
      const { data: urlData } = supabase.storage
        .from('projects')
        .getPublicUrl(`${userId}/${file.name}`);
      return urlData.publicUrl;
    });

    return imageUrls;
  },

  /**
   * Actualiza las imágenes de un proyecto (elimina las antiguas y sube las nuevas)
   * @param userId - ID del usuario propietario
   * @param projectId - ID del proyecto
   * @param newFiles - Nuevos archivos de imagen
   * @param oldImageUrls - URLs de imágenes antiguas a eliminar
   * @returns Array de URLs de las nuevas imágenes
   */
  updateProjectImages: async (
    userId: string,
    projectId: string,
    newFiles: File[],
    oldImageUrls: string[] = []
  ): Promise<string[]> => {
    // Eliminar imágenes antiguas
    for (const oldUrl of oldImageUrls) {
      try {
        await projectImageService.deleteProjectImage(userId, oldUrl);
      } catch (error) {
        console.warn('Error eliminando imagen antigua:', error);
      }
    }

    // Subir nuevas imágenes
    const newImageUrls: string[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      try {
        const url = await projectImageService.uploadProjectImage(userId, projectId, newFiles[i], i);
        newImageUrls.push(url);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        throw error;
      }
    }

    return newImageUrls;
  }
};

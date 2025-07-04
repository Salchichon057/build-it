import { createClient } from "@/utils/supabase/server";

export interface Category {
  id: string;
  name: string;
}

export const categoryService = {
  /**
   * Obtiene todas las categorías disponibles
   */
  getAll: async (): Promise<Category[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("name");

    if (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }

    return data as Category[];
  },

  /**
   * Crea una nueva categoría
   */
  create: async (name: string): Promise<Category> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("category")
      .insert([{ name }])
      .select("*")
      .single();

    if (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }

    return data as Category;
  },

  /**
   * Obtiene las categorías de un proyecto específico
   */
  getByProjectId: async (projectId: string): Promise<Category[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_categories")
      .select(`
        category:categories_id (
          id,
          name
        )
      `)
      .eq("projects_id", projectId);

    if (error) {
      throw new Error(`Error al obtener categorías del proyecto: ${error.message}`);
    }

    // Mapear los datos para extraer las categorías
    const categories = data
      .map((item: any) => item.category)
      .filter(Boolean) as Category[];

    return categories;
  },

  /**
   * Asigna categorías a un proyecto
   */
  assignToProject: async (projectId: string, categoryIds: string[]): Promise<void> => {
    const supabase = await createClient();

    // Primero eliminar las categorías existentes del proyecto
    await supabase
      .from("project_categories")
      .delete()
      .eq("projects_id", projectId);

    // Luego insertar las nuevas categorías
    if (categoryIds.length > 0) {
      const insertData = categoryIds.map(categoryId => ({
        projects_id: projectId,
        categories_id: categoryId
      }));

      const { error } = await supabase
        .from("project_categories")
        .insert(insertData);

      if (error) {
        throw new Error(`Error al asignar categorías: ${error.message}`);
      }
    }
  }
};

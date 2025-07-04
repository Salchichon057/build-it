"use server";
import { createClient } from "@/utils/supabase/server";
import { projectService } from "@/lib/projects/service/projectService";
import { projectImageService } from "@/lib/storage/service/projectImageService";
import { revalidatePath } from "next/cache";

/**
 * Crea un proyecto para el usuario autenticado (cliente)
 */
export async function createProjectAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const budget = formData.get("budget") ? Number(formData.get("budget")) : undefined;
    const location = formData.get("location")?.toString() || "";
    const start_date = formData.get("start_date")?.toString() || "";
    const end_date = formData.get("end_date")?.toString() || "";
    const category_id = formData.get("category_id")?.toString() || "";
    const imageFile = formData.get("image") as File | null;

    // Crear el proyecto primero (sin categorías)
    const project = await projectService.create({
        title,
        description,
        users_id: user.id,
        status: "open",
        budget,
        location,
        start_date,
        end_date,
        category_id: category_id || undefined, // Solo si se seleccionó una categoría
    });

    // Subir imagen si existe
    let imageUrl: string | undefined;
    if (imageFile && project.id) {
        try {
            imageUrl = await projectImageService.uploadProjectImage(
                user.id, 
                project.id, 
                imageFile, 
                0
            );
            
            // Actualizar el proyecto con la URL de la imagen
            await projectService.update(project.id, { image_url: imageUrl });
        } catch (error) {
            console.error("Error uploading project image:", error);
            // Continuar sin imagen si hay error
        }
    }

    revalidatePath("/dashboard/projects");
}

/**
 * Obtiene los proyectos del usuario autenticado (cliente)
 */
export async function getMyProjectsAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    // Usa el nuevo método
    return await projectService.getByClientId(user.id);
}
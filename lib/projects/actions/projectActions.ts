"use server";
import { createClient } from "@/utils/supabase/server";
import { projectService } from "../service/projectService";
import { projectImageService } from "@/lib/storage/service/projectImageService";
import { notificationService } from "@/lib/notifications/service/notificationService";
import { revalidatePath } from "next/cache";
import { projectSchema } from "@/lib/validators/projectSchema";

export async function getProjectsAction() {
    return await projectService.getAll();
}

export async function getProjectByIdAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    return await projectService.getById(id);
}

export async function createProjectAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const budgetValue = formData.get("budget")?.toString();
    if (!budgetValue) throw new Error("El presupuesto es requerido");
    const budget = Number(budgetValue);
    const location = formData.get("location")?.toString() || "";
    const start_date = formData.get("start_date")?.toString() || "";
    const end_date = formData.get("end_date")?.toString() || "";
    const category_id = formData.get("category_id")?.toString() || "";
    const imageFile = formData.get("image") as File | null;

    // Validar archivo de imagen si se proporciona
    if (imageFile && imageFile.size > 0) {
        const maxSizeInBytes = 8 * 1024 * 1024; // 8MB
        if (imageFile.size > maxSizeInBytes) {
            throw new Error(`La imagen es demasiado grande. Máximo 8MB permitidos. Tamaño: ${(imageFile.size / (1024 * 1024)).toFixed(2)}MB`);
        }
        
        if (!imageFile.type.startsWith('image/')) {
            throw new Error('Solo se permiten archivos de imagen');
        }
    }

    const payload = {
        title,
        description,
        users_id: user.id,
        status: "open" as const,
        budget,
        location,
        start_date,
        end_date,
        category_id: category_id || undefined,
    };

    const result = projectSchema.safeParse(payload);
    if (!result.success) {
        console.error("Error de validación:", result.error.flatten());
        const fieldErrors = result.error.flatten().fieldErrors;
        if (fieldErrors.title) {
            throw new Error(fieldErrors.title[0] || "Título inválido");
        }
        throw new Error(result.error.errors[0]?.message || "Datos inválidos");
    }

    const createdProject = await projectService.create(result.data);

    // Subir imagen si existe
    if (imageFile && imageFile.size > 0 && createdProject.id) {
        try {
            const imageUrl = await projectImageService.uploadProjectImage(
                user.id, 
                createdProject.id, 
                imageFile, 
                0
            );
            
            // Actualizar el proyecto con la URL de la imagen
            await projectService.update(createdProject.id, { image_url: imageUrl });
        } catch (error) {
            console.error("Error uploading project image:", error);
            // Continuar sin imagen si hay error
        }
    }

    // Crear notificación de bienvenida para el cliente
    try {
        const notificationResult = await notificationService.create({
            user_id: user.id,
            type: "project_update",
            title: "✅ Proyecto publicado exitosamente",
            message: `Tu proyecto "${result.data.title}" está ahora visible para profesionales de la construcción. Te notificaremos cuando recibas postulaciones.`,
            priority: "medium",
            action_url: "/dashboard/projects"
        });
        
        if (notificationResult) {
            console.log("✅ Notificación de bienvenida creada exitosamente");
        } else {
            console.log("⚠️ Notificación no creada debido a configuración de RLS. El proyecto se creó exitosamente.");
        }
    } catch (notificationError: any) {
        console.error("Error inesperado al crear notificación:", notificationError);
        // Continuar sin notificación - NO debe bloquear la creación del proyecto
    }

    revalidatePath("/dashboard/projects");
    return createdProject;
}

export async function saveProjectAction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const projectId = formData.get("project_id")?.toString();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const budgetValue = formData.get("budget")?.toString();
    if (!budgetValue) throw new Error("El presupuesto es requerido");
    const budget = Number(budgetValue);
    const location = formData.get("location")?.toString() || "";
    const start_date = formData.get("start_date")?.toString() || "";
    const end_date = formData.get("end_date")?.toString() || "";
    const category_id = formData.get("category_id")?.toString() || "";
    const imageFile = formData.get("image") as File | null;
    
    // Validar archivo de imagen si se proporciona
    if (imageFile && imageFile.size > 0) {
        const maxSizeInBytes = 8 * 1024 * 1024; // 8MB
        if (imageFile.size > maxSizeInBytes) {
            throw new Error(`La imagen es demasiado grande. Máximo 8MB permitidos. Tamaño: ${(imageFile.size / (1024 * 1024)).toFixed(2)}MB`);
        }
        
        if (!imageFile.type.startsWith('image/')) {
            throw new Error('Solo se permiten archivos de imagen');
        }
    }
    
    const payload = {
        title,
        description,
        budget,
        location,
        start_date,
        end_date,
        category_id: category_id || undefined,
    };

    if (projectId) {
        // Es una edición
        // Obtener el proyecto actual para verificar si tiene imagen previa
        const currentProject = await projectService.getById(projectId);
        
        await projectService.update(projectId, payload);

        // Manejar imagen si se proporcionó una nueva
        if (imageFile && imageFile.size > 0) {
            try {
                // Si ya tenía una imagen, eliminarla del storage
                if (currentProject?.image_url) {
                    try {
                        await projectImageService.deleteProjectImage(user.id, currentProject.image_url);
                    } catch (deleteError) {
                        console.error("Error eliminando imagen anterior:", deleteError);
                        // Continuar aunque falle la eliminación de la imagen anterior
                    }
                }
                
                // Subir la nueva imagen
                const imageUrl = await projectImageService.uploadProjectImage(
                    user.id, 
                    projectId, 
                    imageFile, 
                    0
                );
                await projectService.update(projectId, { image_url: imageUrl });
            } catch (error) {
                console.error("Error uploading project image:", error);
                // Continuar sin actualizar imagen si hay error
            }
        }

        revalidatePath("/dashboard/projects");
        return await projectService.getById(projectId);
    } else {
        // Es una creación nueva
        const completePayload = {
            ...payload,
            users_id: user.id,
            status: "open" as const,
        };
        
        const result = projectSchema.safeParse(completePayload);
        if (!result.success) {
            console.error("Error de validación:", result.error.flatten());
            const fieldErrors = result.error.flatten().fieldErrors;
            if (fieldErrors.title) {
                throw new Error(fieldErrors.title[0] || "Título inválido");
            }
            throw new Error(result.error.errors[0]?.message || "Datos inválidos");
        }

        const createdProject = await projectService.create(result.data);

        // Manejar imagen si se proporcionó
        if (imageFile && imageFile.size > 0) {
            try {
                const imageUrl = await projectImageService.uploadProjectImage(
                    user.id, 
                    createdProject.id, 
                    imageFile, 
                    0
                );
                await projectService.update(createdProject.id, { image_url: imageUrl });
            } catch (error) {
                console.error("Error uploading project image:", error);
                // Continuar sin imagen si hay error
            }
        }

        // Crear notificación de bienvenida para el cliente
        try {
            await notificationService.create({
                user_id: user.id,
                type: "project_update",
                title: "✅ Proyecto publicado exitosamente",
                message: `Tu proyecto "${result.data.title}" está ahora visible para profesionales de la construcción. Te notificaremos cuando recibas postulaciones.`,
                priority: "medium",
                action_url: "/dashboard/projects"
            });
        } catch (notificationError) {
            console.error("Error creating welcome notification:", notificationError);
            // Continuar sin notificación si hay error - no debe bloquear la creación del proyecto
        }

        revalidatePath("/dashboard/projects");
        return createdProject;
    }
}

export async function updateProjectAction(
    id: string,
    project: Partial<{
        title: string;
        description: string;
        status: "open" | "in_progress" | "completed" | "cancelled";
        budget?: number;
        location?: string;
        start_date?: string;
        end_date?: string;
        skills?: string[];
    }>
) {
    if (!id) throw new Error("El id es requerido");
    const updated = await projectService.update(id, project);
    revalidatePath("/dashboard/projects");
    return updated;
}

export async function getMyProjectsAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    return await projectService.getByClientId(user.id);
}

export async function deleteProjectAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    await projectService.delete(id);
    revalidatePath("/dashboard/projects");
    return { success: true };
}
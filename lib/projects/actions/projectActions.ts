"use server";
import { createClient } from "@/utils/supabase/server";
import { projectService } from "../service/projectService";
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

    const payload = {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        users_id: user.id,
        status: "open",
        budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
        location: formData.get("location")?.toString() || "",
        start_date: formData.get("start_date")?.toString() || "",
        end_date: formData.get("end_date")?.toString() || "",
        // skills: ...
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

    // Crear notificación de bienvenida para el cliente
    await notificationService.create({
        user_id: user.id,
        type: "project_update",
        title: "Proyecto creado exitosamente",
        message: `Tu proyecto "${result.data.title}" ha sido publicado. Los profesionales podrán verlo y postularse. Te notificaremos cuando recibas postulaciones.`
    });

    revalidatePath("/dashboard/projects");
    return createdProject;
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

export async function deleteProjectAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    await projectService.delete(id);
    revalidatePath("/dashboard/projects");
    return { success: true };
}
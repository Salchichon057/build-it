// /lib/postulations/actions/postulationActions.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { postulationService } from "../service/postulationService";
import { notificationService } from "@/lib/notifications/service/notificationService";
import { revalidatePath } from "next/cache";

export async function getPostulationsAction() {
    return await postulationService.getAll();
}

export async function getPostulationByIdAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    return await postulationService.getById(id);
}

/**
 * Obtiene las postulaciones de un profesional específico
 */
export async function getMyPostulationsAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    
    return await postulationService.getByProfessionalId(user.id);
}

/**
 * Obtiene las postulaciones para un proyecto específico (para clientes)
 */
export async function getProjectPostulationsAction(projectId: string) {
    if (!projectId) throw new Error("El project_id es requerido");
    return await postulationService.getByProjectId(projectId);
}

/**
 * Crear una nueva postulación
 */
export async function createPostulationAction(projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    if (!projectId) throw new Error("El project_id es requerido");
    
    // Verificar que el usuario sea profesional
    const { data: profile } = await supabase
        .from("users")
        .select("account_type")
        .eq("id", user.id)
        .single();
    
    if (!profile || profile.account_type !== "professional") {
        throw new Error("Solo los profesionales pueden postular");
    }
    
    // Verificar que no haya postulado antes
    const existingPostulation = await postulationService.checkExistingPostulation(user.id, projectId);
    if (existingPostulation) {
        throw new Error("Ya has postulado a este proyecto");
    }
    
    const created = await postulationService.create({
        projects_id: projectId,
        users_id: user.id,
        status: "pending"
    });
    
    // Crear notificación para el cliente
    const { data: project } = await supabase
        .from("projects")
        .select("title, users_id")
        .eq("id", projectId)
        .single();
    
    if (project) {
        await notificationService.create({
            user_id: project.users_id, // Cliente dueño del proyecto
            type: "postulation_status",
            title: "🔨 Nueva postulación recibida",
            message: `Un profesional está interesado en tu proyecto "${project.title}". Revisa su perfil y contacta por WhatsApp para discutir detalles.`
        });
    }
    
    revalidatePath("/dashboard/postulations");
    revalidatePath("/dashboard/projects/available");
    return created;
}

/**
 * Aceptar una postulación (solo para clientes)
 */
export async function acceptPostulationAction(postulationId: string, projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    
    // Verificar que el usuario sea el dueño del proyecto
    const { data: project } = await supabase
        .from("projects")
        .select("users_id")
        .eq("id", projectId)
        .single();
    
    if (!project || project.users_id !== user.id) {
        throw new Error("No tienes permisos para aceptar esta postulación");
    }
    
    // Aceptar la postulación
    await postulationService.acceptPostulation(postulationId);
    
    // Cambiar el estado del proyecto a "in_progress"
    await supabase
        .from("projects")
        .update({ status: "in_progress" })
        .eq("id", projectId);
    
    // Obtener datos para las notificaciones
    const { data: projectData } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .single();
    
    const { data: postulationData } = await supabase
        .from("postulations")
        .select("users_id")
        .eq("id", postulationId)
        .single();
    
    // Crear notificación para el profesional aceptado
    if (projectData && postulationData) {
        await notificationService.create({
            user_id: postulationData.users_id, // Profesional
            type: "postulation_status",
            title: "¡Postulación aceptada!",
            message: `Tu postulación para el proyecto "${projectData.title}" ha sido aceptada. El cliente te contactará pronto. Puedes contactarlo directamente por WhatsApp desde la sección de postulaciones.`
        });
    }
    
    // Rechazar todas las otras postulaciones del proyecto
    const otherPostulations = await postulationService.getByProjectId(projectId);
    for (const postulation of otherPostulations) {
        if (postulation.id !== postulationId && postulation.status === "pending") {
            await postulationService.rejectPostulation(postulation.id);
            
            // Crear notificación para profesionales rechazados
            if (projectData) {
                await notificationService.create({
                    user_id: postulation.users_id,
                    type: "postulation_status",
                    title: "Postulación no seleccionada",
                    message: `Tu postulación para el proyecto "${projectData.title}" no fue seleccionada. El cliente eligió otro profesional. No te desanimes, sigue explorando nuevas oportunidades.`
                });
            }
        }
    }
    
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/postulations");
    return { success: true };
}

/**
 * Rechazar una postulación (solo para clientes)
 */
export async function rejectPostulationAction(postulationId: string, projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    
    // Verificar que el usuario sea el dueño del proyecto
    const { data: project } = await supabase
        .from("projects")
        .select("users_id")
        .eq("id", projectId)
        .single();
    
    if (!project || project.users_id !== user.id) {
        throw new Error("No tienes permisos para rechazar esta postulación");
    }
    
    await postulationService.rejectPostulation(postulationId);
    
    // Obtener datos para la notificación
    const { data: projectData } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .single();
    
    const { data: postulationData } = await supabase
        .from("postulations")
        .select("users_id")
        .eq("id", postulationId)
        .single();
    
    // Crear notificación para el profesional
    if (projectData && postulationData) {
        await notificationService.create({
            user_id: postulationData.users_id,
            type: "postulation_status",
            title: "Postulación rechazada",
            message: `Tu postulación para el proyecto "${projectData.title}" ha sido rechazada. No te desanimes, sigue explorando nuevas oportunidades.`
        });
    }
    
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/postulations");
    return { success: true };
}

/**
 * Retirar una postulación (solo para profesionales)
 */
export async function withdrawPostulationAction(postulationId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    
    // Verificar que el usuario sea el dueño de la postulación
    const postulation = await postulationService.getById(postulationId);
    if (!postulation || postulation.users_id !== user.id) {
        throw new Error("No tienes permisos para retirar esta postulación");
    }
    
    await postulationService.withdrawPostulation(postulationId);
    
    // Obtener datos para la notificación al cliente
    const postulationDetails = await postulationService.getById(postulationId);
    if (postulationDetails) {
        const { data: projectData } = await supabase
            .from("projects")
            .select("title, users_id")
            .eq("id", postulationDetails.projects_id)
            .single();
        
        const { data: professionalData } = await supabase
            .from("users")
            .select("first_name, last_name")
            .eq("id", postulationDetails.users_id)
            .single();
        
        // Crear notificación para el cliente
        if (projectData && professionalData) {
            await notificationService.create({
                user_id: projectData.users_id, // Cliente
                type: "postulation_status",
                title: "Postulación retirada",
                message: `${professionalData.first_name} ${professionalData.last_name} ha retirado su postulación del proyecto "${projectData.title}".`
            });
        }
    }
    
    revalidatePath("/dashboard/postulations");
    return { success: true };
}

/**
 * Completar un proyecto (solo para clientes)
 */
export async function completeProjectAction(projectId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    
    // Verificar que el usuario sea el dueño del proyecto
    const { data: project } = await supabase
        .from("projects")
        .select("users_id, status")
        .eq("id", projectId)
        .single();
    
    if (!project || project.users_id !== user.id) {
        throw new Error("No tienes permisos para completar este proyecto");
    }
    
    if (project.status !== "in_progress") {
        throw new Error("Solo se pueden completar proyectos en progreso");
    }
    
    await supabase
        .from("projects")
        .update({ status: "completed" })
        .eq("id", projectId);
    
    // Obtener datos para la notificación
    const { data: projectData } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .single();
    
    // Obtener el profesional asignado (postulación aceptada)
    const { data: acceptedPostulation } = await supabase
        .from("postulations")
        .select("users_id")
        .eq("projects_id", projectId)
        .eq("status", "accepted")
        .single();
    
    // Crear notificación para el profesional
    if (projectData && acceptedPostulation) {
        await notificationService.create({
            user_id: acceptedPostulation.users_id,
            type: "project_update",
            title: "Proyecto completado",
            message: `El proyecto "${projectData.title}" ha sido marcado como completado por el cliente. ¡Felicitaciones por el trabajo realizado!`
        });
    }
    
    revalidatePath("/dashboard/projects");
    return { success: true };
}
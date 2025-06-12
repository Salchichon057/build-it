"use server";
import { projectService } from "../service/projectService";
import { revalidatePath } from "next/cache";

export async function getProjectsAction() {
    return await projectService.getAll();
}

export async function getProjectByIdAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    return await projectService.getById(id);
}

export async function createProjectAction(project: { title: string; description: string; client_id: string; status: "open" | "in_progress" | "completed" | "cancelled"; budget?: number; location?: string; start_date?: string; end_date?: string; skills?: string[] }) {
    if (!project.title) throw new Error("El nombre es requerido");
    if (!project.client_id) throw new Error("El client_id es requerido");
    if (!project.status) throw new Error("El status es requerido");
    const created = await projectService.create(project);
    revalidatePath("/dashboard/projects");
    return created;
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
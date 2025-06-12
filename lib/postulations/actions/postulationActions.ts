// /lib/postulations/actions/postulationActions.ts
"use server";
import { postulationService } from "../service/postulationService";
import { revalidatePath } from "next/cache";

export async function getPostulationsAction() {
    return await postulationService.getAll();
}

export async function getPostulationByIdAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    return await postulationService.getById(id);
}

export async function createPostulationAction(postulation: { project_id: string; professional_id: string; cover_letter?: string }) {
    if (!postulation.project_id) throw new Error("El project_id es requerido");
    if (!postulation.professional_id) throw new Error("El professional_id es requerido");
    const created = await postulationService.create(postulation);
    revalidatePath("/dashboard/postulations");
    return created;
}

type PostulationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export async function updatePostulationAction(
    id: string,
    postulation: Partial<{ cover_letter?: string; status?: PostulationStatus }>
) {
    if (!id) throw new Error("El id es requerido");
    const updated = await postulationService.update(id, postulation);
    revalidatePath("/dashboard/postulations");
    return updated;
}

export async function deletePostulationAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    await postulationService.delete(id);
    revalidatePath("/dashboard/postulations");
    return { success: true };
}
"use server";
import { skillService } from "../service/skillService";
import { revalidatePath } from "next/cache";

// Obtener todas las skills
export async function getSkillsAction() {
	return await skillService.getAvailableSkills();
}

// Crear una nueva skill
export async function createSkillAction(name: string) {
	if (!name) throw new Error("El nombre es requerido");
	const skill = await skillService.createSkill(name);
	revalidatePath("/dashboard/skills"); // Cambia la ruta si tu UI está en otra
	return skill;
}

// Actualizar una skill existente
export async function updateSkillAction(id: string, name: string) {
	if (!id) throw new Error("El id es requerido");
	if (!name) throw new Error("El nombre es requerido");
	const skill = await skillService.updateSkill(id, name);
	revalidatePath("/dashboard/skills");
	return skill;
}

// Eliminar una skill
export async function deleteSkillAction(id: string) {
	if (!id) throw new Error("El id es requerido");
	await skillService.deleteSkill(id);
	revalidatePath("/dashboard/skills");
	return { success: true };
}
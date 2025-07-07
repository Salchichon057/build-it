import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const projectSchema = z.object({
	title: z.string().min(1, "El título es requerido").max(100, "El título es muy largo"),
	description: z.string().min(1, "La descripción es requerida").max(500, "La descripción es muy larga"),
	budget: z.number().positive("El presupuesto debe ser positivo"),
	location: z.string().optional(),
	start_date: z
		.string()
		.min(1, "La fecha de inicio es requerida")
		.refine((date) => {
			const startDate = new Date(date);
			startDate.setHours(0, 0, 0, 0);
			return startDate >= today;
		}, "La fecha de inicio no puede ser anterior a hoy"),
	end_date: z.string().optional(),
	users_id: z.string(),
	status: z.enum(["open", "in_progress", "completed", "cancelled"]),
	category_id: z.string().optional(),
}).refine((data) => {
	if (!data.end_date) return true;

	const startDate = new Date(data.start_date);
	const endDate = new Date(data.end_date);

	return endDate >= startDate;
}, {
	message: "La fecha de fin debe ser posterior a la fecha de inicio",
	path: ["end_date"],
});
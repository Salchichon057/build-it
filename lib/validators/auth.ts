import { z } from "zod";

export const registerSchema = z.object({
	first_name: z.string().min(1, "El nombre es requerido"),
	last_name: z.string().min(1, "El apellido es requerido"),
	email: z.string().email("Formato de email inválido"),
	birthdate: z.string().optional(),
	phone: z.string().optional(),
	account_type: z.enum(["client", "professional"]),
	account_category: z.enum(["enterprise", "person"]),
	speciality: z.string().optional(),
	experience_years: z.string().optional(),
	skills: z.array(z.string()).optional(),
	cv_url: z.string().optional(),
	profile_image: z.string().optional(),
	address: z.string().optional(),
	password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
	confirmPassword: z.string().min(8, "La confirmación de contraseña debe tener al menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Las contraseñas no coinciden",
	path: ["confirmPassword"],
});
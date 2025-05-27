import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Formato de email inválido"),
	password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const registerSchema = z
	.object({
		first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
		last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
		email: z.string().email("Formato de email inválido"),
		birthdate: z.string().optional(),
		phone: z.string().optional(),
		account_type: z.enum(["client", "professional"], {
			errorMap: () => ({ message: "Seleccione un tipo de cuenta válido" }),
		}),
		account_category: z.enum(["enterprise", "person"], {
			errorMap: () => ({ message: "Seleccione una categoría de cuenta válida" }),
		}),
		speciality: z.string().optional(),
		cv_url: z.string().optional(),
		address: z.string().optional(),
		profile_image: z.string().optional(),
		password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
		confirmPassword: z.string().min(8, "La confirmación debe coincidir"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});
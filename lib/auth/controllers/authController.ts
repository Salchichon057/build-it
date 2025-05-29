import { authService } from "../../auth/service/authService";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { User } from "@/lib/auth/model/user";
import { registerSchema } from "@/lib/validators/auth";

export const authController = {
	signUp: async (formData: FormData) => {
		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();
		const origin = (await headers()).get("origin");
		const cvFile = formData.get("cv_file") as File | null;

		// Preparar los datos para la validación
		const userData = {
			first_name: formData.get("first_name")?.toString() || "",
			last_name: formData.get("last_name")?.toString() || "",
			email: email || "",
			birthdate: formData.get("birthdate")?.toString() || undefined,
			phone: formData.get("phone")?.toString() || undefined,
			account_type: formData.get("account_type")?.toString() || "",
			account_category: formData.get("account_category")?.toString() || "",
			speciality: formData.get("speciality")?.toString() || undefined,
			experience_years: formData.get("experience_years")?.toString() || undefined,
			skills: formData.get("skills")?.toString() || undefined,
			cv_url: undefined, // Será seteado después de subir el archivo
			address: formData.get("address")?.toString() || undefined,
			profile_image: undefined,
			password: password || "",
			confirmPassword: formData.get("confirmPassword")?.toString() || "",
		};

		// Validar los datos con el esquema
		const validationResult = registerSchema.safeParse(userData);
		if (!validationResult.success) {
			const errorMessage = validationResult.error.errors
				.map((err) => err.message)
				.join(", ");
			return encodedRedirect("error", "/sign-up", errorMessage);
		}

		// Subir el CV si existe
		let cvUrl: string | null = null;
		if (cvFile && cvFile.size > 0) {
			const supabase = await createClient();
			const fileName = `${Date.now()}-${cvFile.name}`;
			const { error: uploadError } = await supabase.storage
				.from("cv-files")
				.upload(fileName, cvFile);

			if (uploadError) {
				return encodedRedirect("error", "/sign-up", "Failed to upload CV");
			}

			const { data: storageData } = supabase.storage.from("cv-files").getPublicUrl(fileName);
			cvUrl = storageData.publicUrl;
		}

		// Preparar los datos del usuario para el registro
		const userDataToInsert: Omit<User, "id" | "created_at"> = {
			first_name: userData.first_name,
			last_name: userData.last_name,
			email: userData.email,
			birthdate: userData.birthdate || null,
			phone: userData.phone || null,
			account_type: userData.account_type as "client" | "professional",
			account_category: userData.account_category as "enterprise" | "person",
			speciality: userData.speciality || null,
			cv_url: cvUrl,
			address: userData.address || null,
			profile_image: null,
			selectedSkills: userData.skills
				? userData.skills.split(",").map((skill) => ({ id: skill, name: "" }))
				: [],
		};

		try {
			const { data, error } = await authService.signUp(email!, password!, userDataToInsert, {
				emailRedirectTo: `${origin}/auth/callback`,
			});
			if (error) {
				return encodedRedirect("error", "/sign-up", "An error occurred during signup");
			}
			return encodedRedirect(
				"success",
				"/sign-up",
				"Thanks for signing up! Please check your email for a verification link.",
			);
		} catch (error) {
			return encodedRedirect("error", "/sign-up", "An error occurred during signup");
		}
	},

	signIn: async (formData: FormData) => {
		const email = formData.get("email")?.toString();
		const password = formData.get("password")?.toString();

		if (!email || !password) {
			return encodedRedirect("error", "/sign-in", "El email y la contraseña son obligatorios");
		}

		const { error } = await authService.signIn(email, password);

		if (error) {
			return encodedRedirect("error", "/sign-in", error.message);
		}

		return redirect("/protected");
	},

	forgotPassword: async (formData: FormData) => {
		const email = formData.get("email")?.toString();
		const origin = (await headers()).get("origin");
		const callbackUrl = formData.get("callbackUrl")?.toString();

		if (!email) {
			return encodedRedirect("error", "/forgot-password", "El email es obligatorio");
		}

		const { error } = await authService.forgotPassword(email, `${origin}/auth/callback?redirect_to=/protected/reset-password`);

		if (error) {
			return encodedRedirect("error", "/forgot-password", "Error al enviar el correo de recuperación");
		}

		if (callbackUrl) {
			return redirect(callbackUrl);
		}

		return encodedRedirect(
			"success",
			"/forgot-password",
			"Revisa tu correo para obtener instrucciones sobre cómo restablecer tu contraseña.",
		);
	},

	resetPassword: async (formData: FormData) => {
		const password = formData.get("password")?.toString();
		const confirmPassword = formData.get("confirmPassword")?.toString();

		if (!password || !confirmPassword) {
			return encodedRedirect("error", "/protected/reset-password", "Ambos campos de contraseña son obligatorios");
		}

		if (password !== confirmPassword) {
			return encodedRedirect("error", "/protected/reset-password", "Las contraseñas no coinciden");
		}

		const { error } = await authService.resetPassword(password);

		if (error) {
			return encodedRedirect("error", "/protected/reset-password", "Error al restablecer la contraseña");
		}

		return encodedRedirect("success", "/protected/reset-password", "Contraseña restablecida con éxito. Puedes iniciar sesión ahora.");
	},

	signOut: async () => {
		const { error } = await authService.signOut();
		if (error) {
			console.error(error.message);
		}
		return redirect("/sign-in");
	},
};
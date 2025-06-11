import { authService } from "../../auth/service/authService";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { User } from "@/lib/auth/model/user";
import { registerSchema } from "@/lib/validators/auth";
import { storageController } from "@/lib/storage/controllers/storageController";

export const authController = {
  signUp: async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { error: "Email y contraseña son obligatorios" };
    }

    const userData = {
      first_name: formData.get("first_name")?.toString() || "",
      last_name: formData.get("last_name")?.toString() || "",
      email: email || "",
      account_type: formData.get("account_type")?.toString() || "",
      account_category: formData.get("account_category")?.toString() || "",
      password: password || "",
      confirmPassword: formData.get("confirmPassword")?.toString() || "",
    };

    const validationResult = registerSchema.safeParse(userData);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return { error: errorMessage };
    }

    const userDataToInsert: Omit<User, "id" | "created_at"> = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      birthdate: null,
      phone: null,
      account_type: userData.account_type as "client" | "professional",
      account_category: userData.account_category as "enterprise" | "person",
      speciality: null,
      cv_url: null,
      profile_image: null,
      address: null,
    };

    const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    console.log("Attempting sign up with email:", email);
    const { data, error } = await authService.signUp(email, password, userDataToInsert, {
      emailRedirectTo: `${origin}/auth/callback`,
    });

    if (error) {
      let errorMessage = (typeof error === "object" && error !== null && "message" in error)
        ? (error as { message?: string }).message
        : String(error);

      if (
        (errorMessage ?? "").includes("duplicate key value") &&
        (errorMessage ?? "").includes("users_email_key")
      ) {
        errorMessage = "Ya existe una cuenta con este correo electrónico.";
      }

      console.error("Sign up error:", errorMessage);
      return { error: "Ocurrió un error durante el registro: " + (errorMessage || "Desconocido") };
    }

    // Redirección exitosa
    return encodedRedirect(
      "success",
      "/sign-in",
      "¡Gracias por registrarte! Por favor, revisa tu correo para verificar tu cuenta."
    );
  },

  updateProfile: async (formData: FormData) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return encodedRedirect("error", "/complete-profile", "Usuario no autenticado");
    }

    const userId = user.id;

    // 1. Parsear y limpiar los datos del formulario
    const profileData = {
      birthdate: formData.get("birthdate")?.toString() || null,
      phone: formData.get("phone")?.toString() || null,
      speciality: formData.get("speciality")?.toString() || null,
      experience_years: formData.get("experience_years")?.toString() || null,
      skills: formData.getAll("skills").filter((skill): skill is string => typeof skill === "string"),
      cv_file: formData.get("cv_file") as File | null,
      profile_image: formData.get("profile_image") as File | null,
      address: formData.get("address")?.toString() || null,
    };

    // 2. Construir el objeto de actualización
    let updateData: Partial<User> = {
      birthdate: profileData.birthdate,
      phone: profileData.phone,
      speciality: profileData.speciality,
      address: profileData.address,
      experience_years: profileData.experience_years,
    };

    // 3. Subida de archivos (CV y foto de perfil)
    try {
      if (profileData.cv_file && profileData.cv_file.size > 0) {
        const storedCV = await storageController.uploadCV(profileData.cv_file, userId);
        updateData.cv_url = storedCV.publicUrl;
      }
      if (profileData.profile_image && profileData.profile_image.size > 0) {
        const storedImg = await storageController.uploadProfileImage(profileData.profile_image, userId);
        updateData.profile_image = storedImg.publicUrl;
      }
    } catch (error: any) {
      return encodedRedirect("error", "/complete-profile", error.message || "Error al subir archivos");
    }

    // 4. Actualizar el usuario en la base de datos
    const { error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId);

    if (updateError) {
      return encodedRedirect("error", "/complete-profile", "Error al actualizar el perfil: " + updateError.message);
    }

    // 5. Actualizar skills (si corresponde)
    if (profileData.skills && profileData.skills.length > 0) {
      // Elimina skills previos (opcional, si quieres que sean reemplazados)
      await supabase.from("user_skills").delete().eq("user_id", userId);

      // Inserta los nuevos
      const userSkills = profileData.skills.map((skillId) => ({
        user_id: userId,
        skill_id: skillId,
      }));

      const { error: skillsError } = await supabase
        .from("user_skills")
        .insert(userSkills);

      if (skillsError) {
        return encodedRedirect("error", "/complete-profile", "Error al guardar las habilidades: " + skillsError.message);
      }
    }

    // 6. Redirigir a la página de profesionales con mensaje de éxito
    return encodedRedirect("success", "/dashboard/professionals", "Perfil actualizado correctamente.");
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
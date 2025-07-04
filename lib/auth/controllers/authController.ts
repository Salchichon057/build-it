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
      birthdate: formData.get("birthdate")?.toString() || null,
      phone: formData.get("phone")?.toString() || null,
      account_type: userData.account_type as "client" | "professional",
      account_category: userData.account_category as "enterprise" | "person",
      speciality: null,
      cv_url: null,
      profile_image: null,
      address: null,
      experience_years: null,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Usuario no autenticado" };
    }

    let cvUrl = null;
    let profileImageUrl = null;

    try {
      // Verificar que los buckets existan antes de subir archivos
      const { ensureStorageBuckets } = await import("@/lib/storage/utils/bucketSetup");
      await ensureStorageBuckets();

      // Manejar subida de CV
      const cvFile = formData.get("cv_file") as File;
      if (cvFile && cvFile.size > 0) {
        console.log("Uploading CV file:", cvFile.name);
        const { storageService } = await import("@/lib/storage/service/storageService");
        const uploadedCV = await storageService.uploadCV(cvFile, user.id);
        cvUrl = uploadedCV.publicUrl;
        console.log("CV uploaded successfully:", cvUrl);
      }

      // Manejar subida de imagen de perfil
      const profileImageFile = formData.get("profile_image") as File;
      if (profileImageFile && profileImageFile.size > 0) {
        console.log("Uploading profile image:", profileImageFile.name);
        const { storageService } = await import("@/lib/storage/service/storageService");
        const uploadedImage = await storageService.uploadProfileImage(profileImageFile, user.id);
        profileImageUrl = uploadedImage.publicUrl;
        console.log("Profile image uploaded successfully:", profileImageUrl);
      }
    } catch (storageError: any) {
      console.error("Storage error:", storageError);
      return { error: "Error al subir archivos: " + storageError.message };
    }

    const updateData = {
      first_name: formData.get("first_name")?.toString(),
      last_name: formData.get("last_name")?.toString(),
      phone: formData.get("phone")?.toString() || null,
      birthdate: formData.get("birthdate")?.toString() || null,
      address: formData.get("address")?.toString() || null,
      speciality: formData.get("speciality")?.toString() || null,
      experience_years: formData.get("experience_years")?.toString() || null,
      ...(cvUrl && { cv_url: cvUrl }),
      ...(profileImageUrl && { profile_image: profileImageUrl }),
    };

    // Filtrar campos vacíos o indefinidos
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== "")
    );

    console.log("Updating profile with data:", filteredData);

    const { error } = await authService.updateProfile(user.id, filteredData);

    if (error) {
      console.error("Update profile error:", error);
      return { error: "Error al actualizar el perfil: " + error };
    }

    return { success: "Perfil actualizado correctamente" };
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

    // Obtener el usuario autenticado y su perfil
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return encodedRedirect("error", "/sign-in", "No se pudo obtener el usuario autenticado.");
    }

    // Buscar el perfil en la tabla users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("account_type")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return encodedRedirect("error", "/sign-in", "No se pudo obtener el perfil del usuario.");
    }

    // Redirigir según el rol
    if (profile.account_type === "client") {
      return encodedRedirect("success", "/dashboard/projects", "¡Bienvenido! Has iniciado sesión como cliente.");
    } else if (profile.account_type === "professional") {
      return encodedRedirect("success", "/dashboard/professionals", "¡Bienvenido! Has iniciado sesión como profesional.");
    } else {
      return encodedRedirect("error", "/sign-in", "Rol de usuario no reconocido.");
    }
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
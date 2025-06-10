import { authService } from "../../auth/service/authService";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { User } from "@/lib/auth/model/user";
import { registerSchema } from "@/lib/validators/auth";
import { skillService } from "../../skills/service/skillService";
import { storageController } from "../../storage/controllers/storageController";

export const authController = {
  signUp: async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const origin = (await headers()).get("origin");

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
      skills: formData.getAll("skills").filter((skill): skill is string => typeof skill === "string"),
      cv_file: formData.get("cv_file") as File | null,
      profile_image: formData.get("profile_image") as File | null,
      address: formData.get("address")?.toString() || undefined,
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

    // Subir CV y foto de perfil usando storageController
    let cvUrl: string | null = null;
    let cvFileName: string | null = null;
    let profileImageUrl: string | null = null;
    let profileImageName: string | null = null;

    const cvFile = formData.get("cv_file") as File | null;
    const profileImageFile = formData.get("profile_image") as File | null;

    if (cvFile && cvFile.size > 0) {
      try {
        const storedFile = await storageController.uploadCV(formData);
        cvUrl = storedFile.publicUrl;
        cvFileName = storedFile.name;
      } catch (error) {
        return encodedRedirect("error", "/sign-up", (error as Error).message);
      }
    }

    if (profileImageFile && profileImageFile.size > 0) {
      try {
        const storedFile = await storageController.uploadProfileImage(formData);
        profileImageUrl = storedFile.publicUrl;
        profileImageName = storedFile.name;
      } catch (error) {
        return encodedRedirect("error", "/sign-up", (error as Error).message);
      }
    }

    // Preparar los datos iniciales del usuario para el registro
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
      profile_image: profileImageUrl,
      address: userData.address || null,
    };

    try {
      const { data, error } = await authService.signUp(email!, password!, userDataToInsert, {
        emailRedirectTo: `${origin}/auth/callback`,
      });
      if (error) {
        return encodedRedirect("error", "/sign-up", "Ocurrió un error durante el registro");
      }

      // Insertar las habilidades en la tabla user_skills
      if (data.user && userData.skills.length > 0) {
        const userId = data.user.id;
        const supabase = await createClient();

        const userSkills = userData.skills.map((skillId) => ({
          user_id: userId,
          skill_id: skillId,
        }));

        const { error: skillsError } = await supabase
          .from("user_skills")
          .insert(userSkills);

        if (skillsError) {
          console.error("Error al insertar habilidades:", skillsError.message);
          return encodedRedirect("error", "/sign-up", "Error al guardar las habilidades del usuario");
        }
      }

      // Renombrar archivos después de crear el usuario
      if (data.user) {
        const userId = data.user.id;
        const supabase = await createClient();
        const updateData: Partial<User> = {};

        if (cvFileName) {
          const cvMatch = cvFileName.match(/\.[^.]+$/);
          const cvExtension = cvMatch ? cvMatch[0] : "";
          const newCvFileName = `${userId}${cvExtension}`;
          const renamedFile = await storageController.renameFile("cvs", cvFileName, newCvFileName);
          updateData.cv_url = renamedFile.publicUrl;
        }

        if (profileImageName) {
          const profileImageMatch = profileImageName.match(/\.[^.]+$/);
          const profileImageExtension = profileImageMatch ? profileImageMatch[0] : "";
          const newProfileImageName = `${userId}${profileImageExtension}`;
          const renamedFile = await storageController.renameFile("profile-images", profileImageName, newProfileImageName);
          updateData.profile_image = renamedFile.publicUrl;
        }

        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", userId);

          if (updateError) {
            console.error("Error al actualizar las URLs de los archivos renombrados:", updateError.message);
          }
        }
      }

      return encodedRedirect(
        "success",
        "/sign-up",
        "¡Gracias por registrarte! Por favor, revisa tu correo para encontrar un enlace de verificación."
      );
    } catch (error) {
      return encodedRedirect("error", "/sign-up", "Ocurrió un error durante el registro");
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
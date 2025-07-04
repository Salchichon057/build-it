"use server";

import { authController } from "@/lib/auth/controllers/authController";

export async function updateProfileAction(formData: FormData) {
  return await authController.updateProfile(formData);
}

"use server";

import { authController } from "@/lib/auth/controllers/authController";

export const resetPasswordAction = authController.resetPassword;
export const forgotPasswordAction = authController.forgotPassword;
export const signInAction = authController.signIn;

export async function signUpAction(formData: FormData) {
  console.log("El registro tiene esta data:", formData);
  type SignUpResult = { error?: string; [key: string]: any };
  const result: SignUpResult = await authController.signUp(formData);
  if (result?.error) {
    console.error("Action error:", result.error);
  }
  return result;
}

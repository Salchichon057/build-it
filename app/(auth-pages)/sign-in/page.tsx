import { LoginForm } from "@/components/LoginForm";
import { authController } from "@/lib/auth/controllers/authController";

export async function signInAction(formData: FormData) {
  "use server";
  return await authController.signIn(formData);
}

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const message = await searchParams;
  return <LoginForm signInAction={signInAction} message={message} />;
}

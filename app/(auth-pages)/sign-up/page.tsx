import { RegisterForm } from "@/components/RegisterForm";
import { authController } from "@/lib/auth/controllers/authController";

export async function signUpAction(formData: FormData) {
  "use server";
  console.log("El registro tiene esta data:", formData);
  type SignUpResult = { error?: string; [key: string]: any };
  const result: SignUpResult = await authController.signUp(formData);
  if (result?.error) {
    console.error("Action error:", result.error);
  }
  return result;
}

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const message = await searchParams;
  return (
    <div>
      <RegisterForm signUpAction={signUpAction} message={message} />
    </div>
  );
}

import { skillService } from "@/lib/skills/service/skillService";
import { RegisterForm } from "@/components/RegisterForm";
import { authController } from "@/lib/auth/controllers/authController";

export async function signUpAction(formData: FormData) {
  "use server";
  console.log("El registro tiene esta data:", formData); 
  return await authController.signUp(formData);
}

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const message = await searchParams;

  const skills = await skillService.getAvailableSkills();

  return (
    <RegisterForm
      signUpAction={signUpAction}
      message={message}
      initialSkills={skills}
    />
  );
}

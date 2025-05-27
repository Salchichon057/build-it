import { signUpAction } from "@/app/actions";
import { RegisterForm } from "@/components/RegisterForm";

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const message = await searchParams;
  return <RegisterForm signUpAction={signUpAction} message={message} />;
}

import { RegisterForm } from "@/components/RegisterForm";
import { signUpAction } from "@/app/actions";

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

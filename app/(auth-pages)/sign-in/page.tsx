import { signInAction } from "@/app/actions";
import { LoginForm } from "@/components/LoginForm";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const message = await searchParams;
  return <LoginForm signInAction={signInAction} message={message} />;
}

import { LoginForm } from "@/components/LoginForm";
import { signInAction } from "@/app/actions";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const message = await searchParams;
  return <LoginForm signInAction={signInAction} message={message} />;
}

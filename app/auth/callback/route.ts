import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Verificar el tipo de cuenta y redirigir si es profesional
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData, error } = await supabase
        .from("users")
        .select("account_type")
        .eq("id", user.id)
        .single();
      if (!error && userData && userData.account_type === "professional") {
        return NextResponse.redirect(`${origin}/dashboard/complete-profile`);
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // Redirigir a la página protegida por defecto
  // return NextResponse.redirect(`${origin}/protected`);
  // Redirigir al login
  return NextResponse.redirect(`${origin}/sign-in`);
}
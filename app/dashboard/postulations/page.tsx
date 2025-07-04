import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PostulationsClient from "./PostulationsClient";

export default async function PostulationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Verificar que el usuario sea profesional
  const { data: profile } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", user.id)
    .single();

  if (!profile || profile.account_type !== "professional") {
    return redirect("/dashboard?error=Esta sección es solo para profesionales");
  }

  // Por ahora, simularemos las postulaciones ya que no tenemos la tabla implementada
  // En el futuro, aquí se harían consultas reales a la base de datos de postulaciones
  
  return <PostulationsClient userId={user.id} />;
}

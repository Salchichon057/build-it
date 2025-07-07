import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AvailableProjectsClient from "@/components/dashboard/projects/AvailableProjectsClient";

export default async function AvailableProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Obtener el perfil completo del usuario profesional
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userProfile || userProfile.account_type !== "professional") {
    return redirect("/dashboard?error=Acceso no autorizado");
  }

  // Obtener proyectos disponibles (abiertos) con información del cliente incluyendo teléfono
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      users:users_id (
        first_name,
        last_name,
        profile_image,
        phone
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  return <AvailableProjectsClient projects={projects || []} currentUser={userProfile} />;
}

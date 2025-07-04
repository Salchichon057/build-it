import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/dashboard/profile/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Consulta el perfil completo en la tabla users
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return redirect("/dashboard?error=Perfil no encontrado");
  }

  // Obtener skills del usuario si es profesional
  let userSkills: any[] = [];
  if (profile.account_type === "professional") {
    const { data: skills } = await supabase
      .from("user_skills")
      .select(`
        skills:skills_id (
          id,
          name
        )
      `)
      .eq("users_id", user.id);

    userSkills = (skills?.map(skill => skill.skills).filter(Boolean).flat()) || [];
  }

  return <ProfileClient profile={profile} userSkills={userSkills} />;
}

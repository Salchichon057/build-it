import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import PublicProfileClient from "@/components/dashboard/professionals/PublicProfileClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: currentUser },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !currentUser) {
    return redirect("/sign-in");
  }

  // Verificar que el usuario actual sea cliente
  const { data: currentProfile } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", currentUser.id)
    .single();

  if (!currentProfile || currentProfile.account_type !== "client") {
    return redirect("/dashboard?error=Esta funcionalidad es solo para clientes");
  }

  // Obtener el perfil del profesional
  const { data: professional, error } = await supabase
    .from("users")
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      profile_image,
      speciality,
      experience_years,
      address,
      cv_url,
      created_at
    `)
    .eq("id", id)
    .eq("account_type", "professional")
    .single();

  if (error || !professional) {
    return notFound();
  }

  const { data: skills } = await supabase
    .from("user_skills")
    .select(`
      skills:skills_id (
        id,
        name
      )
    `)
    .eq("users_id", id);

  const professionalSkills = (skills?.map(skill => skill.skills).filter(Boolean).flat()) || [];

  return (
    <PublicProfileClient 
      professional={professional} 
      skills={professionalSkills}
    />
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProfessionalsClient from "@/components/dashboard/professionals/ProfessionalsClient";

export default async function ProfessionalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Verificar que el usuario sea cliente
  const { data: profile } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", user.id)
    .single();

  if (!profile || profile.account_type !== "client") {
    return redirect("/dashboard?error=Esta sección es solo para clientes");
  }

  // Obtener todos los profesionales con sus habilidades
  const { data: professionals, error } = await supabase
    .from("users")
    .select(`
      id,
      first_name,
      last_name,
      email,
      profile_image,
      speciality,
      experience_years,
      address,
      cv_url,
      created_at
    `)
    .eq("account_type", "professional")
    .not("speciality", "is", null) // Solo profesionales que han completado su perfil
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching professionals:", error);
  }

  return <ProfessionalsClient professionals={professionals || []} />;
}

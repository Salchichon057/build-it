import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PostulationsClient from "@/components/dashboard/postulations/PostulationsClient";
import { getMyPostulationsAction } from "@/lib/postulations/actions/postulationActions";

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

  // Obtener las postulaciones reales del profesional
  try {
    const postulations = await getMyPostulationsAction();
    return <PostulationsClient userId={user.id} initialPostulations={postulations} />;
  } catch (error) {
    console.error("Error loading postulations:", error);
    return <PostulationsClient userId={user.id} initialPostulations={[]} />;
  }
}

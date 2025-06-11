import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export default async function ProfessionalsPage() {
  const supabase = await createClient();

  // Obtiene el usuario autenticado desde la sesión
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Consulta el perfil en la tabla users (o profiles si así se llama)
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return encodedRedirect("error", "/dashboard", "Perfil no encontrado");
  }

  if (profile.account_type !== "professional") {
    return encodedRedirect("error", "/dashboard", "Acceso no autorizado");
  }

  // Renderiza la página de profesionales con los datos del perfil
  return (
    <div>
      <h1>
        Bienvenido, {profile.first_name} {profile.last_name}
      </h1>
      {/* Aquí puedes agregar más contenido relacionado con el perfil profesional */}
    </div>
  );
}

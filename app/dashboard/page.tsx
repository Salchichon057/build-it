import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function UserDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-5xl mx-auto p-5">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a BuildIt</h1>
        <p>
          Esta es tu área protegida. Aquí puedes gestionar tus proyectos y
          postulaciones.
        </p>
      </main>
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { notificationService } from "@/lib/notifications/service/notificationService";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/sign-in");
  }

  // Obtener las notificaciones del usuario
  try {
    const notifications = await notificationService.getAllForUser(user.id);
    return <NotificationsClient userId={user.id} initialNotifications={notifications} />;
  } catch (error) {
    console.error("Error loading notifications:", error);
    return <NotificationsClient userId={user.id} initialNotifications={[]} />;
  }
}

// /lib/notifications/actions/notificationActions.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { notificationService } from "../service/notificationService";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction(userId: string) {
    if (!userId) throw new Error("El userId es requerido");
    return await notificationService.getAllForUser(userId);
}

export async function getMyNotificationsAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuario no autenticado");
    
    return await notificationService.getAllForUser(user.id);
}

export async function getUnreadCountAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 0;
    
    const notifications = await notificationService.getAllForUser(user.id);
    return notifications.filter(n => !n.read).length;
}

export async function markNotificationAsReadAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    const notif = await notificationService.markAsRead(id);
    revalidatePath("/dashboard/notifications");
    return notif;
}

const allowedTypes = ["message", "project_update", "postulation_status", "general"] as const;
type NotificationType = typeof allowedTypes[number];

export async function createNotificationAction(notification: { user_id: string; type: string; title: string; message: string }) {
    if (!notification.user_id) throw new Error("El user_id es requerido");
    if (!notification.type) throw new Error("El type es requerido");
    if (!notification.title) throw new Error("El title es requerido");
    if (!notification.message) throw new Error("El message es requerido");
    if (!allowedTypes.includes(notification.type as NotificationType)) {
        throw new Error(`El type debe ser uno de: ${allowedTypes.join(", ")}`);
    }
    const created = await notificationService.create({
        ...notification,
        type: notification.type as NotificationType
    });
    revalidatePath("/dashboard/notifications");
    return created;
}

export async function deleteNotificationAction(id: string) {
    if (!id) throw new Error("El id es requerido");
    await notificationService.delete(id);
    revalidatePath("/dashboard/notifications");
    return { success: true };
}
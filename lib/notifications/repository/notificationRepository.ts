// /lib/notifications/repository/notificationRepository.ts
import { createClient } from "@/utils/supabase/server";
import { createAnonClient } from "@/utils/supabase/anon";
import { Notification } from "../model/notification";

export const notificationRepository = {
    getAllForUser: async (userId: string): Promise<Notification[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error) throw new Error("Error fetching notifications");
        return data as Notification[];
    },

    markAsRead: async (id: string): Promise<Notification> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw new Error("Error marking notification as read");
        return data as Notification;
    },

    create: async (notification: Omit<Notification, "id" | "created_at" | "read"> & { read?: boolean }): Promise<Notification | null> => {
        try {
            // Usar cliente anónimo para inserción (ya probado que funciona)
            const supabase = createAnonClient();
            const { data, error } = await supabase
                .from("notifications")
                .insert([notification])
                .select("*")
                .single();
            
            if (error) {
                console.error("Error creating notification:", error);
                
                // Si es un error de RLS, retornar null sin lanzar error
                if (error.code === '42501') {
                    console.warn("🔒 RLS blocking notification creation. This is expected if service role key is not configured.");
                    console.warn("💡 To enable notifications, configure SUPABASE_SERVICE_ROLE_KEY or adjust RLS policies.");
                    console.warn("📧 Notification that would have been created:", JSON.stringify(notification, null, 2));
                    return null;
                }
                
                throw new Error(`Error creating notification: ${error.message}`);
            }
            
            return data as Notification;
        } catch (err: any) {
            // Re-throw con contexto adicional
            if (err.message?.includes('RLS_ERROR:')) {
                throw err; // Ya tiene el formato correcto
            }
            throw new Error(`Notification creation failed: ${err.message}`);
        }
    },

    delete: async (id: string): Promise<void> => {
        const supabase = await createClient();
        const { error } = await supabase.from("notifications").delete().eq("id", id);
        if (error) throw new Error("Error deleting notification");
    },
};
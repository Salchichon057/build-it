// /lib/notifications/repository/notificationRepository.ts
import { createClient } from "@/utils/supabase/server";
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

    create: async (notification: Omit<Notification, "id" | "created_at" | "read"> & { read?: boolean }): Promise<Notification> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("notifications")
            .insert([notification])
            .select("*")
            .single();
        if (error) throw new Error("Error creating notification");
        return data as Notification;
    },

    delete: async (id: string): Promise<void> => {
        const supabase = await createClient();
        const { error } = await supabase.from("notifications").delete().eq("id", id);
        if (error) throw new Error("Error deleting notification");
    },
};
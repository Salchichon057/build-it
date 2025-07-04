import { createClient } from "@/utils/supabase/client";
import type { Notification } from "../model/notification";

export class NotificationServiceClient {
    private supabase = createClient();

    async getAllForUser(userId: string): Promise<Notification[]> {
        const { data, error } = await this.supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching notifications:", error);
            throw new Error(error.message);
        }

        return data || [];
    }

    async getUnreadCount(userId: string): Promise<number> {
        const { data, error } = await this.supabase
            .from("notifications")
            .select("id")
            .eq("user_id", userId)
            .eq("read", false);

        if (error) {
            console.error("Error fetching unread count:", error);
            return 0;
        }

        return data?.length || 0;
    }

    async markAsRead(id: string): Promise<Notification | null> {
        const { data, error } = await this.supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error marking notification as read:", error);
            throw new Error(error.message);
        }

        return data;
    }
}

export const notificationServiceClient = new NotificationServiceClient();

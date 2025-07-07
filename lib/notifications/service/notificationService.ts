import { Notification } from "../model/notification";
import { notificationRepository } from "../repository/notificationRepository";

export const notificationService = {
    getAllForUser: async (userId: string): Promise<Notification[]> => {
        return await notificationRepository.getAllForUser(userId);
    },
    markAsRead: async (id: string): Promise<Notification> => {
        return await notificationRepository.markAsRead(id);
    },
    create: async (notification: Omit<Notification, "id" | "created_at" | "read">): Promise<Notification | null> => {
        // Puedes setear read: false aquí si quieres
        return await notificationRepository.create({ ...notification, read: false });
    },
    delete: async (id: string): Promise<void> => {
        return await notificationRepository.delete(id);
    },
};
export interface Notification {
    id: string;
    user_id: string; // destinatario
    type: "project_update" | "postulation_status" | "message" | "general"; // Coincide con CHECK constraint de la BD
    title: string;
    message: string;
    read: boolean;
    created_at: string; // ISO string
    priority?: string; // text sin restricción en la BD
    action_url?: string; // text opcional
    project_id?: string; // uuid opcional
    postulation_id?: string; // uuid opcional
}
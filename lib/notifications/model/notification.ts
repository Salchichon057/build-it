export interface Notification {
    id: string;
    user_id: string; // destinatario
    type: "project_update" | "postulation_status" | "message" | "general";
    title: string;
    message: string;
    read: boolean;
    created_at: string; // ISO string
    // Puedes agregar campos extra según tu lógica
    // project_id?: string;
    // postulation_id?: string;
}
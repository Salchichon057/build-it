export interface Project {
    id: string;
    title: string;
    description: string;
    client_id: string; // id del usuario que creó el proyecto
    status: "open" | "in_progress" | "completed" | "cancelled";
    budget?: number;
    location?: string;
    start_date?: string; // ISO string
    end_date?: string;   // ISO string
    created_at: string;  // ISO string
    updated_at?: string; // ISO string
    // Si tienes skills requeridas:
    skills?: string[]; // array de skill ids
}
export interface Project {
    id: string;
    title: string;
    description: string;
    users_id: string;
    status: "open" | "in_progress" | "completed" | "cancelled" | "closed"; // Coincide con CHECK constraint
    budget: number; // numeric NOT NULL en la BD
    location?: string; // text opcional
    start_date?: string; // date opcional (se envía como string)
    end_date?: string; // date opcional
    created_at: string;
    skills?: string[]; // ARRAY en la BD
    image_url?: string; // text opcional
    category_id?: string; // uuid opcional, FK a category
}
export interface Project {
    id: string;
    title: string;
    description: string;
    users_id: string;
    status: "open" | "in_progress" | "completed" | "cancelled" | "closed";
    budget?: number;
    location?: string;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at?: string;
    skills?: string[];
    image_url?: string;
    category_id?: string; // Relación directa con una categoría principal
}
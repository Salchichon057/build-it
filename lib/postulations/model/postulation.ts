export interface Postulation {
    id: string;
    project_id: string;
    professional_id: string; // id del usuario que postula
    cover_letter?: string;
    status: "pending" | "accepted" | "rejected" | "withdrawn";
    created_at: string; // ISO string
    updated_at?: string; // ISO string
}
export interface Postulation {
    id: string;
    projects_id: string; // Coincide con el esquema SQL
    users_id: string; // Coincide con el esquema SQL (profesional que postula)
    status: "pending" | "accepted" | "rejected" | "withdrawn";
    created_at: string;
}

// Interface extendida con datos del proyecto y usuario para mostrar en UI
export interface PostulationWithDetails extends Postulation {
    project: {
        id: string;
        title: string;
        description: string;
        budget: number;
        location: string;
        status: string;
        users_id: string; // ID del cliente
    };
    client: {
        id: string;
        first_name: string;
        last_name: string;
        phone?: string;
    };
}
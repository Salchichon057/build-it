// /lib/postulations/repository/postulationRepository.ts
import { createClient } from "@/utils/supabase/server";
import { Postulation, PostulationWithDetails } from "../model/postulation";

export const postulationRepository = {
    getAll: async (): Promise<Postulation[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase.from("postulations").select("*");
        if (error) throw new Error("Error fetching postulations");
        return data as Postulation[];
    },

    getById: async (id: string): Promise<Postulation | null> => {
        const supabase = await createClient();
        const { data, error } = await supabase.from("postulations").select("*").eq("id", id).single();
        if (error) return null;
        return data as Postulation;
    },

    // Obtener postulaciones de un profesional específico con detalles del proyecto y cliente
    getByProfessionalId: async (professionalId: string): Promise<PostulationWithDetails[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("postulations")
            .select(`
                id,
                projects_id,
                users_id,
                status,
                created_at,
                projects:projects_id (
                    id,
                    title,
                    description,
                    budget,
                    location,
                    status,
                    users_id
                ),
                client:projects_id (
                    users:users_id (
                        id,
                        first_name,
                        last_name,
                        phone
                    )
                )
            `)
            .eq("users_id", professionalId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching postulations:", error);
            throw new Error("Error al obtener postulaciones");
        }

        // Transformar los datos para que coincidan con PostulationWithDetails
        const transformedData = data?.map((item: any) => ({
            id: item.id,
            projects_id: item.projects_id,
            users_id: item.users_id,
            status: item.status,
            created_at: item.created_at,
            project: {
                id: item.projects.id,
                title: item.projects.title,
                description: item.projects.description,
                budget: item.projects.budget,
                location: item.projects.location,
                status: item.projects.status,
                users_id: item.projects.users_id
            },
            client: {
                id: item.client.users.id,
                first_name: item.client.users.first_name,
                last_name: item.client.users.last_name,
                phone: item.client.users.phone
            }
        })) || [];

        return transformedData as PostulationWithDetails[];
    },

    // Obtener postulaciones para un proyecto específico
    getByProjectId: async (projectId: string): Promise<PostulationWithDetails[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("postulations")
            .select(`
                id,
                projects_id,
                users_id,
                status,
                created_at,
                professional:users_id (
                    id,
                    first_name,
                    last_name,
                    phone,
                    speciality,
                    experience_years
                )
            `)
            .eq("projects_id", projectId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching project postulations:", error);
            throw new Error("Error al obtener postulaciones del proyecto");
        }

        return data as any[] || [];
    },

    create: async (postulation: Omit<Postulation, "id" | "created_at">): Promise<Postulation> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("postulations")
            .insert([postulation])
            .select("*")
            .single();
        if (error) {
            console.error("Error creating postulation:", error);
            throw new Error("Error al crear postulación");
        }
        return data as Postulation;
    },

    update: async (id: string, postulation: Partial<Postulation>): Promise<Postulation> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("postulations")
            .update(postulation)
            .eq("id", id)
            .select("*")
            .single();
        if (error) {
            console.error("Error updating postulation:", error);
            throw new Error("Error al actualizar postulación");
        }
        return data as Postulation;
    },

    delete: async (id: string): Promise<void> => {
        const supabase = await createClient();
        const { error } = await supabase.from("postulations").delete().eq("id", id);
        if (error) {
            console.error("Error deleting postulation:", error);
            throw new Error("Error al eliminar postulación");
        }
    },

    // Verificar si un profesional ya postuló a un proyecto
    checkExistingPostulation: async (professionalId: string, projectId: string): Promise<boolean> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("postulations")
            .select("id")
            .eq("users_id", professionalId)
            .eq("projects_id", projectId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error("Error checking postulation:", error);
            return false;
        }

        return !!data;
    }
};
// /lib/projects/repository/projectRepository.ts
import { createClient } from "@/utils/supabase/server";
import { Project } from "../model/project";

export const projectRepository = {
    getAll: async (): Promise<Project[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase.from("projects").select("*");
        if (error) throw new Error("Error al obtener los proyectos");
        return data as Project[];
    },

    getByClientId: async (users_id: string): Promise<Project[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("users_id", users_id);
        if (error) throw new Error("Error al obtener los proyectos del cliente");
        return data as Project[];
    },

    getById: async (id: string): Promise<Project | null> => {
        const supabase = await createClient();
        const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
        if (error) return null;
        return data as Project;
    },

    create: async (project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("projects")
            .insert([project])
            .select("*")
            .single();
        if (error) {
            console.error("Error al crear el proyecto:", error, project);
            throw new Error("Error al crear el proyecto: " + error.message);
        }
        return data as Project;
    },

    update: async (id: string, project: Partial<Project>): Promise<Project> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("projects")
            .update(project)
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw new Error("Error al actualizar el proyecto");
        return data as Project;
    },

    delete: async (id: string): Promise<void> => {
        const supabase = await createClient();
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw new Error("Error al eliminar el proyecto");
    },
};
// /lib/postulations/repository/postulationRepository.ts
import { createClient } from "@/utils/supabase/server";
import { Postulation } from "../model/postulation";

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

    create: async (postulation: Omit<Postulation, "id" | "created_at" | "updated_at" | "status"> & { status?: string }): Promise<Postulation> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("postulations")
            .insert([postulation])
            .select("*")
            .single();
        if (error) throw new Error("Error creating postulation");
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
        if (error) throw new Error("Error updating postulation");
        return data as Postulation;
    },

    delete: async (id: string): Promise<void> => {
        const supabase = await createClient();
        const { error } = await supabase.from("postulations").delete().eq("id", id);
        if (error) throw new Error("Error deleting postulation");
    },
};
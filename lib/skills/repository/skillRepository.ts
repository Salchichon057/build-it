import { createClient } from "@/utils/supabase/server";
import { Skill } from "../model/skill";

export const skillRepository = {
  getAvailableSkills: async (): Promise<Skill[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("skills").select("id, name");
    if (error) throw new Error("Error fetching skills");
    return data as Skill[];
  },
};
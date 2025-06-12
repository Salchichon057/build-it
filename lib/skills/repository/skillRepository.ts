import { createClient } from "@/utils/supabase/server";
import { Skill } from "../model/skill";

export const skillRepository = {
  getAvailableSkills: async (): Promise<Skill[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("skills").select("id, name");
    if (error) throw new Error("Error fetching skills");
    return data as Skill[];
  },

  createSkill: async (name: string): Promise<Skill> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .insert([{ name }])
      .select("id, name")
      .single();
    if (error) throw new Error("Error creating skill");
    return data as Skill;
  },

  updateSkill: async (id: string, name: string): Promise<Skill> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .update({ name })
      .eq("id", id)
      .select("id, name")
      .single();
    if (error) throw new Error("Error updating skill");
    return data as Skill;
  },

  deleteSkill: async (id: string): Promise<void> => {
    const supabase = await createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw new Error("Error deleting skill");
  },
};
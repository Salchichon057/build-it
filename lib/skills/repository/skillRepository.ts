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

  updateUserSkills: async (userId: string, skillIds: string[]): Promise<void> => {
    const supabase = await createClient();
    
    // Primero eliminar todos los skills actuales del usuario
    const { error: deleteError } = await supabase
      .from("user_skills")
      .delete()
      .eq("users_id", userId);
    
    if (deleteError) {
      throw new Error("Error eliminando skills anteriores: " + deleteError.message);
    }

    // Si hay skills para agregar, insertarlos
    if (skillIds.length > 0) {
      const skillsToInsert = skillIds.map(skillId => ({
        users_id: userId,
        skills_id: skillId  // Cambié skill_id por skills_id
      }));

      const { error: insertError } = await supabase
        .from("user_skills")
        .insert(skillsToInsert);

      if (insertError) {
        throw new Error("Error agregando nuevos skills: " + insertError.message);
      }
    }
  },
};
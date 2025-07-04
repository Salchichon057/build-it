import { skillRepository } from "../repository/skillRepository";
import { Skill } from "../model/skill";

export const skillService = {
  getAvailableSkills: async (): Promise<Skill[]> => {
    return await skillRepository.getAvailableSkills();
  },
  createSkill: async (name: string): Promise<Skill> => {
    // Aquí puedes agregar validaciones de negocio si necesitas
    return await skillRepository.createSkill(name);
  },
  updateSkill: async (id: string, name: string): Promise<Skill> => {
    return await skillRepository.updateSkill(id, name);
  },
  deleteSkill: async (id: string): Promise<void> => {
    return await skillRepository.deleteSkill(id);
  },
  updateUserSkills: async (userId: string, skillIds: string[]): Promise<void> => {
    return await skillRepository.updateUserSkills(userId, skillIds);
  },
};
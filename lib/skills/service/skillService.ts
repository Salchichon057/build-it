import { skillRepository } from "../repository/skillRepository";
import { Skill } from "../model/skill";

export const skillService = {
  getAvailableSkills: async (): Promise<Skill[]> => {
    return await skillRepository.getAvailableSkills();
  },
};
// /lib/projects/service/projectService.ts
import { Project } from "../model/project";
import { projectRepository } from "../repository/projectRepository";

export const projectService = {
    getAll: async (): Promise<Project[]> => {
        return await projectRepository.getAll();
    },
    getById: async (id: string): Promise<Project | null> => {
        return await projectRepository.getById(id);
    },
    create: async (project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> => {
        // Validaciones de negocio aquí si necesitas
        return await projectRepository.create(project);
    },
    update: async (id: string, project: Partial<Project>): Promise<Project> => {
        return await projectRepository.update(id, project);
    },
    delete: async (id: string): Promise<void> => {
        return await projectRepository.delete(id);
    },
};
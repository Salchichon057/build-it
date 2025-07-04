import { Postulation, PostulationWithDetails } from "../model/postulation";
import { postulationRepository } from "../repository/postulationRepository";

export const postulationService = {
    getAll: async (): Promise<Postulation[]> => {
        return await postulationRepository.getAll();
    },
    
    getById: async (id: string): Promise<Postulation | null> => {
        return await postulationRepository.getById(id);
    },
    
    getByProfessionalId: async (professionalId: string): Promise<PostulationWithDetails[]> => {
        return await postulationRepository.getByProfessionalId(professionalId);
    },
    
    getByProjectId: async (projectId: string): Promise<PostulationWithDetails[]> => {
        return await postulationRepository.getByProjectId(projectId);
    },
    
    create: async (postulation: Omit<Postulation, "id" | "created_at">): Promise<Postulation> => {
        return await postulationRepository.create(postulation);
    },
    
    update: async (id: string, postulation: Partial<Postulation>): Promise<Postulation> => {
        return await postulationRepository.update(id, postulation);
    },
    
    delete: async (id: string): Promise<void> => {
        return await postulationRepository.delete(id);
    },
    
    checkExistingPostulation: async (professionalId: string, projectId: string): Promise<boolean> => {
        return await postulationRepository.checkExistingPostulation(professionalId, projectId);
    },
    
    // Métodos de negocio
    acceptPostulation: async (postulationId: string): Promise<void> => {
        await postulationRepository.update(postulationId, { status: "accepted" });
    },
    
    rejectPostulation: async (postulationId: string): Promise<void> => {
        await postulationRepository.update(postulationId, { status: "rejected" });
    },
    
    withdrawPostulation: async (postulationId: string): Promise<void> => {
        await postulationRepository.update(postulationId, { status: "withdrawn" });
    }
};
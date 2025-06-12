import { Postulation } from "../model/postulation";
import { postulationRepository } from "../repository/postulationRepository";

export const postulationService = {
    getAll: async (): Promise<Postulation[]> => {
        return await postulationRepository.getAll();
    },
    getById: async (id: string): Promise<Postulation | null> => {
        return await postulationRepository.getById(id);
    },
    create: async (postulation: Omit<Postulation, "id" | "created_at" | "updated_at" | "status">): Promise<Postulation> => {
        // Puedes setear status inicial aquí si quieres
        return await postulationRepository.create({ ...postulation, status: "pending" });
    },
    update: async (id: string, postulation: Partial<Postulation>): Promise<Postulation> => {
        return await postulationRepository.update(id, postulation);
    },
    delete: async (id: string): Promise<void> => {
        return await postulationRepository.delete(id);
    },
};
import { storageService } from "../service/storageService";
import { StoredFile } from "../model/bucket";


const MAX_CV_SIZE = 5 * 1024 * 1024;
const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;


export const storageController = {
	uploadCV: async (file: File, userId: string): Promise<StoredFile> => {
		if (!file || file.size === 0) {
			throw new Error("No se proporcionó un archivo de CV o el archivo está vacío.");
		}
		const allowedTypes = [
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		];
		if (!allowedTypes.includes(file.type)) {
			throw new Error("Solo se permiten archivos PDF o DOCX para el CV.");
		}
		if (file.size > MAX_CV_SIZE) {
			throw new Error(`El tamaño del archivo de CV excede el límite máximo de ${MAX_CV_SIZE / (1024 * 1024)}MB.`);
		}
		return await storageService.uploadCV(file, userId);
	},

	uploadProfileImage: async (file: File, userId: string): Promise<StoredFile> => {
		if (!file || file.size === 0) {
			throw new Error("No se proporcionó una imagen de perfil o el archivo está vacío.");
		}
		const allowedTypes = ["image/png", "image/jpeg"];
		if (!allowedTypes.includes(file.type)) {
			throw new Error("Solo se permiten archivos PNG o JPEG para la imagen de perfil.");
		}
		if (file.size > MAX_PROFILE_IMAGE_SIZE) {
			throw new Error(`El tamaño de la imagen de perfil excede el límite máximo de ${MAX_PROFILE_IMAGE_SIZE / (1024 * 1024)}MB.`);
		}
		return await storageService.uploadProfileImage(file, userId);
	},

	deleteCV: async (fileName: string): Promise<void> => {
		try {
			await storageService.deleteCV(fileName);
		} catch (error) {
			throw new Error(`Error al eliminar el CV: ${(error as Error).message}`);
		}
	},

	deleteProfileImage: async (fileName: string): Promise<void> => {
		try {
			await storageService.deleteProfileImage(fileName);
		} catch (error) {
			throw new Error(`Error al eliminar la imagen de perfil: ${(error as Error).message}`);
		}
	},
};
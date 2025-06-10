import { storageService } from "../service/storageService";
import { StoredFile } from "../model/bucket";

export const storageController = {
	uploadCV: async (formData: FormData): Promise<StoredFile> => {
		const file = formData.get("cv_file") as File | null;
		const email = formData.get("email")?.toString();
		const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

		if (!file || file.size === 0 || !email) {
			throw new Error("No se proporcionó un archivo de CV, el archivo está vacío o falta el email.");
		}

		// Validación del tipo de archivo
		const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
		if (!allowedTypes.includes(file.type)) {
			throw new Error("Solo se permiten archivos PDF o DOCX para el CV.");
		}

		// Validación del tamaño del archivo
		if (file.size > MAX_CV_SIZE) {
			throw new Error(`El tamaño del archivo de CV excede el límite máximo de ${MAX_CV_SIZE / (1024 * 1024)}MB.`);
		}

		try {
			return await storageService.uploadCV(file, email);
		} catch (error) {
			throw new Error(`Error al subir el CV: ${(error as Error).message}`);
		}
	},

	uploadProfileImage: async (formData: FormData): Promise<StoredFile> => {
		const file = formData.get("profile_image") as File | null;
		const email = formData.get("email")?.toString();
		const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

		if (!file || file.size === 0 || !email) {
			throw new Error("No se proporcionó una imagen de perfil, el archivo está vacío o falta el email.");
		}

		// Validación del tipo de archivo
		const allowedTypes = ["image/png", "image/jpeg"];
		if (!allowedTypes.includes(file.type)) {
			throw new Error("Solo se permiten archivos PNG o JPEG para la imagen de perfil.");
		}

		// Validación del tamaño del archivo
		if (file.size > MAX_PROFILE_IMAGE_SIZE) {
			throw new Error(`El tamaño de la imagen de perfil excede el límite máximo de ${MAX_PROFILE_IMAGE_SIZE / (1024 * 1024)}MB.`);
		}

		try {
			return await storageService.uploadProfileImage(file, email);
		} catch (error) {
			throw new Error(`Error al subir la imagen de perfil: ${(error as Error).message}`);
		}
	},

	renameFile: async (bucket: string, oldFileName: string, newFileName: string): Promise<StoredFile> => {
		try {
			return await storageService.renameFile(bucket, oldFileName, newFileName);
		} catch (error) {
			throw new Error(`Error al renombrar el archivo: ${(error as Error).message}`);
		}
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
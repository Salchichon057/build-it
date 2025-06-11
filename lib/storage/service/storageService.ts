import { storageRepository } from "../repository/storageRepository";
import { StoredFile } from "../model/bucket";

export const storageService = {
	uploadCV: async (file: File, userId: string): Promise<StoredFile> => {
		const bucket = "cvs";
		const fileName = `${userId}-cv${getFileExtension(file.name)}`;
		return await storageRepository.uploadFile(bucket, fileName, file);
	},

	uploadProfileImage: async (file: File, userId: string): Promise<StoredFile> => {
		const bucket = "profile-image";
		const fileName = `${userId}-profile-img${getFileExtension(file.name)}`;
		return await storageRepository.uploadFile(bucket, fileName, file);
	},

	deleteCV: async (fileName: string): Promise<void> => {
		const bucket = "cvs";
		await storageRepository.deleteFile(bucket, fileName);
	},

	deleteProfileImage: async (fileName: string): Promise<void> => {
		const bucket = "profile-image";
		await storageRepository.deleteFile(bucket, fileName);
	},
};

function getFileExtension(filename: string): string {
	const match = filename.match(/\.[^.]+$/);
	return match ? match[0] : "";
}
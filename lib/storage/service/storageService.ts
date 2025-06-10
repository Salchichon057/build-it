import { storageRepository } from "../repository/storageRepository";
import { StoredFile } from "../model/bucket";
import { createClient } from "@/utils/supabase/server";

export const storageService = {
	uploadCV: async (file: File, email: string): Promise<StoredFile> => {
		const bucket = "cvs";
		const fileName = `${email}-${Date.now()}-${file.name}`;
		return await storageRepository.uploadFile(bucket, fileName, file);
	},

	uploadProfileImage: async (file: File, email: string): Promise<StoredFile> => {
		const bucket = "profile-images";
		const fileName = `${email}-${Date.now()}-${file.name}`;
		return await storageRepository.uploadFile(bucket, fileName, file);
	},

	renameFile: async (bucket: string, oldFileName: string, newFileName: string): Promise<StoredFile> => {
		const supabase = await createClient();
		// Descargar el archivo original
		const { data: fileData, error: downloadError } = await supabase.storage
			.from(bucket)
			.download(oldFileName);

		if (downloadError || !fileData) {
			throw new Error(`Failed to download file for renaming: ${downloadError?.message}`);
		}

		// Subir el archivo con el nuevo nombre
		const { error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(newFileName, fileData, { upsert: true });

		if (uploadError) {
			throw new Error(`Failed to upload renamed file: ${uploadError.message}`);
		}

		// Eliminar el archivo original
		const { error: deleteError } = await supabase.storage
			.from(bucket)
			.remove([oldFileName]);

		if (deleteError) {
			throw new Error(`Failed to delete original file after renaming: ${deleteError.message}`);
		}

		const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(newFileName);
		if (!publicUrlData.publicUrl) {
			throw new Error("Failed to get public URL for the renamed file");
		}

		return {
			name: newFileName,
			bucket,
			publicUrl: publicUrlData.publicUrl,
		};
	},

	deleteCV: async (fileName: string): Promise<void> => {
		const bucket = "cvs";
		await storageRepository.deleteFile(bucket, fileName);
	},

	deleteProfileImage: async (fileName: string): Promise<void> => {
		const bucket = "profile-images";
		await storageRepository.deleteFile(bucket, fileName);
	},
};
import { createClient } from "@/utils/supabase/server";
import { StoredFile } from "../model/bucket";

export const storageRepository = {
	uploadFile: async (bucket: string, fileName: string, file: File): Promise<StoredFile> => {
		const supabase = await createClient();
		const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
			upsert: true,
		});

		if (error) {
			throw new Error(`Failed to upload file to ${bucket}: ${error.message}`);
		}

		const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
		if (!data.publicUrl) {
			throw new Error("Failed to get public URL for the uploaded file");
		}

		return {
			name: fileName,
			bucket,
			publicUrl: data.publicUrl,
		};
	},

	deleteFile: async (bucket: string, fileName: string): Promise<void> => {
		const supabase = await createClient();
		const { error } = await supabase.storage.from(bucket).remove([fileName]);

		if (error) {
			throw new Error(`Failed to delete file from ${bucket}: ${error.message}`);
		}
	},
};
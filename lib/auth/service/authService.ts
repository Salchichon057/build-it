import { User } from "@/lib/auth/model/user";
import { authRepository } from "../repository/authRepository";

export const authService = {
	signUp: async (email: string, password: string, userData: Omit<User, "id" | "created_at">, options: { emailRedirectTo: string }) => {
		const { data: authData, error: authError } = await authRepository.signUp(email, password, options);
		if (authError) {
			console.error("Auth error:", authError.message || authError);
			return { data: null, error: authError.message || String(authError) };
		}

		const { error: dbError } = await authRepository.insertUser(userData);
		if (dbError) {
			console.error("Database error:", dbError.message || dbError);
			return { data: null, error: dbError.message || String(dbError) };
		}

		console.log("User data inserted successfully for email:", email);
		return { data: authData, error: null };
	},
	signIn: async (email: string, password: string) => {
		const { data, error } = await authRepository.signIn(email, password);
		return { data, error };
	},

	forgotPassword: async (email: string, redirectTo: string) => {
		const { data, error } = await authRepository.forgotPassword(email, redirectTo);
		return { data, error };
	},

	resetPassword: async (password: string) => {
		const { data, error } = await authRepository.resetPassword(password);
		return { data, error };
	},

	signOut: async () => {
		const { error } = await authRepository.signOut();
		return { error };
	},

	updateProfile: async (userId: string, userData: Partial<User>) => {
		const { data, error } = await authRepository.updateUser(userId, userData);
		return { data, error };
	},
};
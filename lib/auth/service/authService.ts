import { User } from "@/lib/auth/model/user";
import { authRepository } from "../repository/authRepository";

export const authService = {
	signUp: async (email: string, password: string, userData: Omit<User, "id" | "created_at">, options: { emailRedirectTo: string }) => {
		const { data: authData, error: authError } = await authRepository.signUp(email, password, options);
		if (authError) throw authError;

		const { error: dbError } = await authRepository.insertUser(userData);
		if (dbError) throw dbError;

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
};
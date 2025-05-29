import { User } from "@/lib/auth/model/user";
import { createClient } from "@/utils/supabase/server";

export const authRepository = {
	signUp: async (email: string, password: string, options: { emailRedirectTo: string }) => {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.signUp({ email, password, options });
		return { data, error };
	},

	signIn: async (email: string, password: string) => {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		return { data, error };
	},

	forgotPassword: async (email: string, redirectTo: string) => {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
		return { data, error };
	},

	resetPassword: async (password: string) => {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.updateUser({ password });
		return { data, error };
	},

	signOut: async () => {
		const supabase = await createClient();
		const { error } = await supabase.auth.signOut();
		return { error };
	},

	insertUser: async (userData: Omit<User, "id" | "created_at">) => {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("users")
			.insert(userData)
			.select("id")
			.single();
		return { data, error };
	},
};
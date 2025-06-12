import { createClient } from "@/utils/supabase/client";
import type { User } from "@/lib/auth/model/user";

export const getUserProfile = async (userId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", userId)
		.single();
	return { data: data as User | null, error };
};
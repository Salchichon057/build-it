import { createClient } from '@supabase/supabase-js';

// Cliente para operaciones que no requieren autenticación estricta
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createAnonClient = () => {
    return createClient(supabaseUrl, supabaseKey);
};

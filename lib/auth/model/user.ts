export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string | null; // date opcional
  phone: string | null; // character varying opcional
  account_type: "client" | "professional"; // NOT NULL con CHECK constraint
  account_category: "enterprise" | "person" | null; // opcional con CHECK constraint
  speciality: string | null; // character varying opcional
  cv_url: string | null; // text opcional
  profile_image: string | null; // text opcional
  address: string | null; // text opcional
  experience_years: string | null; // text opcional
  created_at?: string; // timestamp with time zone con DEFAULT
}
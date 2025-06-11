export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string | null;
  phone: string | null;
  account_type: "client" | "professional";
  account_category: "enterprise" | "person";
  speciality: string | null;
  cv_url: string | null;
  profile_image: string | null;
  address: string | null;
  experience_years?: string | null;
}
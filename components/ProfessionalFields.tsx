import { InputGroup } from "@/components/InputGroup";
import { SkillSelector } from "./SkillSelector";
import styles from "@/styles/auth/login.module.css";
import { Dispatch, SetStateAction } from "react";
import { validateFile } from "@/lib/validators/fileValidation";

export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  phone: string;
  account_type: string;
  account_category: string;
  speciality: string;
  experience_years: string;
  skills: string[];
  cv_file: File | null;
  profile_image: File | null;
  address: string;
  password: string;
  confirmPassword: string;
}

interface ProfessionalFieldsProps {
  formData: RegisterFormData;
  setFormData: Dispatch<SetStateAction<RegisterFormData>>;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
  availableSkills: any[];
}

export function ProfessionalFields({
  formData,
  setFormData,
  errors,
  setErrors,
  availableSkills,
}: ProfessionalFieldsProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const input = e.target as HTMLInputElement;
    const files = input.files;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] || value : value,
    }));
    if (files) {
      const error = validateFile(files[0], name as "cv_file" | "profile_image");
      setErrors({ ...errors, [name]: error || "" });
    }
  };

  return (
    <>
      <InputGroup
        label="Especialidad"
        id="speciality"
        name="speciality"
        type="text"
        value={formData.speciality || ""}
        onChange={handleChange}
        placeholder="Ejemplo: Arquitecto, Ingeniero Civil"
        error={errors.speciality}
      />
      <InputGroup
        label="Años de Experiencia"
        id="experience_years"
        name="experience_years"
        type="number"
        value={formData.experience_years || ""}
        onChange={handleChange}
        placeholder="Ejemplo: 5"
        error={errors.experience_years}
      />
      <SkillSelector
        skills={formData.skills || []}
        availableSkills={availableSkills}
        onSkillSelect={(skillId) =>
          setFormData((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), skillId],
          }))
        }
        onSkillRemove={(skillId) =>
          setFormData((prev) => ({
            ...prev,
            skills: (prev.skills || []).filter((id: string) => id !== skillId),
          }))
        }
        maxSkills={5}
        errors={errors}
        setErrors={setErrors}
      />
      <InputGroup
        label="Currículo"
        id="cv_file"
        name="cv_file"
        type="file"
        value={formData.cv_file ? formData.cv_file.name : ""}
        onChange={handleChange}
        accept=".pdf,.docx"
        error={errors.cv_file}
      />
      <InputGroup
        label="Foto de Perfil"
        id="profile_image"
        name="profile_image"
        type="file"
        value={formData.profile_image ? formData.profile_image.name : ""}
        onChange={handleChange}
        accept=".png,.jpg,.jpeg"
        error={errors.profile_image}
      />
      <InputGroup
        label="Dirección"
        id="address"
        name="address"
        type="text"
        value={formData.address || ""}
        onChange={handleChange}
        placeholder="Ejemplo: CDMX, Monterrey, Guadalajara"
        error={errors.address}
      />
    </>
  );
}

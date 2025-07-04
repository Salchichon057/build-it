"use client";

import { useState, useTransition, useEffect } from "react";
import { Skill } from "@/lib/skills/model/skill";
import { InputGroup } from "@/components/InputGroup";
import { SubmitButton } from "@/components/submit-button";
import { SkillSelector } from "@/components/SkillSelector";
import styles from "@/styles/auth/login.module.css";
import { createClient } from "@/utils/supabase/client";
import { updateProfileAction } from "./actions";
import { validateFile } from "@/lib/validators/fileValidation";

interface UpdateProfileResponse {
  error?: string;
  success?: string;
}

export default function CompleteProfileClient({
  initialSkills,
}: {
  initialSkills: Skill[];
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthdate: "",
    phone: "",
    speciality: "",
    experience_years: "",
    skills: [] as string[],
    cv_file: null as File | null,
    profile_image: null as File | null,
    address: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPending, startTransition] = useTransition();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  if (!userId) return <div>Cargando...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;

    // Si es archivo, valida antes de setear
    if (files && files[0]) {
      const error = validateFile(files[0], name as "cv_file" | "profile_image");
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
      if (error) {
        // No actualices el formData si hay error
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSkillSelect = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillId],
    }));
  };

  const handleSkillRemove = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((id) => id !== skillId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de años de experiencia
    const experienceYears = Number(formData.experience_years);
    if (
      isNaN(experienceYears) ||
      experienceYears < 0 ||
      !Number.isInteger(experienceYears)
    ) {
      setErrors({
        ...errors,
        experience_years: "Debe ser un número entero mayor o igual a 0",
      });
      return;
    }

    // Validación de archivos antes de enviar
    const cvError = validateFile(formData.cv_file, "cv_file");
    const imgError = validateFile(formData.profile_image, "profile_image");
    if (cvError || imgError) {
      setErrors((prev) => ({
        ...prev,
        cv_file: cvError || "",
        profile_image: imgError || "",
      }));
      return;
    }

    // Si NO es el último paso, solo avanza el stepper
    if (step < 3) {
      setStep(step + 1);
      setErrors({});
      return;
    }

    // Solo en el último paso, envía al servidor
    const form = e.currentTarget as HTMLFormElement;
    const formDataToSubmit = new FormData(form);

    // Adjunta los archivos manualmente si no están en el form
    if (formData.cv_file) formDataToSubmit.set("cv_file", formData.cv_file);
    if (formData.profile_image)
      formDataToSubmit.set("profile_image", formData.profile_image);

    startTransition(async () => {
      const response: UpdateProfileResponse =
        await updateProfileAction(formDataToSubmit);
      if (response?.error) {
        setErrors({ general: response.error });
      } else {
        window.location.href = "/dashboard/professionals";
      }
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Bienvenido, completa tu perfil</h1>
        <div className="mb-4">
          <p>Paso {step} de 3</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <InputGroup
                label="Fecha de Nacimiento"
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                error={errors.birthdate}
                autoComplete="bday"
              />
              <InputGroup
                label="Teléfono"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ejemplo: +56 9 1234 5678"
                error={errors.phone}
                autoComplete="tel"
              />
              <InputGroup
                label="Especialidad"
                id="speciality"
                name="speciality"
                type="text"
                value={formData.speciality}
                onChange={handleChange}
                placeholder="Ejemplo: Arquitectura"
                error={errors.speciality}
              />
              <InputGroup
                label="Años de Experiencia"
                id="experience_years"
                name="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="Ejemplo: 5"
                error={errors.experience_years}
              />
            </>
          )}

          {step === 2 && (
            <>
              <SkillSelector
                skills={formData.skills}
                availableSkills={initialSkills}
                onSkillSelect={handleSkillSelect}
                onSkillRemove={handleSkillRemove}
                maxSkills={5}
                errors={errors}
                setErrors={setErrors}
              />
            </>
          )}

          {step === 3 && (
            <>
              <InputGroup
                label="Currículo (PDF o DOCX)"
                id="cv_file"
                name="cv_file"
                type="file"
                value=""
                onChange={handleChange}
                accept=".pdf,.docx"
                error={errors.cv_file}
              />
              <InputGroup
                label="Foto de Perfil (PNG o JPEG)"
                id="profile_image"
                name="profile_image"
                type="file"
                value=""
                onChange={handleChange}
                accept=".png,.jpg,.jpeg"
                error={errors.profile_image}
              />
              <InputGroup
                label="Dirección"
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ejemplo: Av. Siempre Viva 123"
                error={errors.address}
                autoComplete="street-address"
              />
            </>
          )}

          {errors.general && (
            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Anterior
              </button>
            )}
            <SubmitButton
              pendingText="Guardando..."
              className={styles.submitButton}
              disabled={isPending}
              type="submit"
            >
              {step < 3 ? "Siguiente" : "Finalizar"}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition, useEffect } from "react";
import { Skill } from "@/lib/skills/model/skill";
import { InputGroup } from "@/components/InputGroup";
import { SubmitButton } from "@/components/submit-button";
import { SkillSelector } from "@/components/SkillSelector";
import styles from "@/styles/dashboard/complete-profile.module.css";
import { createClient } from "@/utils/supabase/client";
import { updateProfileAction } from "./actions";
import { validateFile } from "@/lib/validators/fileValidation";
import { useRouter } from "next/navigation";

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
  const [userAccountType, setUserAccountType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Obtener el tipo de cuenta del usuario
        const { data: profile } = await supabase
          .from("users")
          .select("account_type")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setUserAccountType(profile.account_type);
        }
      }
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
    if (step < 2) {
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
        // Redirigir según el tipo de cuenta
        const redirectPath = userAccountType === "client" 
          ? "/dashboard/professionals" 
          : "/dashboard/projects/available";
        router.push(redirectPath);
      }
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <i className="fa-solid fa-user-plus"></i>
            Completa tu perfil profesional
          </h1>
          <p className={styles.subtitle}>
            Ayúdanos a conocerte mejor para conectarte con las mejores oportunidades
          </p>
        </div>

        {/* Stepper mejorado */}
        <div className={styles.stepperContainer}>
          <div className={styles.stepper}>
            <div className={`${styles.stepItem} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>
                {step > 1 ? <i className="fa-solid fa-check"></i> : '1'}
              </div>
              <div className={styles.stepLabel}>
                <span>Información Profesional</span>
                <small>Especialidad, experiencia y habilidades</small>
              </div>
            </div>
            
            <div className={`${styles.stepItem} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>
                {step > 2 ? <i className="fa-solid fa-check"></i> : '2'}
              </div>
              <div className={styles.stepLabel}>
                <span>Documentos y Dirección</span>
                <small>CV, foto de perfil y ubicación</small>
              </div>
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progress} 
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Input hidden para enviar los skills */}
          <input 
            type="hidden" 
            name="skills" 
            value={JSON.stringify(formData.skills)} 
          />
          
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                <i className="fa-solid fa-user"></i>
                Información Profesional
              </h2>
              <p className={styles.stepDescription}>
                Cuéntanos sobre tu especialidad y experiencia profesional
              </p>
              
              <div className={styles.formGrid}>
                <InputGroup
                  label="Especialidad"
                  id="speciality"
                  name="speciality"
                  type="text"
                  value={formData.speciality}
                  onChange={handleChange}
                  placeholder="Ejemplo: Arquitectura, Ingeniería Civil"
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
                  min={0}
                />
              </div>
              
              <div className={styles.skillsSection}>
                <h3 className={styles.sectionTitle}>
                  <i className="fa-solid fa-tools"></i>
                  Habilidades y Competencias
                </h3>
                <p className={styles.sectionDescription}>
                  Selecciona hasta 5 habilidades que mejor describan tu experiencia
                </p>
                
                <SkillSelector
                  skills={formData.skills}
                  availableSkills={initialSkills}
                  onSkillSelect={handleSkillSelect}
                  onSkillRemove={handleSkillRemove}
                  maxSkills={5}
                  errors={errors}
                  setErrors={setErrors}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                <i className="fa-solid fa-file-upload"></i>
                Documentos y Dirección
              </h2>
              <p className={styles.stepDescription}>
                Sube tu CV, una foto profesional y proporciona tu dirección
              </p>
              
              <div className={styles.uploadSection}>
                <div className={styles.uploadGroup}>
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
                  <small className={styles.fileHint}>
                    <i className="fa-solid fa-info-circle"></i>
                    Máximo 5MB - Formatos: PDF, DOCX
                  </small>
                </div>
                
                <div className={styles.uploadGroup}>
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
                  <small className={styles.fileHint}>
                    <i className="fa-solid fa-info-circle"></i>
                    Máximo 2MB - Formatos: PNG, JPEG
                  </small>
                </div>
                
                <InputGroup
                  label="Dirección"
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ejemplo: Av. Siempre Viva 123, Santiago"
                  error={errors.address}
                  autoComplete="street-address"
                />
              </div>
            </div>
          )}

          {errors.general && (
            <div className={styles.errorMessage}>
              <i className="fa-solid fa-exclamation-triangle"></i>
              {errors.general}
            </div>
          )}

          <div className={styles.navigationButtons}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={styles.backButton}
              >
                <i className="fa-solid fa-arrow-left"></i>
                Anterior
              </button>
            )}
            
            <div className={styles.rightButtons}>
              <SubmitButton
                pendingText={step < 2 ? "Procesando..." : "Finalizando..."}
                className={`${styles.submitButton} ${step === 2 ? styles.finalButton : styles.nextButton}`}
                disabled={isPending}
                type="submit"
              >
                {step < 2 ? (
                  <>
                    Siguiente
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check-circle"></i>
                    Finalizar Perfil
                  </>
                )}
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

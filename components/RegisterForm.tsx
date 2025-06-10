"use client";

import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { InputGroup } from "@/components/InputGroup";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Skill } from "@/lib/skills/model/skill";
import { registerSchema } from "@/lib/validators/auth";
import { ProfessionalFields } from "./ProfessionalFields";
import styles from "@/styles/auth/login.module.css";
import { validateFile } from "@/lib/validators/fileValidation";

interface RegisterFormProps {
  signUpAction: (formData: FormData) => Promise<{ error?: string }>;
  message?: { success?: string; error?: string; message?: string };
  initialSkills: Skill[];
}

export function RegisterForm({
  signUpAction,
  message,
  initialSkills,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthdate: "",
    phone: "",
    account_type: "",
    account_category: "",
    speciality: "",
    experience_years: "",
    skills: [] as string[],
    cv_file: null as File | null,
    profile_image: null as File | null,
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showProfessionalFields, setShowProfessionalFields] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPending, startTransition] = useTransition();

  const validateForm = (data: any) => {
    try {
      registerSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: { [key: string]: string } = {};
      error.errors.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    console.log("handleSubmit triggered", formData);
    const cvError = validateFile(
      formData.get("cv_file") as File | null,
      "cv_file"
    );
    const profileImageError = validateFile(
      formData.get("profile_image") as File | null,
      "profile_image"
    );
    if (cvError || profileImageError) {
      setErrors((prev) => ({
        ...prev,
        cv_file: cvError ?? "",
        profile_image: profileImageError ?? "",
      }));
      return;
    }

    // Convertir FormData a un objeto plano para la validación
    const formDataObject = {
      first_name: formData.get("first_name")?.toString() || "",
      last_name: formData.get("last_name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      birthdate: formData.get("birthdate")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || undefined,
      account_type: formData.get("account_type")?.toString() || "",
      account_category: formData.get("account_category")?.toString() || "",
      speciality: formData.get("speciality")?.toString() || undefined,
      experience_years:
        formData.get("experience_years")?.toString() || undefined,
      skills: formData.getAll("skills") || [],
      cv_file: formData.get("cv_file") as File | null,
      profile_image: formData.get("profile_image") as File | null,
      address: formData.get("address")?.toString() || undefined,
      password: formData.get("password")?.toString() || "",
      confirmPassword: formData.get("confirmPassword")?.toString() || "",
    };

    if (!validateForm(formDataObject)) return;

    startTransition(async () => {
      const response = await signUpAction(formData);
      console.log("signUpAction response", response);
      if (response?.error) {
        const errorMessages = response.error.split(", ");
        const newErrors: { [key: string]: string } = {};
        errorMessages.forEach((msg) => {
          const fieldMatch = msg.match(
            /^(El nombre|El apellido|Formato de email|La contraseña|La confirmación)/
          );
          if (fieldMatch) {
            if (msg.includes("nombre")) newErrors.first_name = msg;
            else if (msg.includes("apellido")) newErrors.last_name = msg;
            else if (msg.includes("email")) newErrors.email = msg;
            else if (msg.includes("contraseña")) newErrors.password = msg;
            else if (msg.includes("confirmación"))
              newErrors.confirmPassword = msg;
          } else {
            newErrors.general = response.error ?? "";
          }
        });
        setErrors(
          Object.keys(newErrors).length > 0
            ? newErrors
            : { general: response.error }
        );
      }
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleNext triggered");
    if (!validateForm(formData)) return;

    if (formData.account_type === "professional" && !showProfessionalFields) {
      setShowProfessionalFields(true);
    } else if (formData.account_type === "client") {
      const form = e.currentTarget as HTMLFormElement;
      if (form) handleSubmit(new FormData(form));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] || value : value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Registrarse</h1>
        <form className={styles.form} onSubmit={handleNext}>
          <InputGroup
            label="Nombre"
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Ejemplo: Juan Carlos"
            required
            error={errors.first_name}
          />
          <InputGroup
            label="Apellido"
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Ejemplo: Pérez Rodríguez"
            required
            error={errors.last_name}
          />
          <InputGroup
            label="Fecha de Nacimiento"
            id="birthdate"
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
            error={errors.birthdate}
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
          />
          <InputGroup
            label="Correo Electrónico"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ejemplo: juan.perez@email.com"
            required
            error={errors.email}
          />
          <InputGroup
            label="Tipo de Cuenta"
            id="account_type"
            name="account_type"
            type="select"
            value={formData.account_type}
            onChange={(e) => {
              handleChange(e);
              setShowProfessionalFields(e.target.value === "professional");
            }}
            options={[
              { value: "", label: "Selecciona una opción" },
              { value: "client", label: "Cliente" },
              { value: "professional", label: "Profesional" },
            ]}
            required
            error={errors.account_type}
          />
          <InputGroup
            label="¿Empresa o persona individual?"
            id="account_category"
            name="account_category"
            type="select"
            value={formData.account_category}
            onChange={handleChange}
            options={[
              { value: "", label: "Selecciona una opción" },
              { value: "enterprise", label: "Empresa" },
              { value: "person", label: "Persona" },
            ]}
            required
            error={errors.account_category}
          />

          {formData.account_type === "professional" &&
            showProfessionalFields && (
              <ProfessionalFields
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                availableSkills={initialSkills}
              />
            )}

          <InputGroup
            label="Contraseña"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            required
            error={errors.password}
            showTogglePassword={true}
            togglePassword={() => setShowPassword(!showPassword)}
          />
          <InputGroup
            label="Confirmar Contraseña"
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            required
            error={errors.confirmPassword}
            showTogglePassword={true}
            togglePassword={() => setShowPassword(!showPassword)}
          />

          {errors.general && (
            <p
              className={`text-sm mt-2 ${errors.general.includes("Gracias") ? "text-green-500" : "text-red-500"}`}
            >
              {errors.general}
            </p>
          )}

          {formData.account_type === "professional" &&
          !showProfessionalFields ? (
            <SubmitButton
              pendingText="Cargando..."
              className={styles.submitButton}
              disabled={isPending}
              onClick={handleNext}
            >
              Siguiente
            </SubmitButton>
          ) : (
            <SubmitButton
              pendingText="Registrando..."
              className={styles.submitButton}
              disabled={isPending}
              formAction={handleSubmit}
            >
              Registrarse
            </SubmitButton>
          )}

          <div className={styles.linksContainer}>
            <Link href="/sign-in" className={styles.link}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
            <Link href="/forgot-password" className={styles.link}>
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          {message && <FormMessage message={message} />}
        </form>
      </div>
    </div>
  );
}

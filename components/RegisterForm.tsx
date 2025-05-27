"use client";

import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useTransition } from "react";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth";
import styles from "@/styles/auth/login.module.css";

type RegisterInput = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  signUpAction: (formData: FormData) => Promise<{ error?: string }>;
  message?: { success?: string; error?: string; message?: string };
}

export function RegisterForm({ signUpAction, message }: RegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState<
    "client" | "professional" | ""
  >("");
  const [accountCategory, setAccountCategory] = useState<
    "enterprise" | "person" | ""
  >("");
  const [speciality, setSpeciality] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setErrors({});
    const payload: RegisterInput = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      birthdate: formData.get("birthdate") as string,
      phone: formData.get("phone") as string,
      account_type: formData.get("account_type") as "client" | "professional",
      account_category: formData.get("account_category") as
        | "enterprise"
        | "person",
      speciality: formData.get("speciality") as string,
      cv_url: formData.get("cv_url") as string,
      address: formData.get("address") as string,
      profile_image: formData.get("profile_image") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const result = registerSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = result.error.errors.reduce(
        (acc: { [key: string]: string }, curr) => {
          acc[curr.path[0] as string] = curr.message;
          return acc;
        },
        {}
      );
      setErrors(fieldErrors);
      return;
    }

    startTransition(() => {
      signUpAction(formData).then((response) => {
        if (response?.error) {
          setErrors({ general: response.error });
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Registrarse</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <Label
              htmlFor="first_name"
              className={`${styles.label} ${errors.first_name ? styles.labelError : ""}`}
            >
              Nombre
            </Label>
            <Input
              type="text"
              id="first_name"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`${styles.input} ${errors.first_name ? styles.inputError : ""}`}
              placeholder="Tu nombre"
              required
            />
            {errors.first_name && (
              <p className={styles.errorMessage}>{errors.first_name}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="last_name"
              className={`${styles.label} ${errors.last_name ? styles.labelError : ""}`}
            >
              Apellido
            </Label>
            <Input
              type="text"
              id="last_name"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`${styles.input} ${errors.last_name ? styles.inputError : ""}`}
              placeholder="Tu apellido"
              required
            />
            {errors.last_name && (
              <p className={styles.errorMessage}>{errors.last_name}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="email"
              className={`${styles.label} ${errors.email ? styles.labelError : ""}`}
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="example@example.com"
              required
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="birthdate"
              className={`${styles.label} ${errors.birthdate ? styles.labelError : ""}`}
            >
              Fecha de Nacimiento
            </Label>
            <Input
              type="date"
              id="birthdate"
              name="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className={`${styles.input} ${errors.birthdate ? styles.inputError : ""}`}
            />
            {errors.birthdate && (
              <p className={styles.errorMessage}>{errors.birthdate}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="phone"
              className={`${styles.label} ${errors.phone ? styles.labelError : ""}`}
            >
              Teléfono
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className={styles.errorMessage}>{errors.phone}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="account_type"
              className={`${styles.label} ${errors.account_type ? styles.labelError : ""}`}
            >
              Tipo de Cuenta
            </Label>
            <select
              id="account_type"
              name="account_type"
              value={accountType}
              onChange={(e) =>
                setAccountType(e.target.value as "client" | "professional")
              }
              className={`${styles.input} ${errors.account_type ? styles.inputError : ""}`}
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="client">Cliente</option>
              <option value="professional">Profesional</option>
            </select>
            {errors.account_type && (
              <p className={styles.errorMessage}>{errors.account_type}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="account_category"
              className={`${styles.label} ${errors.account_category ? styles.labelError : ""}`}
            >
              Categoría de Cuenta
            </Label>
            <select
              id="account_category"
              name="account_category"
              value={accountCategory}
              onChange={(e) =>
                setAccountCategory(e.target.value as "enterprise" | "person")
              }
              className={`${styles.input} ${errors.account_category ? styles.inputError : ""}`}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="enterprise">Empresa</option>
              <option value="person">Persona</option>
            </select>
            {errors.account_category && (
              <p className={styles.errorMessage}>{errors.account_category}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="speciality"
              className={`${styles.label} ${errors.speciality ? styles.labelError : ""}`}
            >
              Especialidad (si aplica)
            </Label>
            <Input
              type="text"
              id="speciality"
              name="speciality"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className={`${styles.input} ${errors.speciality ? styles.inputError : ""}`}
              placeholder="Ej. Carpintería"
            />
            {errors.speciality && (
              <p className={styles.errorMessage}>{errors.speciality}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="cv_url"
              className={`${styles.label} ${errors.cv_url ? styles.labelError : ""}`}
            >
              URL de CV (si aplica)
            </Label>
            <Input
              type="url"
              id="cv_url"
              name="cv_url"
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
              className={`${styles.input} ${errors.cv_url ? styles.inputError : ""}`}
              placeholder="https://example.com/cv.pdf"
            />
            {errors.cv_url && (
              <p className={styles.errorMessage}>{errors.cv_url}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="address"
              className={`${styles.label} ${errors.address ? styles.labelError : ""}`}
            >
              Dirección
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
              placeholder="Tu dirección"
            />
            {errors.address && (
              <p className={styles.errorMessage}>{errors.address}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="profile_image"
              className={`${styles.label} ${errors.profile_image ? styles.labelError : ""}`}
            >
              URL de Imagen de Perfil (si aplica)
            </Label>
            <Input
              type="url"
              id="profile_image"
              name="profile_image"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className={`${styles.input} ${errors.profile_image ? styles.inputError : ""}`}
              placeholder="https://example.com/profile.jpg"
            />
            {errors.profile_image && (
              <p className={styles.errorMessage}>{errors.profile_image}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="password"
              className={`${styles.label} ${errors.password ? styles.labelError : ""}`}
            >
              Contraseña
            </Label>
            <div className={styles.inputWrapper}>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </button>
            </div>
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label
              htmlFor="confirmPassword"
              className={`${styles.label} ${errors.confirmPassword ? styles.labelError : ""}`}
            >
              Confirmar Contraseña
            </Label>
            <div className={styles.inputWrapper}>
              <Input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                placeholder="••••••••"
                required
              />
            </div>
            {errors.confirmPassword && (
              <p className={styles.errorMessage}>{errors.confirmPassword}</p>
            )}
          </div>
          <SubmitButton
            pendingText="Registrando..."
            className={styles.submitButton}
          >
            Registrarse
          </SubmitButton>
          <div className={styles.linksContainer}>
            <Link href="/auth/sign-in" className={styles.link}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
          {message && <FormMessage message={message} />}
        </form>
      </div>
    </div>
  );
}

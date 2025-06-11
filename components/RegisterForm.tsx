"use client";

import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { InputGroup } from "@/components/InputGroup";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { registerSchema } from "@/lib/validators/auth";
import styles from "@/styles/auth/login.module.css";

interface RegisterFormProps {
  signUpAction: (formData: FormData) => Promise<{ error?: string }>;
  message?: { success?: string; error?: string; message?: string };
}

export function RegisterForm({ signUpAction, message }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    account_type: "",
    account_category: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPending, startTransition] = useTransition();
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    setLocalMessage(message);
    if (message?.success) {
      const timer = setTimeout(() => {
        setLocalMessage({});
        // Limpia la query string
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        // Opcional: redirige al login o landing
        // window.location.href = "/sign-in";
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
    if (
      !validateForm({
        first_name: formData.get("first_name")?.toString() || "",
        last_name: formData.get("last_name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        account_type: formData.get("account_type")?.toString() || "",
        account_category: formData.get("account_category")?.toString() || "",
        password: formData.get("password")?.toString() || "",
        confirmPassword: formData.get("confirmPassword")?.toString() || "",
      })
    )
      return;

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Registrarse</h1>
        <form className={styles.form} action={handleSubmit}>
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
            autoComplete="given-name"
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
            autoComplete="family-name"
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
            autoComplete="email"
          />
          <InputGroup
            label="Tipo de Cuenta"
            id="account_type"
            name="account_type"
            type="select"
            value={formData.account_type}
            onChange={handleChange}
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
            autoComplete="new-password"
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
            autoComplete="new-password"
          />

          {errors.general && (
            <p
              className={`text-sm mt-2 ${errors.general.includes("Gracias") ? "text-green-500" : "text-red-500"}`}
            >
              {errors.general}
            </p>
          )}

          <SubmitButton
            pendingText="Registrando..."
            className={styles.submitButton}
            disabled={isPending}
          >
            Registrarse
          </SubmitButton>

          <div className={styles.linksContainer}>
            <Link href="/sign-in" className={styles.link}>
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
            <Link href="/forgot-password" className={styles.link}>
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          {localMessage && <FormMessage message={localMessage} />}
        </form>
      </div>
    </div>
  );
}

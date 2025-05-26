"use client";

import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useTransition } from "react";
import { z } from "zod";
import styles from "@/styles/auth/login.module.css";

const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginInput = z.infer<typeof loginSchema>;

interface LoginFormProps {
  signInAction: (formData: FormData) => Promise<{ error?: string }>;
  message?: { success?: string; error?: string; message?: string };
}

export function LoginForm({ signInAction, message }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setErrors({});
    const payload: LoginInput = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(payload);
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
      signInAction(formData).then((response) => {
        if (response?.error) {
          setErrors({ general: response.error });
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className={styles.form}
        >
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
            {errors.general && (
              <p className={styles.errorMessage}>{errors.general}</p>
            )}
          </div>
          <SubmitButton
            pendingText="Iniciando..."
            className={styles.submitButton}
          >
            Iniciar Sesión
          </SubmitButton>
          <div className={styles.linksContainer}>
            <Link href="/auth/forgot-password" className={styles.link}>
              ¿Has olvidado tu contraseña?
            </Link>
            <p>
              ¿Aún no tienes cuenta?{" "}
              <Link href="/auth/register" className={styles.link}>
                Únete ahora
              </Link>
            </p>
          </div>
          {message && <FormMessage message={message} />}
        </form>
      </div>
    </div>
  );
}

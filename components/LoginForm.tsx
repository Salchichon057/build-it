"use client";

import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useTransition } from "react";
import styles from "@/styles/auth/login.module.css";

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

    startTransition(async () => {
      const response = await signInAction(formData);
      if (response?.error) {
        try {
          const parsedErrors = JSON.parse(response.error);
          setErrors(parsedErrors);
        } catch (e) {
          setErrors({ general: response.error });
        }
      }
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
              <Link href="/sign-up" className={styles.link}>
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

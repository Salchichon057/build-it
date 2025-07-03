"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import styles from "@/styles/auth/login.module.css";

interface InputGroupProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string | string[] | File | null;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  showTogglePassword?: boolean;
  togglePassword?: () => void;
  multiple?: boolean;
  autoComplete?: string;
  rows?: number;
  min?: string | number; // <-- Agrega este prop
  max?: string | number; // <-- Opcional, por si también lo necesitas
  step?: string | number; // <-- También útil para números
}

export function InputGroup({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
  error,
  options,
  accept,
  showTogglePassword,
  togglePassword,
  multiple,
  autoComplete,
  rows,
  min, // <-- Agrega aquí
  max, // <-- Agrega aquí
  step, // <-- Agrega aquí
}: InputGroupProps) {
  return (
    <div className={styles.inputGroup}>
      <div className={styles.labelContainer}>
        <Label
          htmlFor={id}
          className={`${styles.label} ${error ? styles.labelError : ""}`}
        >
          {label} {required && <span className={styles.required}>*</span>}
        </Label>
        {error && <span className={styles.errorSublabel}>{error}</span>}
      </div>
      {type === "select" && options ? (
        <select
          id={id}
          name={name}
          multiple={multiple}
          value={multiple ? (value as string[]) : (value as string)}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          required={required}
          autoComplete={autoComplete || "off"}
        >
          {options.map((option, idx) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.value === ""}
              hidden={option.value === "" && value !== ""}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <div className={styles.inputWrapper}>
          <textarea
            id={id}
            name={name}
            value={value as string}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            placeholder={placeholder}
            required={required}
            rows={rows || 4}
            autoComplete={autoComplete || "off"}
          />
        </div>
      ) : (
        <div className={styles.inputWrapper}>
          <Input
            type={type}
            id={id}
            name={name}
            value={type === "file" ? undefined : (value as string)}
            onChange={onChange}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            placeholder={placeholder}
            required={required}
            accept={accept}
            autoComplete={autoComplete || "off"}
            min={min} // <-- Pasa el prop min
            max={max} // <-- Pasa el prop max
            step={step || (type === "number" ? 1 : undefined)} // <-- Pasa step
          />
          {showTogglePassword && togglePassword && (
            <button
              type="button"
              onClick={togglePassword}
              className={styles.togglePassword}
            >
              <i
                className={
                  `${styles.togglePasswordIcon} ` +
                  (type === "text" ? "fas fa-eye-slash" : "fas fa-eye")
                }
                style={{ verticalAlign: "middle" }}
              ></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

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
  ) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  showTogglePassword?: boolean;
  togglePassword?: () => void;
  multiple?: boolean; // Nuevo prop para soportar selecciones múltiples
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
}: InputGroupProps) {
  return (
    <div className={styles.inputGroup}>
      <Label
        htmlFor={id}
        className={`${styles.label} ${error ? styles.labelError : ""}`}
      >
        {label}
      </Label>
      {type === "select" && options ? (
        <select
          id={id}
          name={name}
          multiple={multiple}
          value={multiple ? (value as string[]) : (value as string)}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          required={required}
        >
          {!multiple && <option value="">Seleccione una opción</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

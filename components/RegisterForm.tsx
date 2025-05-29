"use client";

import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { InputGroup } from "@/components/InputGroup";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Skill } from "@/lib/skills/model/skill";
import styles from "@/styles/auth/login.module.css";

interface RegisterFormProps {
  signUpAction: (formData: FormData) => Promise<{ error?: string }>;
  message?: { success?: string; error?: string; message?: string };
  initialSkills: Skill[];
}

interface SearchInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function SearchInput({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}

export function RegisterForm({
  signUpAction,
  message,
  initialSkills,
}: RegisterFormProps) {
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
  const [experienceYears, setExperienceYears] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showProfessionalFields, setShowProfessionalFields] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [, startTransition] = useTransition();

  const availableSkills = initialSkills;

  const handleSubmit = (formData: FormData) => {
    setErrors({});

    startTransition(async () => {
      const response = await signUpAction(formData);
      if (response?.error) {
        setErrors({ general: response.error });
      }
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (accountType === "professional" && !showProfessionalFields) {
      setShowProfessionalFields(true);
    } else if (accountType === "client") {
      const form = (e.currentTarget as HTMLButtonElement).form;
      if (form) {
        handleSubmit(new FormData(form));
      }
    }
  };

  const handleSkillChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      if (selectedOptions.length <= 5) {
        setSkills(selectedOptions);
        setErrors({ skills: "" });
      } else {
        setErrors({ skills: "Puedes seleccionar máximo 5 habilidades" });
      }
    }
  };

  const handleSkillSelect = (skillId: string) => {
    if (skills.length < 5 && !skills.includes(skillId)) {
      setSkills([...skills, skillId]);
      setErrors({ skills: "" });
    } else if (skills.length >= 5) {
      setErrors({ skills: "Puedes seleccionar máximo 5 habilidades" });
    }
    setIsModalOpen(false);
  };

  const handleSkillRemove = (skillId: string) => {
    setSkills(skills.filter((id) => id !== skillId));
    if (skills.length <= 5) {
      setErrors({ skills: "" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredSkills = availableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Registrarse</h1>
        <form className={styles.form}>
          <InputGroup
            label="Nombre"
            id="first_name"
            name="first_name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ejemplo: Juan Carlos"
            required
            error={errors.first_name}
          />
          <InputGroup
            label="Apellido"
            id="last_name"
            name="last_name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ejemplo: Pérez Rodríguez"
            required
            error={errors.last_name}
          />
          <InputGroup
            label="Fecha de Nacimiento"
            id="birthdate"
            name="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            error={errors.birthdate}
          />
          <InputGroup
            label="Teléfono"
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ejemplo: +56 9 1234 5678"
            error={errors.phone}
          />
          <InputGroup
            label="Correo Electrónico"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ejemplo: juan.perez@email.com"
            required
            error={errors.email}
          />
          <InputGroup
            label="Tipo de Cuenta"
            id="account_type"
            name="account_type"
            type="select"
            value={accountType}
            onChange={(e) => {
              const newAccountType = e.target.value as
                | "client"
                | "professional";
              setAccountType(newAccountType);
              setShowProfessionalFields(newAccountType === "professional");
            }}
            options={[
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
            value={accountCategory}
            onChange={(e) =>
              setAccountCategory(e.target.value as "enterprise" | "person")
            }
            options={[
              { value: "enterprise", label: "Empresa" },
              { value: "person", label: "Persona" },
            ]}
            required
            error={errors.account_category}
          />

          {accountType === "professional" && showProfessionalFields && (
            <>
              <InputGroup
                label="Especialidad"
                id="speciality"
                name="speciality"
                type="text"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                placeholder="Ejemplo: Arquitecto, Ingeniero Civil"
                error={errors.speciality}
              />
              <InputGroup
                label="Años de Experiencia"
                id="experience_years"
                name="experience_years"
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="Ejemplo: 5"
                error={errors.experience_years}
              />
              <div className={styles.skillSection}>
                <label className={styles.label}>Habilidades</label>
                <InputGroup
                  label="Seleccionar habilidades"
                  id="skills"
                  name="skills"
                  type="select"
                  value={skills}
                  onChange={handleSkillChange}
                  options={availableSkills.map((skill) => ({
                    value: skill.id,
                    label: skill.name,
                  }))}
                  multiple
                  error={errors.skills}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={styles.skillTrigger}
                >
                  Abrir selector de habilidades
                </button>
                <div className={styles.selectedSkills}>
                  {skills.map((skillId) => {
                    const skill = availableSkills.find((s) => s.id === skillId);
                    return skill ? (
                      <span key={skillId} className={styles.skillTag}>
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skillId)}
                          className={styles.removeSkill}
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              {isModalOpen && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3 className={styles.modalTitle}>
                      Seleccionar habilidades
                    </h3>
                    <SearchInput
                      label="Buscar habilidades"
                      id="skillSearch"
                      name="skillSearch"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Ejemplo: Hormigonado, Techado..."
                    />
                    <ul className={styles.skillList}>
                      {filteredSkills.map((skill) => (
                        <li key={skill.id} className={styles.skillItem}>
                          <button
                            type="button"
                            onClick={() => handleSkillSelect(skill.id)}
                            className={styles.skillButton}
                            disabled={
                              skills.includes(skill.id) || skills.length >= 5
                            }
                          >
                            {skill.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={styles.closeButton}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
              <InputGroup
                label="Currículo"
                id="cv_file"
                name="cv_file"
                type="file"
                value={cvFile}
                onChange={(e) =>
                  setCvFile((e.target as HTMLInputElement).files?.[0] || null)
                }
                accept=".pdf,.doc,.docx"
                error={errors.cv_url}
              />
              <InputGroup
                label="Dirección"
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ejemplo: CDMX, Monterrey, Guadalajara"
                error={errors.address}
              />
            </>
          )}

          <InputGroup
            label="Contraseña"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            required
            error={errors.confirmPassword}
            showTogglePassword={true}
            togglePassword={() => setShowPassword(!showPassword)}
          />

          {errors.general && (
            <p className="text-red-500 text-sm mt-2">{errors.general}</p>
          )}

          {accountType === "professional" && !showProfessionalFields ? (
            <SubmitButton
              pendingText="Cargando..."
              className={styles.submitButton}
              onClick={handleNext}
            >
              Siguiente
            </SubmitButton>
          ) : (
            <SubmitButton
              pendingText="Registrando..."
              className={styles.submitButton}
              onClick={(e) => {
                e.preventDefault();
                const form = (e.currentTarget as HTMLButtonElement).form;
                if (form) {
                  handleSubmit(new FormData(form));
                }
              }}
            >
              Registrarse
            </SubmitButton>
          )}

          <div className={styles.linksContainer}>
            <Link href="/auth/sign-in" className={styles.link}>
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

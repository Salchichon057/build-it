"use client";

import { useState } from "react";
import { Skill } from "@/lib/skills/model/skill";
import styles from "@/styles/auth/login.module.css";

interface SkillSelectorProps {
  skills: string[];
  availableSkills: Skill[];
  onSkillSelect: (skillId: string) => void;
  onSkillRemove: (skillId: string) => void;
  maxSkills: number;
  errors: { [key: string]: string };
  setErrors: (errors: { [key: string]: string }) => void;
}

export function SkillSelector({
  skills,
  availableSkills,
  onSkillSelect,
  onSkillRemove,
  maxSkills,
  errors,
  setErrors,
}: SkillSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSkillSelect = (skillId: string) => {
    if (skills.length < maxSkills && !skills.includes(skillId)) {
      onSkillSelect(skillId);
      setErrors({ ...errors, skills: "" });
    } else if (skills.length >= maxSkills) {
      setErrors({
        ...errors,
        skills: "Puedes seleccionar máximo 5 habilidades",
      });
    }
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredSkills = availableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className={styles.skillSection}>
      <label className={styles.label}>Habilidades</label>
      <div className={styles.selectedSkills}>
        {skills.length > 0 ? (
          skills.map((skillId) => {
            const skill = availableSkills.find((s) => s.id === skillId);
            return skill ? (
              <span key={skillId} className={styles.skillTag}>
                {skill.name}
                <button
                  type="button"
                  onClick={() => onSkillRemove(skillId)}
                  className={styles.removeSkill}
                >
                  ×
                </button>
              </span>
            ) : null;
          })
        ) : (
          <span className={styles.noSkills}>
            No has seleccionado habilidades
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={styles.skillTrigger}
      >
        Abrir selector de habilidades
      </button>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Seleccionar habilidades</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Ejemplo: Hormigonado, Techado..."
                className={styles.input}
              />
            </div>
            <ul className={styles.skillList}>
              {filteredSkills.map((skill) => (
                <li key={skill.id} className={styles.skillItem}>
                  <button
                    type="button"
                    onClick={() => handleSkillSelect(skill.id)}
                    className={styles.skillButton}
                    disabled={
                      skills.includes(skill.id) || skills.length >= maxSkills
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
      {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { User } from "@/lib/auth/model/user";
import { InputGroup } from "@/components/InputGroup";
import { updateProfileAction } from "./actions";
import styles from "./profile.module.css";

interface ProfileClientProps {
  profile: User;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    birthdate: profile.birthdate || "",
    address: profile.address || "",
    speciality: profile.speciality || "",
    experience_years: profile.experience_years || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "email") { // No actualizar email
          formDataToSend.append(key, value);
        }
      });

      const result = await updateProfileAction(formDataToSend);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: result.success || "Perfil actualizado correctamente" });
        setEditMode(false);
        // Recargar la página para mostrar los datos actualizados
        window.location.reload();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error inesperado al actualizar el perfil" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Resetear a los valores originales
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      birthdate: profile.birthdate || "",
      address: profile.address || "",
      speciality: profile.speciality || "",
      experience_years: profile.experience_years || "",
    });
    setEditMode(false);
    setMessage(null);
  };

  const handleDownloadCV = () => {
    if (profile.cv_url) {
      window.open(profile.cv_url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <img
              src={profile.profile_image || "/default-avatar.png"}
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {profile.first_name} {profile.last_name}
              </h1>
              <p className={styles.userRole}>
                <i className="fa-solid fa-user-tie"></i>
                {profile.account_type === "client" ? "Cliente" : "Profesional"}
              </p>
              {profile.speciality && (
                <p className={styles.userSpeciality}>
                  <i className="fa-solid fa-helmet-safety"></i>
                  {profile.speciality}
                </p>
              )}
              {profile.experience_years && (
                <p className={styles.userExperience}>
                  <i className="fa-solid fa-briefcase"></i>
                  {profile.experience_years} años de experiencia
                </p>
              )}
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.editButton}
              onClick={() => setEditMode(!editMode)}
            >
              <i className={editMode ? "fa-solid fa-xmark" : "fa-solid fa-pencil"}></i>
              {editMode ? "Cancelar" : "Editar"}
            </button>
            {profile.account_type === "professional" && profile.cv_url && (
              <button
                className={styles.downloadButton}
                onClick={handleDownloadCV}
              >
                <i className="fa-solid fa-download"></i>
                Descargar CV
              </button>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-user"></i>
            Información Personal
          </h2>
          
          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              <i className={message.type === "success" ? "fa-solid fa-check-circle" : "fa-solid fa-exclamation-triangle"}></i>
              {message.text}
            </div>
          )}
          
          <div className={styles.formGrid}>
            <InputGroup
              label="Nombre"
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={!editMode}
            />
            
            <InputGroup
              label="Apellido"
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={!editMode}
            />
            
            <InputGroup
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={true} // Email no se puede cambiar
            />
            
            <InputGroup
              label="Teléfono"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
            />
            
            <InputGroup
              label="Fecha de Nacimiento"
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              disabled={!editMode}
            />
            
            <InputGroup
              label="Dirección"
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              disabled={!editMode}
            />
            
            {profile.account_type === "professional" && (
              <>
                <InputGroup
                  label="Especialidad"
                  id="speciality"
                  name="speciality"
                  type="text"
                  value={formData.speciality}
                  onChange={handleChange}
                  disabled={!editMode}
                />
                <InputGroup
                  label="Años de Experiencia"
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={handleChange}
                  disabled={!editMode}
                  min={0}
                />
              </>
            )}
          </div>

          {editMode && (
            <div className={styles.formActions}>
              <button
                className={styles.cancelButton}
                onClick={handleCancel}
                type="button"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                type="button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sección de CV para profesionales */}
        {profile.account_type === "professional" && (
          <div className={styles.cvSection}>
            <h2 className={styles.sectionTitle}>
              <i className="fa-solid fa-file-pdf"></i>
              Currículum Vitae
            </h2>
            {profile.cv_url ? (
              <div className={styles.cvItem}>
                <div className={styles.cvInfo}>
                  <i className="fa-solid fa-file-pdf"></i>
                  <span>CV disponible</span>
                </div>
                <button
                  className={styles.downloadButton}
                  onClick={handleDownloadCV}
                >
                  <i className="fa-solid fa-download"></i>
                  Descargar
                </button>
              </div>
            ) : (
              <div className={styles.noCv}>
                <i className="fa-solid fa-info-circle"></i>
                <span>No has subido tu CV. </span>
                <a href="/dashboard/complete-profile">Completar perfil</a>
              </div>
            )}
          </div>
        )}

        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-chart-bar"></i>
            Estadísticas
          </h2>
          <div className={styles.statsGrid}>
            {profile.account_type === "client" ? (
              <>
                <div className={styles.statCard}>
                  <i className="fa-solid fa-project-diagram"></i>
                  <div>
                    <span className={styles.statNumber}>0</span>
                    <span className={styles.statLabel}>Proyectos Activos</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <i className="fa-solid fa-check-circle"></i>
                  <div>
                    <span className={styles.statNumber}>0</span>
                    <span className={styles.statLabel}>Proyectos Completados</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.statCard}>
                  <i className="fa-solid fa-handshake"></i>
                  <div>
                    <span className={styles.statNumber}>0</span>
                    <span className={styles.statLabel}>Postulaciones Activas</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <i className="fa-solid fa-star"></i>
                  <div>
                    <span className={styles.statNumber}>0</span>
                    <span className={styles.statLabel}>Proyectos Completados</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

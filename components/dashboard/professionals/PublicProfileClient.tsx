"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/dashboard/profile.module.css";

interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  profile_image: string | null;
  speciality: string | null;
  experience_years: string | null;
  address: string | null;
  cv_url: string | null;
  created_at: string;
}

interface Skill {
  id: string;
  name: string;
}

interface PublicProfileClientProps {
  professional: Professional;
  skills: Skill[];
}

export default function PublicProfileClient({ professional, skills }: PublicProfileClientProps) {
  const router = useRouter();
  const [showContactModal, setShowContactModal] = useState(false);

  const handleDownloadCV = () => {
    if (professional.cv_url) {
      window.open(professional.cv_url, '_blank');
    }
  };

  const handleWhatsAppContact = () => {
    if (professional.phone) {
      // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
      const cleanPhone = professional.phone.replace(/[\s\-\(\)]/g, '');
      
      // Mensaje predefinido
      const message = `Hola ${professional.first_name}, te contacto desde BuildIt. Me interesa conocer más sobre tus servicios profesionales.`;
      
      // Crear la URL de WhatsApp
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* Botón de regreso */}
        <div className={styles.backButtonContainer}>
          <button
            className={styles.backButton}
            onClick={() => router.back()}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Volver
          </button>
        </div>

        <div className={styles.header}>
          <div className={styles.avatarSection}>
            <img
              src={professional.profile_image || "/default-avatar.png"}
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {professional.first_name} {professional.last_name}
              </h1>
              <p className={styles.userRole}>
                <i className="fa-solid fa-user-tie"></i>
                Profesional
              </p>
              {professional.speciality && (
                <p className={styles.userSpeciality}>
                  <i className="fa-solid fa-helmet-safety"></i>
                  {professional.speciality}
                </p>
              )}
              {professional.experience_years && (
                <p className={styles.userExperience}>
                  <i className="fa-solid fa-briefcase"></i>
                  {professional.experience_years} años de experiencia
                </p>
              )}
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <button
              className={styles.contactButton}
              onClick={() => setShowContactModal(true)}
            >
              <i className="fa-solid fa-phone"></i>
              Contactar
            </button>
          </div>
        </div>

        <div className={styles.formSection}>
          {/* Sección Acerca de */}
          <h2 className={styles.sectionTitle}>
            <i className="fa-solid fa-user"></i>
            Acerca de
          </h2>
          
          <div className={styles.aboutSection}>
            <div className={styles.aboutGrid}>
              {professional.speciality && (
                <div className={styles.aboutItem}>
                  <i className="fa-solid fa-helmet-safety"></i>
                  <div>
                    <strong>Especialidad:</strong>
                    <span>{professional.speciality}</span>
                  </div>
                </div>
              )}
              {professional.experience_years && (
                <div className={styles.aboutItem}>
                  <i className="fa-solid fa-calendar-days"></i>
                  <div>
                    <strong>Experiencia:</strong>
                    <span>{professional.experience_years} años</span>
                  </div>
                </div>
              )}
              {professional.address && (
                <div className={styles.aboutItem}>
                  <i className="fa-solid fa-location-dot"></i>
                  <div>
                    <strong>Ubicación:</strong>
                    <span>{professional.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Habilidades */}
          {skills.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>
                <i className="fa-solid fa-tools"></i>
                Habilidades
              </h2>
              <div className={styles.skillsSection}>
                <div className={styles.skillsList}>
                  {skills.map((skill) => (
                    <span key={skill.id} className={styles.skillTag}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sección de CV */}
          {professional.cv_url && (
            <div className={styles.cvSection}>
              <h2 className={styles.sectionTitle}>
                <i className="fa-solid fa-file-pdf"></i>
                Currículum Vitae
              </h2>
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
            </div>
          )}

          {/* Información de miembro */}
          <div className={styles.memberInfo}>
            <p>
              <i className="fa-solid fa-calendar"></i>
              Miembro desde {new Date(professional.created_at).toLocaleDateString("es-ES", { 
                year: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de contacto */}
      {showContactModal && (
        <div 
          className={styles.contactModalOverlay}
          onClick={() => setShowContactModal(false)}
        >
          <div 
            className={styles.contactModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.contactModalClose}
              onClick={() => setShowContactModal(false)}
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <h3 className={styles.contactModalTitle}>
              <i className="fa-solid fa-phone"></i>
              Contactar a {professional.first_name}
            </h3>
            
            <p className={styles.contactModalDescription}>
              Elige tu método de contacto preferido:
            </p>
            
            <div className={styles.contactOptions}>
              {professional.phone ? (
                <button
                  className={styles.whatsappButton}
                  onClick={() => {
                    handleWhatsAppContact();
                    setShowContactModal(false);
                  }}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  <div>
                    <strong>WhatsApp</strong>
                    <span>Contacto directo e inmediato</span>
                  </div>
                </button>
              ) : (
                <div className={styles.noContactInfo}>
                  <i className="fa-solid fa-phone-slash"></i>
                  <p>Este profesional no ha proporcionado información de contacto.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

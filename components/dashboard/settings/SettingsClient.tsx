"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/dashboard/settings.module.css";
import type { User } from "@/lib/auth/model/user";
import { APP_CONFIG } from "@/lib/config/app";

interface SettingsClientProps {
  profile: User;
}

export default function SettingsClient({ profile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción no se puede deshacer y perderás:\n- Todos tus proyectos\n- Todas tus postulaciones\n- Tu historial completo\n\n¿Continuar?"
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      // TODO: Implementar eliminación de cuenta cuando sea necesario
      setMessage({ type: "error", text: "Función de eliminación de cuenta no implementada en esta versión" });
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al procesar la solicitud" });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // TODO: Implementar exportación cuando sea necesario
      setMessage({ type: "success", text: "Función de exportación no implementada en esta versión" });
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al exportar datos" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.settingsCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Configuración</h1>
          <p className={styles.subtitle}>Gestiona tu cuenta y preferencias</p>
        </div>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            <i className={message.type === "success" ? "fa-solid fa-check-circle" : "fa-solid fa-exclamation-triangle"}></i>
            {message.text}
          </div>
        )}

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "account" ? styles.active : ""}`}
              onClick={() => setActiveTab("account")}
            >
              <i className="fa-solid fa-user"></i>
              Cuenta
            </button>
            <button
              className={`${styles.tab} ${activeTab === "privacy" ? styles.active : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              <i className="fa-solid fa-shield-halved"></i>
              Privacidad
            </button>
            <button
              className={`${styles.tab} ${activeTab === "support" ? styles.active : ""}`}
              onClick={() => setActiveTab("support")}
            >
              <i className="fa-solid fa-life-ring"></i>
              Soporte
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "account" && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Información de Cuenta</h2>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.subsectionTitle}>Perfil Actual</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <i className="fa-solid fa-user"></i>
                      <div>
                        <strong>Nombre completo</strong>
                        <span>{profile.first_name} {profile.last_name}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <i className="fa-solid fa-envelope"></i>
                      <div>
                        <strong>Correo electrónico</strong>
                        <span>{profile.email}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <i className="fa-solid fa-id-badge"></i>
                      <div>
                        <strong>Tipo de cuenta</strong>
                        <span className={styles.accountType}>
                          {profile.account_type === "client" ? "Cliente" : "Profesional"}
                        </span>
                      </div>
                    </div>
                    {profile.speciality && (
                      <div className={styles.infoItem}>
                        <i className="fa-solid fa-tools"></i>
                        <div>
                          <strong>Especialidad</strong>
                          <span>{profile.speciality}</span>
                        </div>
                      </div>
                    )}
                    {profile.phone && (
                      <div className={styles.infoItem}>
                        <i className="fa-solid fa-phone"></i>
                        <div>
                          <strong>Teléfono</strong>
                          <span>{profile.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.primaryBtn}
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <i className="fa-solid fa-edit"></i>
                      Editar Perfil
                    </button>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.subsectionTitle}>Seguridad</h3>
                  <p className={styles.description}>
                    Mantén tu cuenta segura actualizando tu contraseña regularmente.
                  </p>
                  <div className={styles.actions}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => router.push("/dashboard/reset-password")}
                    >
                      <i className="fa-solid fa-key"></i>
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Privacidad y Datos</h2>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.subsectionTitle}>Gestión de Datos</h3>
                  <p className={styles.description}>
                    Controla la información que almacenamos sobre ti y solicita una copia de tus datos.
                  </p>
                  <div className={styles.actions}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={handleExportData}
                      disabled={loading}
                    >
                      <i className="fa-solid fa-download"></i>
                      {loading ? "Exportando..." : "Exportar Mis Datos"}
                    </button>
                  </div>
                </div>

                <div className={styles.dangerSection}>
                  <h3 className={styles.dangerTitle}>Zona de Peligro</h3>
                  <p className={styles.description}>
                    Las siguientes acciones son permanentes e irreversibles.
                  </p>
                  <button
                    className={styles.dangerBtn}
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    <i className="fa-solid fa-trash"></i>
                    {loading ? "Procesando..." : "Eliminar Cuenta"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Soporte y Ayuda</h2>
                
                <div className={styles.infoSection}>
                  <h3 className={styles.subsectionTitle}>Contacto</h3>
                  <p className={styles.description}>
                    ¿Necesitas ayuda? Puedes contactarnos por cualquiera de estos medios:
                  </p>
                  <div className={styles.contactList}>
                    <div className={styles.contactItem}>
                      <i className="fa-solid fa-envelope"></i>
                      <div>
                        <strong>Correo de soporte</strong>
                        <span>{APP_CONFIG.email.support}</span>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <i className="fa-brands fa-whatsapp"></i>
                      <div>
                        <strong>WhatsApp</strong>
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <i className="fa-solid fa-clock"></i>
                      <div>
                        <strong>Horario de atención</strong>
                        <span>Lunes a Viernes, 9:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.subsectionTitle}>Información del Sistema</h3>
                  <div className={styles.systemInfo}>
                    <div className={styles.systemItem}>
                      <span>Versión de la aplicación:</span>
                      <span>BuildIt v1.0.0</span>
                    </div>
                    <div className={styles.systemItem}>
                      <span>Última actualización:</span>
                      <span>Julio 2025</span>
                    </div>
                    <div className={styles.systemItem}>
                      <span>Estado del servicio:</span>
                      <span className={styles.statusActive}>Operativo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

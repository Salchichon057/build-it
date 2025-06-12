"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import styles from "@/styles/navbar.module.css";
import type { User } from "@/lib/auth/model/user";
import { getUserProfile } from "@/lib/auth/service/authService.client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  // Aquí irá tu lógica real de notificaciones
  const [hasNotifications, setHasNotifications] = useState(true); // true = hay notificaciones

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      const { data, error } = await getUserProfile(session.user.id);
      if (error) {
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [session]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const supabase = (await import("@/utils/supabase/client")).createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    router.push("/");
  };

  if (isLoading || loadingProfile) return null;
  if (!session || !profile) return null;

  const accountType = profile.account_type;

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <img
            src="/logo.svg"
            alt="Logo de BuildIt"
            className="w-24 h-auto m-4"
          />
        </Link>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span className={styles.hamburger}></span>
        </button>
        <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
          {accountType === "client" && (
            <>
              <li>
                <Link href="/dashboard/projects">Mis Proyectos</Link>
              </li>
              <li>
                <Link href="/dashboard/professionals">
                  Explorar Profesionales
                </Link>
              </li>
            </>
          )}
          {accountType === "professional" && (
            <>
              <li>
                <Link href="/dashboard/postulations">Mis Postulaciones</Link>
              </li>
              <li>
                <Link href="/dashboard/projects/available">
                  Proyectos Disponibles
                </Link>
              </li>
            </>
          )}
        </ul>
        {/* Sección derecha: campana y avatar */}
        <div className={styles.rightSection}>
          <button
            className={styles.bellButton}
            aria-label="Notificaciones"
            onClick={() => router.push("/dashboard/notifications")}
          >
            <i className="fa-regular fa-bell"></i>
            {/* Solo muestra el círculo si hay notificaciones */}
            {hasNotifications && <span className={styles.bellBadge}></span>}
          </button>
          <div className={styles.avatarContainer}>
            <button
              onClick={() => setShowModal(true)}
              className={styles.avatarBtn}
              aria-label="Abrir perfil"
            >
              <img
                src={profile.profile_image || "/default-avatar.png"}
                alt="Avatar"
                className={styles.avatar}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de perfil */}
      {showModal && (
        <div
          className={styles.profileModalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.profileModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.profileModalClose}
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <img
              src={profile.profile_image || "/default-avatar.png"}
              alt="Avatar"
              className={styles.profileModalAvatar}
            />
            <div className={styles.profileModalName}>
              {profile.first_name} {profile.last_name}
            </div>
            <div className={styles.profileModalEmail}>
              <i className="fa-solid fa-envelope"></i>
              {profile.email}
            </div>
            <div className={styles.profileModalRole}>
              <i className="fa-solid fa-user-tie"></i>
              {profile.account_type === "client" ? "Cliente" : "Profesional"}
            </div>
            {profile.speciality && (
              <div className={styles.profileModalSpeciality}>
                <i className="fa-solid fa-helmet-safety"></i>
                {profile.speciality}
              </div>
            )}
            {profile.phone && (
              <div className={styles.profileModalPhone}>
                <i className="fa-solid fa-phone"></i>
                {profile.phone}
              </div>
            )}
            <div className={styles.profileModalActions}>
              <button
                className={styles.profileModalActionBtn}
                onClick={() => {
                  setShowModal(false);
                  router.push("/dashboard/profile");
                }}
              >
                <i className="fa-solid fa-user"></i>
                Mi perfil
              </button>
              <button
                className={styles.profileModalActionBtn}
                onClick={() => {
                  setShowModal(false);
                  router.push("/dashboard/settings");
                }}
              >
                <i className="fa-solid fa-gear"></i>
                Configuración
              </button>
              <button
                className={`${styles.profileModalActionBtn} ${styles.logout}`}
                onClick={async () => {
                  setShowModal(false);
                  await handleLogout();
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

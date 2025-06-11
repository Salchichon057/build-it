"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import styles from "@/styles/navbar.module.css";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  const accountType = session?.user?.user_metadata?.account_type || null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    router.push("/");
  };

  if (isLoading || !session) return null;

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          {/* Si tienes logo como imagen, pon aquí <img src="/logo.svg" alt="BuildIt" /> */}
          BuildIt
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
                <Link href="/dashboard/projects/available">
                  Proyectos Disponibles
                </Link>
              </li>
              <li>
                <Link href="/dashboard/postulations">Mis Postulaciones</Link>
              </li>
              <li>
                <Link href="/dashboard/profile">Mi Perfil</Link>
              </li>
            </>
          )}
          <li>
            <Link href="/dashboard/notifications">Notificaciones</Link>
          </li>
          <li>
            <Link href="/dashboard/profile">Perfil</Link>
          </li>
          <li>
            <Link href="/dashboard/settings">Configuración</Link>
          </li>
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Salir
            </button>
          </li>
        </ul>
        {/* Avatar o icono de usuario */}
        <div className={styles.avatarContainer}>
          <Link href="/dashboard/profile">
            <img
              src={
                session.user.user_metadata?.avatar_url || "/default-avatar.png"
              }
              alt="Avatar"
              className={styles.avatar}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}

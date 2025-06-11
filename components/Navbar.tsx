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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    router.push("/");
  };

  if (isLoading || !session) {
    console.log("Navbar: No session or loading");
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          BuildIt
        </Link>
        <button className={styles.menuButton} onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
          {accountType === "client" && (
            <>
              <li>
                <Link href="/projects">Mis Proyectos</Link>
              </li>
              <li>
                <Link href="/professionals">Explorar Profesionales</Link>
              </li>
            </>
          )}
          {accountType === "professional" && (
            <>
              <li>
                <Link href="/projects/available">Proyectos Disponibles</Link>
              </li>
              <li>
                <Link href="/postulations">Mis Postulaciones</Link>
              </li>
              <li>
                <Link href="/profile">Mi Perfil</Link>
              </li>
            </>
          )}
          <li>
            <Link href="/notifications">Notificaciones</Link>
          </li>
          <li>
            <Link href="/profile">Perfil</Link>
          </li>
          <li>
            <Link href="/settings">Configuración</Link>
          </li>
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Salir
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

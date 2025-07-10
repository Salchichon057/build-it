import Link from 'next/link';
import styles from '@/styles/404.module.css';
import { APP_CONFIG } from '@/lib/config/app';

export const metadata = {
  title: "Página no encontrada - BuildIt",
  description: "La página que buscas no existe. Regresa al inicio o explora BuildIt para encontrar profesionales de la construcción.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <img src="/logo.svg" alt="BuildIt Logo" className={styles.logo} />
        </div>
        
        <div className={styles.errorSection}>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Página no encontrada</h2>
          <p className={styles.errorDescription}>
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Puede que el enlace esté roto o la dirección sea incorrecta.
          </p>
        </div>

        <div className={styles.actionSection}>
          <Link href="/" className={styles.homeButton}>
            <i className="fa-solid fa-home"></i>
            Volver al Inicio
          </Link>
          
          <div className={styles.helpLinks}>
            <Link href="/sign-in" className={styles.helpLink}>
              <i className="fa-solid fa-sign-in-alt"></i>
              Iniciar Sesión
            </Link>
            <Link href="/sign-up" className={styles.helpLink}>
              <i className="fa-solid fa-user-plus"></i>
              Registrarse
            </Link>
            <Link href="/dashboard" className={styles.helpLink}>
              <i className="fa-solid fa-tachometer-alt"></i>
              Dashboard
            </Link>
          </div>
        </div>

        <div className={styles.suggestionSection}>
          <h3>¿Necesitas ayuda?</h3>
          <p>Puedes:</p>
          <ul>
            <li>
              <i className="fa-solid fa-check"></i>
              Verificar que la URL esté escrita correctamente
            </li>
            <li>
              <i className="fa-solid fa-envelope"></i>
              Contactar nuestro soporte en <strong>{APP_CONFIG.email.support}</strong>
            </li>
            <li>
              <i className="fa-solid fa-search"></i>
              Explorar nuestra plataforma desde el inicio
            </li>
            <li>
              <i className="fa-solid fa-users"></i>
              Buscar profesionales en nuestro directorio
            </li>
          </ul>
        </div>

        <div className={styles.quickLinksSection}>
          <h3>Enlaces útiles</h3>
          <div className={styles.quickLinks}>
            <Link href="/#como-funciona" className={styles.quickLink}>
              <i className="fa-solid fa-question-circle"></i>
              ¿Cómo funciona?
            </Link>
            <Link href="/#beneficios" className={styles.quickLink}>
              <i className="fa-solid fa-star"></i>
              Beneficios
            </Link>
            <Link href="/dashboard/projects" className={styles.quickLink}>
              <i className="fa-solid fa-project-diagram"></i>
              Ver Proyectos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import styles from "../styles/landing/footer.module.css";
import { SOCIAL_LINKS } from "../lib/config/app";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} Buildit. Todos los Derechos Reservados`;

  return (
    <footer className={styles.footer}>
      <p className="text-xl">Síguenos en</p>
      <div className={styles.socialLinks}>
        <div className="flex items-center justify-center">
          <a
            href={SOCIAL_LINKS[0].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Síguenos en ${SOCIAL_LINKS[0].name}`}
          >
            <img
              src="/instagram_icon.svg"
              alt="Instagram"
              className={styles.icon}
            />
          </a>
          <a 
            href={SOCIAL_LINKS[1].url}
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Síguenos en ${SOCIAL_LINKS[1].name}`}
          >
            <img src="/x_icon.svg" alt="X" className={styles.icon} />
          </a>
        </div>
      </div>
      <p className={styles.copyright}>{copyrightText}</p>
    </footer>
  );
}

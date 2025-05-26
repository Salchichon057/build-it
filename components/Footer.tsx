/* eslint-disable @next/next/no-img-element */
import styles from "../styles/landing/footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} BuildIt. Todos los Derechos Reservados`;

  return (
    <footer className={styles.footer}>
      <p className="text-xl">Síguenos en</p>
      <div className={styles.socialLinks}>
        <div className="flex items-center justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/instagram_icon.svg"
              alt="Instagram"
              className={styles.icon}
            />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <img src="/x_icon.svg" alt="X" className={styles.icon} />
          </a>
        </div>
      </div>
      <p className={styles.copyright}>{copyrightText}</p>
    </footer>
  );
}

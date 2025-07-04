/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "../styles/landing/landing.module.css";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BuildIt - Conecta con Profesionales de la Construcción",
  description:
    "Plataforma líder que conecta clientes con arquitectos, diseñadores y constructores calificados. Encuentra profesionales de confianza para tu proyecto de construcción y haz realidad tus ideas.",
  keywords: [
    "construcción",
    "arquitectos",
    "diseñadores",
    "constructores",
    "proyectos",
    "obras",
    "profesionales",
    "plataforma",
    "BuildIt",
    "reformas",
    "albañilería",
    "decoración",
    "ingeniería",
    "presupuestos",
    "contratistas",
    "especialistas",
  ],
  openGraph: {
    title: "BuildIt - De la Idea a la Obra con los Mejores Profesionales",
    description:
      "Conecta con arquitectos, diseñadores y constructores listos para hacer realidad tu proyecto. Encuentra profesionales verificados en nuestra plataforma.",
    images: [
      {
        url: "/landing/hero.png",
        width: 1200,
        height: 630,
        alt: "BuildIt - Conecta con Profesionales de la Construcción",
      },
    ],
  },
  twitter: {
    title: "BuildIt - Conecta con Profesionales de la Construcción",
    description:
      "Encuentra profesionales de la construcción para tu proyecto. Arquitectos, diseñadores y constructores verificados.",
    images: ["/landing/hero.png"],
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll y detection de sección activa
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "mision", "beneficios", "como-funciona"];
      const scrollPosition = window.scrollY + 120; // Ajustado para el header fijo

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 100; // Altura del header fijo ajustada
      const offsetTop = element.offsetTop - headerHeight;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setIsMenuOpen(false); // Cerrar menú móvil después de click
    }
  };

  return (
    <>
      {/* JSON-LD específico para la landing page */}
      <Script
        id="landing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "BuildIt",
            description:
              "Plataforma que conecta clientes con profesionales de la construcción",
            provider: {
              "@type": "Organization",
              name: "BuildIt",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://buildit.com",
            },
            areaServed: "España",
            serviceType: "Construction Professional Network",
            offers: [
              {
                "@type": "Offer",
                name: "Conexión con Arquitectos",
                description: "Encuentra arquitectos calificados para tu proyecto",
              },
              {
                "@type": "Offer",
                name: "Conexión con Constructores",
                description: "Encuentra constructores verificados para tu obra",
              },
              {
                "@type": "Offer",
                name: "Conexión con Diseñadores",
                description:
                  "Encuentra diseñadores profesionales para tu proyecto",
              },
            ],
          }),
        }}
      />

      {/* Header fijo mejorado */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navBrand}>
            <img
              src="/logo.svg"
              alt="Logo de BuildIt"
              className={styles.navLogo}
            />
          </div>

          {/* Botón hamburguesa para móvil */}
          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className={`${styles.navContent} ${
              isMenuOpen ? styles.open : ""
            }`}
          >
            <ul className={styles.navLinks}>
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className={activeSection === "inicio" ? styles.active : ""}
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("mision")}
                  className={activeSection === "mision" ? styles.active : ""}
                >
                  Misión
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("beneficios")}
                  className={activeSection === "beneficios" ? styles.active : ""}
                >
                  Beneficios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("como-funciona")}
                  className={activeSection === "como-funciona" ? styles.active : ""}
                >
                  ¿Cómo Funciona?
                </button>
              </li>
            </ul>
            <ul className={styles.authLinks}>
              <li>
                <Link href="/sign-up" className={styles.signUpBtn}>
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className={styles.signInBtn}>
                  Ingresar
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Barra de progreso inferior */}
      <div className={styles.progressBar}>
        <div className={styles.progressIndicator}>
          <div
            className={`${styles.progressDot} ${
              activeSection === "inicio" ? styles.active : ""
            }`}
            onClick={() => scrollToSection("inicio")}
            title="Inicio"
          >
            <span className={styles.tooltip}>Inicio</span>
          </div>
          <div
            className={`${styles.progressDot} ${
              activeSection === "mision" ? styles.active : ""
            }`}
            onClick={() => scrollToSection("mision")}
            title="Misión"
          >
            <span className={styles.tooltip}>Misión</span>
          </div>
          <div
            className={`${styles.progressDot} ${
              activeSection === "beneficios" ? styles.active : ""
            }`}
            onClick={() => scrollToSection("beneficios")}
            title="Beneficios"
          >
            <span className={styles.tooltip}>Beneficios</span>
          </div>
          <div
            className={`${styles.progressDot} ${
              activeSection === "como-funciona" ? styles.active : ""
            }`}
            onClick={() => scrollToSection("como-funciona")}
            title="¿Cómo Funciona?"
          >
            <span className={styles.tooltip}>¿Cómo Funciona?</span>
          </div>
        </div>
      </div>

      <main className={styles.landing}>
        {/* Hero Section */}
        <section id="inicio" className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <div className={styles.heroLogo}>
                <img
                  src="/max_logo.svg"
                  alt="Logo de BuildIt"
                  className={styles.logo}
                />
                <h1>BuildIt</h1>
              </div>
              <div className={styles.heroText}>
                <h2>De la Idea a la Obra con los Mejores Profesionales</h2>
                <p>
                  Arquitectos, diseñadores y constructores listos para hacer
                  realidad tu proyecto.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/sign-up" className={styles.ctaButton}>
                    <i className="fa-solid fa-rocket"></i>
                    Únete a Nosotros
                  </Link>
                  <Link href="/sign-in" className={styles.secondaryButton}>
                    <i className="fa-solid fa-sign-in-alt"></i>
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión Section */}
        <section id="mision" className={styles.mision}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Nuestra Misión</h2>
            <div className={styles.misionContent}>
              <div className={styles.misionText}>
                <p>
                  Conectar a clientes con profesionales de la construcción a través
                  de una red eficiente, facilitando la búsqueda, selección y
                  contratación de expertos para llevar a cabo proyectos con éxito.
                </p>
                <div className={styles.misionFeatures}>
                  <div className={styles.feature}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Profesionales verificados</span>
                  </div>
                  <div className={styles.feature}>
                    <i className="fa-solid fa-clock"></i>
                    <span>Respuesta rápida</span>
                  </div>
                  <div className={styles.feature}>
                    <i className="fa-solid fa-shield-check"></i>
                    <span>Garantía de calidad</span>
                  </div>
                </div>
              </div>
              <div className={styles.misionImage}>
                <img src="/landing/mision.png" alt="Imagen de la misión" />
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios Section */}
        <section id="beneficios" className={styles.benefits}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              ¿Por qué Elegir Nuestra Plataforma?
            </h2>

            {/* Para Clientes */}
            <div className={styles.benefitsGroup}>
              <h3 className={styles.subTitle}>Para Clientes</h3>
              <div className={styles.cardsGrid}>
                <div className={styles.benefitCard}>
                  <div className={styles.cardIcon}>
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h4>Encuentra al profesional ideal</h4>
                  <p>
                    Conecta con expertos calificados y revisa sus perfiles para
                    encontrar al mejor para tu obra.
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.cardIcon}>
                    <i className="fa-solid fa-shield-check"></i>
                  </div>
                  <h4>Profesionales verificados</h4>
                  <p>
                    Todos nuestros profesionales están verificados y cuentan con
                    referencias comprobadas.
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.cardIcon}>
                    <i className="fa-solid fa-handshake"></i>
                  </div>
                  <h4>Gestión simplificada</h4>
                  <p>
                    Maneja todas las postulaciones desde un solo lugar y toma
                    decisiones informadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Para Profesionales */}
            <div className={styles.benefitsGroup}>
              <h3 className={styles.subTitle}>Para Profesionales</h3>
              <div className={styles.cardsGrid}>
                <div className={styles.benefitCard}>
                  <div className={styles.cardIcon}>
                    <i className="fa-solid fa-search"></i>
                  </div>
                  <h4>Encuentra proyectos ideales</h4>
                  <p>
                    Explora proyectos disponibles y postúlate a los que mejor se
                    adapten a tus habilidades.
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.cardIcon}>
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <h4>Haz crecer tu negocio</h4>
                  <p>
                    Accede a una red de clientes potenciales y expande tu cartera
                    de proyectos.
                  </p>
                </div>
                <div className={styles.benefitCard}>
                  <div className={styles.cardIcon}>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <h4>Construye tu reputación</h4>
                  <p>
                    Obtén reseñas y referencias que fortalecerán tu perfil
                    profesional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona Section */}
        <section id="como-funciona" className={styles.howItWorks}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>¿Cómo Funciona?</h2>

            {/* Para Clientes */}
            <div className={styles.processGroup}>
              <h3 className={styles.subTitle}>Para Clientes</h3>
              <div className={styles.carouselContainer}>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  slidesPerView={1}
                  spaceBetween={30}
                  navigation={{
                    nextEl: ".swiper-button-next-client",
                    prevEl: ".swiper-button-prev-client",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-client",
                  }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                  }}
                  className={styles.processSwiper}
                >
                  <SwiperSlide>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>1</div>
                      <img src="/landing/client_01.png" alt="Paso 1" />
                      <h4>Publica tu proyecto</h4>
                      <p>Describe tu proyecto con detalles, presupuesto y fechas.</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>2</div>
                      <img src="/landing/client_02.png" alt="Paso 2" />
                      <h4>Recibe postulaciones</h4>
                      <p>Los profesionales interesados enviarán sus propuestas.</p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>3</div>
                      <img src="/landing/client_03.png" alt="Paso 3" />
                      <h4>Selecciona al mejor</h4>
                      <p>Revisa perfiles, propuestas y elige al profesional ideal.</p>
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div className="swiper-button-next swiper-button-next-client"></div>
                <div className="swiper-button-prev swiper-button-prev-client"></div>
                <div className="swiper-pagination swiper-pagination-client"></div>
              </div>
            </div>

            {/* Para Profesionales */}
            <div className={styles.processGroup}>
              <h3 className={styles.subTitle}>Para Profesionales</h3>
              <div className={styles.carouselContainer}>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  slidesPerView={1}
                  spaceBetween={30}
                  navigation={{
                    nextEl: ".swiper-button-next-professional",
                    prevEl: ".swiper-button-prev-professional",
                  }}
                  pagination={{
                    clickable: true,
                    el: ".swiper-pagination-professional",
                  }}
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  breakpoints={{
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                  }}
                  className={styles.processSwiper}
                >
                  <SwiperSlide>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>1</div>
                      <img src="/landing/professional_01.png" alt="Paso 1" />
                      <h4>Explora proyectos</h4>
                      <p>
                        Navega por proyectos disponibles que coincidan con tu
                        especialidad.
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>2</div>
                      <img src="/landing/professional_02.png" alt="Paso 2" />
                      <h4>Envía tu propuesta</h4>
                      <p>
                        Postúlate con tu mejor propuesta y muestra tu experiencia.
                      </p>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>3</div>
                      <img src="/landing/professional_03.png" alt="Paso 3" />
                      <h4>Ejecuta el proyecto</h4>
                      <p>
                        Si eres seleccionado, comienza a trabajar en el proyecto.
                      </p>
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div className="swiper-button-next swiper-button-next-professional"></div>
                <div className="swiper-button-prev swiper-button-prev-professional"></div>
                <div className="swiper-pagination swiper-pagination-professional"></div>
              </div>
            </div>

            {/* CTA Final */}
            <div className={styles.finalCta}>
              <h3>¿Listo para comenzar?</h3>
              <p>
                Únete a BuildIt y conecta con la mejor red de profesionales de la
                construcción
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/sign-up" className={styles.ctaButtonPrimary}>
                  <i className="fa-solid fa-rocket"></i>
                  Empezar Ahora
                </Link>
                <Link href="/sign-in" className={styles.ctaButtonSecondary}>
                  <i className="fa-solid fa-sign-in-alt"></i>
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import styles from "../styles/landing/landing.module.css";
import misionStyles from "../styles/landing/mision.module.css";
import benefitsStyles from "../styles/landing/benefits.module.css";
import howitworksStyles from "../styles/landing/howitworks.module.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [currentSlideClient, setCurrentSlideClient] = useState(0);
  const [currentSlideProfessional, setCurrentSlideProfessional] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Datos para los carruseles
  const clientSlides = [
    {
      image: "/landing/slide_client_01.png",
      title: "Publica tu proyecto",
      description: "Describe tu proyecto con detalles, presupuesto y fechas.",
    },
    {
      image: "/landing/slide_client_02.png",
      title: "Maneja tus proyectos",
      description: "Podrás gestionar tus proyectos y recibir propuestas.",
    },
    {
      image: "/landing/slide_client_03.png",
      title: "Selecciona al mejor",
      description: "Revisa perfiles y elige al profesional ideal.",
    },
  ];

  const professionalSlides = [
    {
      image: "/landing/slide_professional_01.png",
      title: "Explora proyectos",
      description:
        "Navega por proyectos disponibles que coincidan con tu especialidad.",
    },
    {
      image: "/landing/slide_professional_02.png",
      title: "Envía tu propuesta",
      description: "Conectate con clientes vía whatsapp y envía tu propuesta.",
    }
  ];

  // Detección de sección activa basada en scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = 80; // Altura aproximada del header sticky
      
      // Detectar si se ha hecho scroll para cambiar el estilo de la navbar
      setIsScrolled(scrollPosition > 50);
      
      // Detección de sección activa
      const sections = ["inicio", "mision", "beneficios", "como-funciona"];
      const adjustedScrollPosition = scrollPosition + headerHeight + 50;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            adjustedScrollPosition >= offsetTop &&
            adjustedScrollPosition < offsetTop + height
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

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Altura del header sticky
      const offsetTop = element.offsetTop - headerHeight;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Funciones para controlar carrusel de clientes
  const nextSlideClient = () => {
    setCurrentSlideClient((prev) => (prev + 1) % clientSlides.length);
  };

  const prevSlideClient = () => {
    setCurrentSlideClient(
      (prev) => (prev - 1 + clientSlides.length) % clientSlides.length
    );
  };

  const goToSlideClient = (index: number) => {
    setCurrentSlideClient(index);
  };

  // Funciones para controlar carrusel de profesionales
  const nextSlideProfessional = () => {
    setCurrentSlideProfessional((prev) => (prev + 1) % professionalSlides.length);
  };

  const prevSlideProfessional = () => {
    setCurrentSlideProfessional(
      (prev) => (prev - 1 + professionalSlides.length) % professionalSlides.length
    );
  };

  const goToSlideProfessional = (index: number) => {
    setCurrentSlideProfessional(index);
  };
  return (
    <div className={styles.landing}>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : styles.headerTransparent}`}>
        <nav className={styles.nav}>
          <img src="/logo.svg" alt="Logo de Buildit" />
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
              <Link href="/sign-up">Registrarse</Link>
            </li>
            <li>
              <Link href="/sign-in">Ingresar</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section id="inicio" className={styles.hero}>
          <div className={styles.heroContent}>
            <img
              src="/max_logo.svg"
              alt="Logo de Buildit"
              className={styles.logo}
            />
            <h1>Buildit</h1>
          </div>
          <div className={styles.heroText}>
            <h2>De la idea a la obra con los mejores profesionales</h2>
            <p>
              Arquitectos, diseñadores y constructores listos para hacer
              realidad tu proyecto.
            </p>
            <Link href="/sign-up" className={styles.ctaButton}>
              Únete a Nosotros
            </Link>
          </div>
        </section>
        <section className={styles.mision} id="mision">
          <h2 className={misionStyles.title}>Misión</h2>
          <div className={misionStyles.content}>
            <p>
              Conectar a clientes con profesionales de la construcción a través
              de una red eficiente, facilitando la búsqueda, selección y
              contratación de expertos para llevar a cabo proyectos con éxito.
            </p>
            <img src="/landing/mision.png" alt="Imagen de la misión" />
          </div>
        </section>
        <section className={benefitsStyles.benefits} id="beneficios">
          <h2 className={benefitsStyles.title}>
            ¿Por qué Elegir Nuestra Plataforma?
          </h2>
          <div className={benefitsStyles.cardsContainer}>
            <p className={benefitsStyles.subTitle}>Para Clientes</p>
            <div className={benefitsStyles.cardsWrapper}>
              <div className={benefitsStyles.flipCard}>
                <div className={benefitsStyles.flipCardInner}>
                  <div className={benefitsStyles.flipCardFront}>
                    <img
                      src="/landing/client_01.png"
                      alt="Encuentra profesional"
                      className={benefitsStyles.cardImage}
                    />
                    <h3 className={benefitsStyles.cardTitle}>
                      Encuentra al profesional ideal para tu proyecto
                    </h3>
                  </div>
                  <div className={benefitsStyles.flipCardBack}>
                    <p className={benefitsStyles.cardText}>
                      Conecta con expertos calificados y revisa sus perfiles
                      para encontrar al mejor para tu obra.
                    </p>
                  </div>
                </div>
              </div>
              <div className={benefitsStyles.flipCard}>
                <div className={benefitsStyles.flipCardInner}>
                  <div className={benefitsStyles.flipCardFront}>
                    <img
                      src="/landing/client_02.png"
                      alt="Publica proyectos"
                      className={benefitsStyles.cardImage}
                    />
                    <h3 className={benefitsStyles.cardTitle}>
                      Publica proyectos de manera sencilla
                    </h3>
                  </div>
                  <div className={benefitsStyles.flipCardBack}>
                    <p className={benefitsStyles.cardText}>
                      Sube los detalles de tu proyecto en minutos y recibe
                      propuestas de profesionales.
                    </p>
                  </div>
                </div>
              </div>
              <div className={benefitsStyles.flipCard}>
                <div className={benefitsStyles.flipCardInner}>
                  <div className={benefitsStyles.flipCardFront}>
                    <img
                      src="/landing/client_03.png"
                      alt="Contrata con confianza"
                      className={benefitsStyles.cardImage}
                    />
                    <h3 className={benefitsStyles.cardTitle}>
                      Contrata con confianza
                    </h3>
                  </div>
                  <div className={benefitsStyles.flipCardBack}>
                    <p className={benefitsStyles.cardText}>
                      Revisa evaluaciones y contrata con garantía de calidad y
                      seguridad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={benefitsStyles.cardsContainer}>
            <p className={benefitsStyles.subTitle}>Para Profesionales</p>
            <div className={benefitsStyles.cardsWrapper}>
              <div className={benefitsStyles.flipCard}>
                <div className={benefitsStyles.flipCardInner}>
                  <div className={benefitsStyles.flipCardFront}>
                    <img
                      src="/landing/professional_01.jpeg"
                      alt="Encuentra proyectos"
                      className={benefitsStyles.cardImage}
                    />
                    <h3 className={benefitsStyles.cardTitle}>
                      Encuentra proyectos que se ajusten a tu experiencia
                    </h3>
                  </div>
                  <div className={benefitsStyles.flipCardBack}>
                    <p className={benefitsStyles.cardText}>
                      Explora proyectos disponibles y postúlate a los que mejor
                      se adapten a tus habilidades.
                    </p>
                  </div>
                </div>
              </div>
              <div className={benefitsStyles.flipCard}>
                <div className={benefitsStyles.flipCardInner}>
                  <div className={benefitsStyles.flipCardFront}>
                    <img
                      src="/landing/professional_02.jpg"
                      alt="Encuentra proyectos"
                      className={benefitsStyles.cardImage}
                    />
                    <h3 className={benefitsStyles.cardTitle}>
                      Encuentra proyectos que se ajusten a tu experiencia
                    </h3>
                  </div>
                  <div className={benefitsStyles.flipCardBack}>
                    <p className={benefitsStyles.cardText}>
                      Explora proyectos disponibles y postúlate a los que mejor
                      se adapten a tus habilidades.
                    </p>
                  </div>
                </div>
              </div>
              <div className={benefitsStyles.flipCard}>
                <div className={benefitsStyles.flipCardInner}>
                  <div className={benefitsStyles.flipCardFront}>
                    <img
                      src="/landing/professional_03.jpeg"
                      alt="Encuentra proyectos"
                      className={benefitsStyles.cardImage}
                    />
                    <h3 className={benefitsStyles.cardTitle}>
                      Encuentra proyectos que se ajusten a tu experiencia
                    </h3>
                  </div>
                  <div className={benefitsStyles.flipCardBack}>
                    <p className={benefitsStyles.cardText}>
                      Explora proyectos disponibles y postúlate a los que mejor
                      se adapten a tus habilidades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={howitworksStyles.howItWorks} id="como-funciona">
          <h2 className={benefitsStyles.title}>¿Cómo Funciona?</h2>

          {/* Para Clientes */}
          <p className={benefitsStyles.subTitle}>Para Clientes</p>
          <div className={howitworksStyles.carouselContainer}>
            <div className={howitworksStyles.carouselWrapper}>
              <div
                className={howitworksStyles.carouselTrack}
                style={{ transform: `translateX(-${currentSlideClient * 100}%)` }}
              >
                {clientSlides.map((slide, index) => (
                  <div key={index} className={howitworksStyles.slide}>
                    <div className={howitworksStyles.slideContent}>
                      <img
                        src={slide.image}
                        alt={`Paso ${index + 1} para Clientes`}
                        className={howitworksStyles.carouselImage}
                      />
                      <h4>{slide.title}</h4>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones de navegación */}
              <button
                className={`${howitworksStyles.navButton} ${howitworksStyles.prevButton}`}
                onClick={prevSlideClient}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className={`${howitworksStyles.navButton} ${howitworksStyles.nextButton}`}
                onClick={nextSlideClient}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>

            {/* Indicadores (puntos) */}
            <div className={howitworksStyles.pagination}>
              {clientSlides.map((_, index) => (
                <button
                  key={index}
                  className={`${howitworksStyles.paginationDot} ${
                    index === currentSlideClient ? howitworksStyles.active : ""
                  }`}
                  onClick={() => goToSlideClient(index)}
                  aria-label={`Ir al paso ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Para Profesionales */}
          <p className={benefitsStyles.subTitle}>Para Profesionales</p>
          <div className={howitworksStyles.carouselContainer}>
            <div className={howitworksStyles.carouselWrapper}>
              <div
                className={howitworksStyles.carouselTrack}
                style={{ transform: `translateX(-${currentSlideProfessional * 100}%)` }}
              >
                {professionalSlides.map((slide, index) => (
                  <div key={index} className={howitworksStyles.slide}>
                    <div className={howitworksStyles.slideContent}>
                      <img
                        src={slide.image}
                        alt={`Paso ${index + 1} para Profesionales`}
                        className={howitworksStyles.carouselImage}
                      />
                      <h4>{slide.title}</h4>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones de navegación */}
              <button
                className={`${howitworksStyles.navButton} ${howitworksStyles.prevButton}`}
                onClick={prevSlideProfessional}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className={`${howitworksStyles.navButton} ${howitworksStyles.nextButton}`}
                onClick={nextSlideProfessional}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>

            {/* Indicadores (puntos) */}
            <div className={howitworksStyles.pagination}>
              {professionalSlides.map((_, index) => (
                <button
                  key={index}
                  className={`${howitworksStyles.paginationDot} ${
                    index === currentSlideProfessional ? howitworksStyles.active : ""
                  }`}
                  onClick={() => goToSlideProfessional(index)}
                  aria-label={`Ir al paso ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

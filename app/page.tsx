/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "../styles/landing/landing.module.css";
import misionStyles from "../styles/landing/mision.module.css";
import benefitsStyles from "../styles/landing/benefits.module.css";
import howitworksStyles from "../styles/landing/howitworks.module.css";

export default function Home() {
  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <img src="/logo.svg" alt="Logo de buildit" />
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="#mision">Misión</Link>
            </li>
            <li>
              <Link href="#beneficios">Beneficios</Link>
            </li>
            <li>
              <Link href="#como-funciona">¿Cómo Funciona?</Link>
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
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <img
              src="/max_logo.svg"
              alt="Logo de buildit"
              className={styles.logo}
            />
            <h1>buildit</h1>
          </div>
          <div className={styles.heroText}>
            <h2>De la Idea a la Obra con los Mejores Profesionales</h2>
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
                      src="/landing/professional_01.png"
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
                      src="/landing/professional_02.png"
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
                      src="/landing/professional_03.png"
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
          <p className={benefitsStyles.subTitle}>Para Clientes</p>
          <div
            className={`${howitworksStyles.carouselContainer} ${howitworksStyles.carouselContainerClient}`}
          >
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              centeredSlides={true}
              navigation={{
                nextEl: `.${howitworksStyles.swiperButtonNextClient}`,
                prevEl: `.${howitworksStyles.swiperButtonPrevClient}`,
              }}
              pagination={{
                el: `.${howitworksStyles.swiperPaginationClient}`,
                clickable: true,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className={`${howitworksStyles.swiper} ${howitworksStyles.swiperClient}`}
            >
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/client_01.png"
                  alt="Paso 1 para Clientes"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/client_02.png"
                  alt="Paso 2 para Clientes"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/client_03.png"
                  alt="Paso 3 para Clientes"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/client_04.png"
                  alt="Paso 4 para Clientes"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
            </Swiper>
            <div className={howitworksStyles.swiperButtonPrevClient}></div>
            <div className={howitworksStyles.swiperButtonNextClient}></div>
            <div className={howitworksStyles.swiperPaginationClient}></div>
          </div>
          <p className={benefitsStyles.subTitle}>Para Profesionales</p>
          <div
            className={`${howitworksStyles.carouselContainer} ${howitworksStyles.carouselContainerProfessional}`}
          >
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              centeredSlides={true}
              navigation={{
                nextEl: `.${howitworksStyles.swiperButtonNextProfessional}`,
                prevEl: `.${howitworksStyles.swiperButtonPrevProfessional}`,
              }}
              pagination={{
                el: `.${howitworksStyles.swiperPaginationProfessional}`,
                clickable: true,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className={`${howitworksStyles.swiper} ${howitworksStyles.swiperProfessional}`}
            >
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/professional_01.png"
                  alt="Paso 1 para Profesionales"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/professional_02.png"
                  alt="Paso 2 para Profesionales"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/professional_03.png"
                  alt="Paso 3 para Profesionales"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
              <SwiperSlide className={howitworksStyles.swiperSlide}>
                <img
                  src="/landing/professional_04.png"
                  alt="Paso 4 para Profesionales"
                  className={howitworksStyles.carouselImage}
                />
              </SwiperSlide>
            </Swiper>
            <div
              className={howitworksStyles.swiperButtonPrevProfessional}
            ></div>
            <div
              className={howitworksStyles.swiperButtonNextProfessional}
            ></div>
            <div
              className={howitworksStyles.swiperPaginationProfessional}
            ></div>
          </div>
        </section>
      </main>
    </div>
  );
}

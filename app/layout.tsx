import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";
import { APP_CONFIG } from "../lib/config/app";

const defaultUrl = APP_CONFIG.baseUrl;

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: APP_CONFIG.name + " - " + APP_CONFIG.slogan,
    template: `%s | ${APP_CONFIG.name}`
  },
  description: APP_CONFIG.description + ". Publica tu proyecto, recibe propuestas y selecciona al mejor profesional para hacer realidad tu obra. ¡Únete a Buildit!",
  keywords: APP_CONFIG.keywords,
  authors: [{ name: "Buildit Team", url: defaultUrl }],
  creator: APP_CONFIG.name,
  publisher: APP_CONFIG.name,
  applicationName: APP_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: APP_CONFIG.locale,
    url: defaultUrl,
    title: APP_CONFIG.name + " - " + APP_CONFIG.slogan,
    description: APP_CONFIG.description + " en México. Publica tu proyecto, recibe propuestas y encuentra al profesional ideal para tu obra.",
    siteName: APP_CONFIG.name,
    images: [
      {
        url: "/landing/hero.png",
        width: 1200,
        height: 630,
        alt: "Buildit - Plataforma de profesionales de construcción",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: APP_CONFIG.social.x.handle,
    title: APP_CONFIG.name + " - " + APP_CONFIG.slogan,
    description: "Conecta con profesionales de la construcción verificados. Publica tu proyecto y encuentra al mejor profesional. ¡Únete ahora!",
    images: ["/landing/hero.png"],
    creator: APP_CONFIG.social.x.handle,
  },
  category: "construction",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "verification_token_here", // Agregar cuando tengas el token real
  },
  alternates: {
    canonical: defaultUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#02273A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* SEO específico para construcción */}
        <meta name="geo.region" content="MX" />
        <meta name="geo.country" content="Mexico" />
        <meta name="language" content="Spanish" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="classification" content="construction, architecture, design" />
        
        {/* Metatags para redes sociales */}
        <meta property="fb:app_id" content="your_facebook_app_id" />
        <meta property="business:contact_data:locality" content="México" />
        <meta property="business:contact_data:region" content="MX" />
        <meta property="business:contact_data:country_name" content="Mexico" />
        
        {/* Fuentes optimizadas */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["WebSite", "Service"],
              "name": "Buildit",
              "alternateName": "Buildit - Plataforma de Construcción",
              "url": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
              "description": "Conecta con arquitectos, diseñadores y constructores verificados para tu proyecto de construcción",
              "serviceType": "Construction Professional Network",
              "areaServed": {
                "@type": "Country",
                "name": "Mexico"
              },
              "category": ["Construction", "Architecture", "Design"],
              "audience": {
                "@type": "Audience",
                "audienceType": ["Property Owners", "Construction Professionals", "Architects", "Designers"]
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Conexión con Arquitectos",
                  "description": "Encuentra arquitectos calificados para tu proyecto",
                  "category": "Architecture Services"
                },
                {
                  "@type": "Offer", 
                  "name": "Conexión con Constructores",
                  "description": "Encuentra constructores verificados para tu obra",
                  "category": "Construction Services"
                },
                {
                  "@type": "Offer",
                  "name": "Conexión con Diseñadores", 
                  "description": "Encuentra diseñadores profesionales para tu proyecto",
                  "category": "Design Services"
                }
              ],
              "potentialAction": [
                {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/dashboard/professionals?search={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                },
                {
                  "@type": "RegisterAction",
                  "target": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/sign-up`,
                  "name": "Registrarse en Buildit"
                }
              ],
              "sameAs": [
                APP_CONFIG.social.x.url,
                APP_CONFIG.social.instagram.url
              ],
              "publisher": {
                "@type": "Organization",
                "@id": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}#organization`,
                "name": "Buildit",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/logo.svg`,
                  "width": 300,
                  "height": 100
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "Customer Service",
                  "areaServed": "MX",
                  "availableLanguage": "Spanish"
                }
              },
              "mainEntity": {
                "@type": "WebPage",
                "@id": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}#webpage`,
                "name": "Buildit - De la Idea a la Obra con los Mejores Profesionales",
                "description": "Landing page de Buildit donde puedes conectar con profesionales de la construcción",
                "primaryImageOfPage": {
                  "@type": "ImageObject",
                  "url": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/landing/hero.png`
                }
              }
            })
          }}
        />
      </head>
      <body style={{ backgroundColor: "#ffffff", color: "#02273A" }}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

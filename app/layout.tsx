import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "BuildIt - Conecta con Profesionales de la Construcción",
    template: "%s | BuildIt"
  },
  description:
    "Plataforma líder que conecta clientes con arquitectos, diseñadores y constructores calificados. Encuentra profesionales de confianza para tu proyecto de construcción y haz realidad tus ideas.",
  keywords: [
    "construcción", "arquitectos", "diseñadores", "constructores", "proyectos", 
    "obras", "profesionales", "plataforma", "BuildIt", "reformas", "albañilería",
    "decoración", "ingeniería", "presupuestos", "contratistas", "especialistas",
    "construcción residencial", "construcción comercial", "renovaciones"
  ],
  authors: [{ name: "BuildIt Team", url: defaultUrl }],
  creator: "BuildIt",
  publisher: "BuildIt",
  applicationName: "BuildIt",
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
    locale: "es_ES",
    url: defaultUrl,
    title: "BuildIt - Conecta con Profesionales de la Construcción",
    description: "Plataforma líder que conecta clientes con profesionales de la construcción. Encuentra arquitectos, diseñadores y constructores para tu proyecto y haz realidad tus ideas.",
    siteName: "BuildIt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildIt - Plataforma de Construcción",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BuildItApp",
    title: "BuildIt - Conecta con Profesionales de la Construcción",
    description: "Encuentra profesionales de la construcción para tu proyecto. Arquitectos, diseñadores y constructores verificados.",
    images: ["/og-image.png"],
    creator: "@BuildItApp",
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#02273A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
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
              "@type": "WebSite",
              "name": "BuildIt",
              "alternateName": "BuildIt - Plataforma de Construcción",
              "url": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
              "description": "Plataforma líder que conecta clientes con profesionales de la construcción",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/dashboard/professionals?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/BuildItApp",
                "https://facebook.com/BuildItApp",
                "https://linkedin.com/company/buildit"
              ],
              "publisher": {
                "@type": "Organization",
                "@id": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}#organization`,
                "name": "BuildIt",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/logo.svg`
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

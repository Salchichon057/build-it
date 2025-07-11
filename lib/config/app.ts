// Constantes de la aplicación Buildit
export const APP_CONFIG = {
  name: "Buildit",
  slogan: "De la Idea a la Obra con los Mejores Profesionales",
  description: "Conecta con arquitectos, diseñadores y constructores verificados en México",
  
  // URLs
  baseUrl: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000",
  
  // Contacto
  email: {
    support: "soporte@buildit.mx",
    contact: "contacto@buildit.mx",
  },
  
  // Redes sociales (URLs reales actualizadas)
  social: {
    instagram: {
      url: "https://www.instagram.com/buildit.mx?igsh=MXBpN2Y1N3doYnFpMg==",
      handle: "@buildit.mx",
      name: "Instagram"
    },
    x: {
      url: "https://x.com/buildit_mx?s=21&t=iHOJXPm8urTKEO_xhGnGmA",
      handle: "@buildit_mx", 
      name: "X (antes Twitter)"
    }
  },
  
  // SEO
  keywords: [
    "arquitectos", "diseñadores", "constructores", "proyectos construcción", 
    "profesionales construcción", "obras", "reformas", "construcción casa",
    "presupuestos construcción", "contratistas", "albañiles", "decoradores",
    "ingenieros", "plataforma construcción", "Buildit", "México", "profesionales verificados",
    "construcción residencial", "construcción comercial", "renovaciones", "proyectos obra",
    "construcción mexico", "obras mexico", "arquitectos mexico", "constructores mexico"
  ],
  
  // Colores del tema
  colors: {
    primary: "#02273A",
    secondary: "#ffffff", 
    accent: "#4F46E5"
  },
  
  // Configuración de región
  locale: "es-MX",
  country: "México",
  countryCode: "MX",
  timezone: "America/Mexico_City"
} as const;

// Exportar URLs de redes sociales como array para facilitar iteración
export const SOCIAL_LINKS = [
  APP_CONFIG.social.instagram,
  APP_CONFIG.social.x
] as const;

export default APP_CONFIG;

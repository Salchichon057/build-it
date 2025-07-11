# 🏗️ Buildit - Plataforma de Construcción

**Plataforma web moderna que conecta clientes con profesionales de la construcción**

<p align="center">
  <a href="#características"><strong>Características</strong></a> ·
  <a href="#tecnologías"><strong>Tecnologías</strong></a> ·
  <a href="#instalación"><strong>Instalación</strong></a> ·
  <a href="#arquitectura"><strong>Arquitectura</strong></a> ·
  <a href="#documentación"><strong>Documentación</strong></a>
</p>

---

## 🚀 Características

**Buildit** es una plataforma integral que facilita la conexión entre:
- 👥 **Clientes**: Publican proyectos de construcción y reciben postulaciones
- 🔨 **Profesionales**: Exploran proyectos disponibles y postulan a oportunidades

### ✨ Funcionalidades Principales

#### Para Clientes:
- 📝 **Gestión de Proyectos**: Crear, editar y gestionar proyectos de construcción
- 👀 **Revisión de Postulaciones**: Ver y evaluar profesionales interesados
- ✅ **Selección de Profesionales**: Aceptar/rechazar postulaciones
- 📱 **Contacto Directo**: Integración con WhatsApp al aceptar postulaciones
- 🔔 **Notificaciones**: Sistema completo de notificaciones en tiempo real

#### Para Profesionales:
- 🔍 **Explorar Proyectos**: Navegar por proyectos disponibles
- 📋 **Postulaciones**: Enviar propuestas a proyectos de interés
- 👤 **Perfil Profesional**: Mostrar habilidades y experiencia
- 🏢 **Directorio**: Explorar otros profesionales registrados
- 📩 **Seguimiento**: Rastrear estado de postulaciones

#### Sistema General:
- 🔐 **Autenticación Completa**: Registro/login seguro con Supabase Auth
- 🎨 **UI/UX Moderna**: Diseño responsivo con Tailwind CSS
- ⚡ **Rendimiento**: Server-side rendering con Next.js 15
- 📱 **Responsive**: Optimizado para todos los dispositivos

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de utilidades CSS
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconografía

### Backend & Base de Datos
- **Supabase** - Backend as a Service
  - Autenticación
  - Base de datos PostgreSQL
  - Almacenamiento de archivos
  - APIs en tiempo real
- **Server Actions** - Lógica del servidor en Next.js
- **Zod** - Validación de esquemas

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **CSS Modules** - Estilos modulares

---

## 📥 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd build-it
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear `.env.local` basado en `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   
   Actualizar con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Configurar base de datos**
   
   Ejecutar las migraciones SQL en tu proyecto de Supabase:
   - Ver `database/` para scripts de configuración

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

6. **Construir para producción**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Arquitectura

### 📁 Estructura del Proyecto

```
build-it/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 (auth-pages)/       # Rutas de autenticación agrupadas
│   ├── 📁 auth/               # Callbacks de autenticación
│   ├── 📁 dashboard/          # Dashboard protegido
│   │   ├── 📁 complete-profile/
│   │   ├── 📁 notifications/  # Página de notificaciones
│   │   ├── 📁 postulations/   # Gestión de postulaciones
│   │   ├── 📁 professionals/  # Directorio de profesionales
│   │   ├── 📁 profile/        # Perfil de usuario
│   │   ├── 📁 projects/       # Gestión de proyectos
│   │   │   └── 📁 available/  # Proyectos disponibles
│   │   └── 📁 settings/
│   └── layout.tsx + page.tsx
│
├── 📁 components/              # Componentes React organizados
│   ├── 📁 dashboard/          # Componentes específicos del dashboard
│   │   ├── 📁 notifications/
│   │   ├── 📁 postulations/
│   │   ├── 📁 professionals/
│   │   ├── 📁 profile/
│   │   └── 📁 projects/
│   ├── 📁 projects/           # Componentes reutilizables de proyectos
│   ├── 📁 modal/             # Componentes de modal
│   └── 📁 ui/                # Componentes UI básicos
│
├── 📁 lib/                    # Lógica de negocio y servicios
│   ├── 📁 auth/              # Servicios de autenticación
│   ├── 📁 categories/        # Gestión de categorías
│   ├── 📁 notifications/     # Sistema de notificaciones
│   ├── 📁 postulations/      # Lógica de postulaciones
│   ├── 📁 projects/          # Gestión de proyectos
│   ├── 📁 skills/            # Habilidades de profesionales
│   ├── 📁 storage/           # Almacenamiento de archivos
│   └── 📁 validators/        # Validaciones con Zod
│
├── 📁 styles/                # CSS Modules organizados
│   ├── 📁 dashboard/         # Estilos del dashboard
│   ├── 📁 auth/             # Estilos de autenticación
│   └── 📁 landing/          # Estilos de landing page
│
├── 📁 utils/                 # Utilidades y configuraciones
│   └── 📁 supabase/         # Configuración de Supabase
│
└── 📁 database/              # Scripts SQL y migraciones
```

### 🔄 Flujo de Datos

1. **Autenticación**: Supabase Auth con cookies para SSR
2. **Server Actions**: Operaciones del servidor en Next.js
3. **Base de Datos**: PostgreSQL con relaciones bien definidas
4. **Estados**: Gestión reactiva con hooks de React
5. **Notificaciones**: Sistema en tiempo real con actualizaciones automáticas

---

## 📚 Documentación

### Documentos Técnicos Incluidos

- **`ARQUITECTURA_REORGANIZADA.md`** - Detalles de la estructura del proyecto
- **`POSTULACIONES_IMPLEMENTACION.md`** - Flujo completo de postulaciones
- **`FLUJO_COMPLETO_NOTIFICACIONES.md`** - Sistema de notificaciones
- **`FEATURES_IMPLEMENTED.md`** - Funcionalidades completadas
- **`ANALISIS_FINAL_POSTULACIONES.md`** - Análisis técnico del sistema

### 🔧 Scripts Disponibles

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Construcción para producción
npm start        # Servidor de producción
```

### 🚀 Estado del Proyecto

✅ **COMPLETADO:**
- Sistema de autenticación completo
- Gestión de proyectos (CRUD)
- Sistema de postulaciones con datos reales
- Notificaciones en tiempo real
- Integración con WhatsApp
- UI/UX moderna y responsiva
- Arquitectura escalable y mantenible

🔄 **EN DESARROLLO:**
- Sistema de pagos
- Chat integrado
- Evaluaciones y reviews
- Panel de administración

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es propietario y confidencial.

---

## 📞 Soporte

Para soporte técnico, consulta la documentación incluida en el proyecto o contacta al equipo de desarrollo.

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

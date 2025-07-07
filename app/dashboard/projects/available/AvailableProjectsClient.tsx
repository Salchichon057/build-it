"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import styles from "@/styles/dashboard/projects.module.css";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
    phone: string | null;
  } | null;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  account_type: string;
}

interface AvailableProjectsClientProps {
  projects: Project[];
  currentUser: User;
}

export default function AvailableProjectsClient({ projects, currentUser }: AvailableProjectsClientProps) {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  useEffect(() => {
    let filtered = projects;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por ubicación
    if (locationFilter) {
      filtered = filtered.filter(project =>
        project.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filtro por presupuesto
    if (budgetFilter) {
      filtered = filtered.filter(project => {
        if (!project.budget) return false;
        const budget = project.budget;
        switch (budgetFilter) {
          case "bajo":
            return budget < 500000;
          case "medio":
            return budget >= 500000 && budget < 2000000;
          case "alto":
            return budget >= 2000000;
          default:
            return true;
        }
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, locationFilter, budgetFilter]);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Presupuesto a convenir";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin fecha definida";
    return new Date(dateString).toLocaleDateString("es-MX");
  };

  const generateWhatsAppLink = (project: Project) => {
    if (!project.users?.phone) {
      alert(`❌ No es posible contactar al cliente

El cliente ${project.users?.first_name} ${project.users?.last_name} no ha registrado un número de teléfono en su perfil.

💡 Sugerencia: Puedes ver otros proyectos disponibles o contactar al cliente a través de BuildIt cuando actualice su información de contacto.`);
      return null;
    }

    const professionalName = `${currentUser.first_name} ${currentUser.last_name}`;
    const clientName = `${project.users.first_name} ${project.users.last_name}`;
    const projectTitle = project.title;
    
    const message = `¡Hola ${clientName}! 👋

Mi nombre es ${professionalName} y soy un profesional de la construcción. He visto tu proyecto "${projectTitle}" en BuildIt y me interesa mucho poder colaborar contigo.

Me gustaría conversar sobre:
• Los detalles específicos del proyecto
• Mi experiencia y cómo puedo ayudarte
• Presupuesto y cronograma
• Cualquier pregunta que tengas

¿Podrías contarme más sobre lo que necesitas? Estoy disponible para una llamada o reunión cuando te sea conveniente.

¡Espero poder trabajar juntos en este proyecto! 🏗️

Saludos,
${professionalName}
BuildIt Platform`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = project.users.phone.replace(/\D/g, ''); // Remover caracteres no numéricos
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const handleApply = (project: Project) => {
    const whatsappLink = generateWhatsAppLink(project);
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-search"></i>
          Proyectos Disponibles
        </h1>
        <p className={styles.subtitle}>
          Encuentra proyectos que se ajusten a tu experiencia y especialidad
        </p>
      </div>

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filters}>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las ubicaciones</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="puebla">Puebla</option>
            <option value="tijuana">Tijuana</option>
            <option value="león">León</option>
            <option value="mérida">Mérida</option>
          </select>
          
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los presupuestos</option>
            <option value="bajo">Hasta $500.000</option>
            <option value="medio">$500.000 - $2.000.000</option>
            <option value="alto">Más de $2.000.000</option>
          </select>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className={styles.projectsList}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-search"></i>
            <h3>No se encontraron proyectos</h3>
            <p>Intenta ajustar los filtros para ver más resultados</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.titleSection}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  {project.users?.phone && (
                    <span className={styles.whatsappBadge} title="Cliente disponible en WhatsApp">
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                  )}
                </div>
                <div className={styles.projectBudget}>
                  {formatCurrency(project.budget)}
                </div>
              </div>

              <p className={styles.projectDescription}>
                {project.description}
              </p>

              <div className={styles.projectDetails}>
                {project.location && (
                  <div className={styles.projectDetail}>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{project.location}</span>
                  </div>
                )}
                
                {project.start_date && (
                  <div className={styles.projectDetail}>
                    <i className="fa-solid fa-calendar"></i>
                    <span>Inicio: {formatDate(project.start_date)}</span>
                  </div>
                )}
                
                {project.end_date && (
                  <div className={styles.projectDetail}>
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Fin: {formatDate(project.end_date)}</span>
                  </div>
                )}
              </div>

              <div className={styles.projectFooter}>
                <div className={styles.clientInfo}>
                  <img
                    src={project.users?.profile_image || "/default-avatar.png"}
                    alt="Cliente"
                    className={styles.clientAvatar}
                  />
                  <div>
                    <p className={styles.clientName}>
                      {project.users?.first_name} {project.users?.last_name}
                    </p>
                    <p className={styles.projectDate}>
                      Publicado el {formatDate(project.created_at)}
                    </p>
                  </div>
                </div>
                
                <button
                  className={styles.applyButton}
                  onClick={() => handleApply(project)}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  Contactar por WhatsApp
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import styles from "@/app/dashboard/projects/projects.module.css";

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
  } | null;
}

interface AvailableProjectsClientProps {
  projects: Project[];
}

export default function AvailableProjectsClient({ projects }: AvailableProjectsClientProps) {
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
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin fecha definida";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const handleApply = async (projectId: string) => {
    // Aquí implementarías la lógica de postulación
    // Por ahora, solo mostramos un alert
    alert("Funcionalidad de postulación próximamente disponible");
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
            <option value="santiago">Santiago</option>
            <option value="valparaíso">Valparaíso</option>
            <option value="concepción">Concepción</option>
            <option value="la serena">La Serena</option>
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
                <h3 className={styles.projectTitle}>{project.title}</h3>
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
                  onClick={() => handleApply(project.id)}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  Postular
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

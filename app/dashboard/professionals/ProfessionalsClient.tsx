"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/dashboard/projects.module.css";

interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
  speciality: string | null;
  experience_years: string | null;
  address: string | null;
  cv_url: string | null;
  created_at: string;
}

interface ProfessionalsClientProps {
  professionals: Professional[];
}

export default function ProfessionalsClient({ professionals }: ProfessionalsClientProps) {
  const [filteredProfessionals, setFilteredProfessionals] = useState(professionals);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    let filtered = professionals;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(professional =>
        professional.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por especialidad
    if (specialityFilter) {
      filtered = filtered.filter(professional =>
        professional.speciality?.toLowerCase().includes(specialityFilter.toLowerCase())
      );
    }

    // Filtro por experiencia
    if (experienceFilter) {
      filtered = filtered.filter(professional => {
        const experience = parseInt(professional.experience_years || "0");
        switch (experienceFilter) {
          case "junior":
            return experience < 3;
          case "semi-senior":
            return experience >= 3 && experience < 7;
          case "senior":
            return experience >= 7;
          default:
            return true;
        }
      });
    }

    setFilteredProfessionals(filtered);
  }, [professionals, searchTerm, specialityFilter, experienceFilter]);

  const handleViewProfile = (professionalId: string) => {
    window.location.href = `/dashboard/professionals/${professionalId}`;
  };

  const handleDownloadCV = (cvUrl: string) => {
    window.open(cvUrl, '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-users"></i>
          Explorar Profesionales
        </h1>
        <p className={styles.subtitle}>
          Encuentra el profesional ideal para tu próximo proyecto
        </p>
      </div>

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filters}>
          <select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las especialidades</option>
            <option value="arquitectura">Arquitectura</option>
            <option value="ingeniería">Ingeniería</option>
            <option value="construcción">Construcción</option>
            <option value="diseño">Diseño</option>
            <option value="electricidad">Electricidad</option>
            <option value="plomería">Plomería</option>
          </select>
          
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Toda la experiencia</option>
            <option value="junior">Junior (0-2 años)</option>
            <option value="semi-senior">Semi-Senior (3-6 años)</option>
            <option value="senior">Senior (7+ años)</option>
          </select>
        </div>
      </div>

      {/* Lista de profesionales */}
      <div className={styles.professionalsList}>
        {filteredProfessionals.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-user-slash"></i>
            <h3>No se encontraron profesionales</h3>
            <p>Intenta ajustar los filtros para ver más resultados</p>
          </div>
        ) : (
          <div className={styles.professionalsGrid}>
            {filteredProfessionals.map((professional) => (
              <div key={professional.id} className={styles.professionalCard}>
                <div className={styles.professionalHeader}>
                  <img
                    src={professional.profile_image || "/default-avatar.png"}
                    alt={`${professional.first_name} ${professional.last_name}`}
                    className={styles.professionalAvatar}
                  />
                  <div className={styles.professionalInfo}>
                    <h3 className={styles.professionalName}>
                      {professional.first_name} {professional.last_name}
                    </h3>
                    {professional.speciality && (
                      <p className={styles.professionalSpeciality}>
                        <i className="fa-solid fa-helmet-safety"></i>
                        {professional.speciality}
                      </p>
                    )}
                    {professional.experience_years && (
                      <p className={styles.professionalExperience}>
                        <i className="fa-solid fa-briefcase"></i>
                        {professional.experience_years} años de experiencia
                      </p>
                    )}
                  </div>
                </div>

                {professional.address && (
                  <div className={styles.professionalLocation}>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{professional.address}</span>
                  </div>
                )}

                <div className={styles.professionalActions}>
                  <button
                    className={styles.viewProfileButton}
                    onClick={() => handleViewProfile(professional.id)}
                  >
                    <i className="fa-solid fa-user"></i>
                    Ver Perfil
                  </button>
                  
                  {professional.cv_url && (
                    <button
                      className={styles.cvButton}
                      onClick={() => handleDownloadCV(professional.cv_url!)}
                    >
                      <i className="fa-solid fa-download"></i>
                      Ver CV
                    </button>
                  )}
                </div>
                
                <div className={styles.professionalFooter}>
                  <span className={styles.joinDate}>
                    Miembro desde {new Date(professional.created_at).toLocaleDateString("es-MX", { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import styles from "@/app/dashboard/projects/projects.module.css";

interface Postulation {
  id: string;
  projectTitle: string;
  clientName: string;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  budget: number | null;
  description: string;
  location: string | null;
}

interface PostulationsClientProps {
  userId: string;
}

export default function PostulationsClient({ userId }: PostulationsClientProps) {
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [filteredPostulations, setFilteredPostulations] = useState<Postulation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos datos de postulaciones
    // En el futuro, aquí se harían consultas reales a la base de datos
    const mockPostulations: Postulation[] = [
      {
        id: "1",
        projectTitle: "Remodelación de Casa Familiar",
        clientName: "María González",
        status: "pending",
        appliedDate: "2025-01-02",
        budget: 2500000,
        description: "Remodelación completa de cocina y baño principal. Incluye cambio de pisos y pintura general.",
        location: "Las Condes, Santiago"
      },
      {
        id: "2",
        projectTitle: "Construcción de Terraza",
        clientName: "Carlos Rodríguez",
        status: "accepted",
        appliedDate: "2024-12-28",
        budget: 1800000,
        description: "Construcción de terraza techada con deck de madera. Incluye instalación eléctrica básica.",
        location: "Providencia, Santiago"
      },
      {
        id: "3",
        projectTitle: "Instalación Sistema Eléctrico",
        clientName: "Ana López",
        status: "rejected",
        appliedDate: "2024-12-20",
        budget: 850000,
        description: "Instalación completa de sistema eléctrico para casa nueva. Incluye tablero principal.",
        location: "Ñuñoa, Santiago"
      },
      {
        id: "4",
        projectTitle: "Diseño Arquitectónico",
        clientName: "Pedro Martínez",
        status: "pending",
        appliedDate: "2025-01-01",
        budget: null,
        description: "Diseño arquitectónico para ampliación de vivienda. Se requiere experiencia en diseño residencial.",
        location: "La Reina, Santiago"
      }
    ];

    setTimeout(() => {
      setPostulations(mockPostulations);
      setLoading(false);
    }, 1000);
  }, [userId]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredPostulations(postulations);
    } else {
      setFilteredPostulations(
        postulations.filter(postulation => postulation.status === statusFilter)
      );
    }
  }, [postulations, statusFilter]);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Presupuesto a convenir";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b"; // amarillo
      case "accepted":
        return "#10b981"; // verde
      case "rejected":
        return "#ef4444"; // rojo
      default:
        return "#64748b"; // gris
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "fa-clock";
      case "accepted":
        return "fa-check-circle";
      case "rejected":
        return "fa-times-circle";
      default:
        return "fa-question-circle";
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Cargando postulaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-paper-plane"></i>
          Mis Postulaciones
        </h1>
        <p className={styles.subtitle}>
          Gestiona y da seguimiento a todas tus postulaciones a proyectos
        </p>
      </div>

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Aceptadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Lista de postulaciones */}
      <div className={styles.postulationsList}>
        {filteredPostulations.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-inbox"></i>
            <h3>No hay postulaciones</h3>
            <p>
              {statusFilter === "all" 
                ? "Aún no has postulado a ningún proyecto" 
                : `No tienes postulaciones ${getStatusText(statusFilter).toLowerCase()}`
              }
            </p>
            {statusFilter === "all" && (
              <a href="/dashboard/projects/available" className={styles.ctaButton}>
                <i className="fa-solid fa-search"></i>
                Explorar Proyectos
              </a>
            )}
          </div>
        ) : (
          filteredPostulations.map((postulation) => (
            <div key={postulation.id} className={styles.postulationCard}>
              <div className={styles.postulationHeader}>
                <h3 className={styles.postulationTitle}>{postulation.projectTitle}</h3>
                <div 
                  className={styles.postulationStatus}
                  style={{ backgroundColor: getStatusColor(postulation.status) + "20", color: getStatusColor(postulation.status) }}
                >
                  <i className={`fa-solid ${getStatusIcon(postulation.status)}`}></i>
                  {getStatusText(postulation.status)}
                </div>
              </div>

              <div className={styles.postulationClient}>
                <i className="fa-solid fa-user"></i>
                <span>Cliente: {postulation.clientName}</span>
              </div>

              <p className={styles.postulationDescription}>
                {postulation.description}
              </p>

              <div className={styles.postulationDetails}>
                <div className={styles.postulationDetail}>
                  <i className="fa-solid fa-dollar-sign"></i>
                  <span>{formatCurrency(postulation.budget)}</span>
                </div>
                
                {postulation.location && (
                  <div className={styles.postulationDetail}>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{postulation.location}</span>
                  </div>
                )}
                
                <div className={styles.postulationDetail}>
                  <i className="fa-solid fa-calendar"></i>
                  <span>Postulado el {formatDate(postulation.appliedDate)}</span>
                </div>
              </div>

              {postulation.status === "accepted" && (
                <div className={styles.postulationActions}>
                  <button className={styles.contactClientButton}>
                    <i className="fa-solid fa-phone"></i>
                    Contactar Cliente
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

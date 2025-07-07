"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/dashboard/projects.module.css";
import { PostulationWithDetails } from "@/lib/postulations/model/postulation";
import { withdrawPostulationAction } from "@/lib/postulations/actions/postulationActions";

interface PostulationsClientProps {
  userId: string;
  initialPostulations: PostulationWithDetails[];
}

export default function PostulationsClient({ userId, initialPostulations }: PostulationsClientProps) {
  const [postulations, setPostulations] = useState<PostulationWithDetails[]>(initialPostulations);
  const [filteredPostulations, setFilteredPostulations] = useState<PostulationWithDetails[]>(initialPostulations);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPostulations(initialPostulations);
    setFilteredPostulations(initialPostulations);
  }, [initialPostulations]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredPostulations(postulations);
    } else {
      setFilteredPostulations(
        postulations.filter(postulation => postulation.status === statusFilter)
      );
    }
  }, [postulations, statusFilter]);

  const handleWithdrawPostulation = async (postulationId: string) => {
    if (!confirm("¿Estás seguro de que quieres retirar esta postulación?")) {
      return;
    }

    try {
      setLoading(true);
      await withdrawPostulationAction(postulationId);
      
      // Actualizar el estado local
      setPostulations(prev => 
        prev.map(p => 
          p.id === postulationId 
            ? { ...p, status: "withdrawn" as const }
            : p
        )
      );
    } catch (error: any) {
      alert(error.message || "Error al retirar la postulación");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = (phone: string, projectTitle: string) => {
    const message = `Hola! Me interesa el proyecto "${projectTitle}". Me gustaría conversar sobre los detalles.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Presupuesto a convenir";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      pending: "Pendiente",
      accepted: "Aceptada",
      rejected: "Rechazada",
      withdrawn: "Retirada"
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      pending: "#f59e0b", // amber
      accepted: "#10b981", // green
      rejected: "#ef4444", // red
      withdrawn: "#6b7280" // gray
    };
    return statusColors[status as keyof typeof statusColors] || "#6b7280";
  };

  if (postulations.length === 0 && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 max-w-5xl mx-auto p-5">
          <h1 className="text-2xl font-bold mb-6">Mis Postulaciones</h1>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fa-regular fa-file-text"></i>
            </div>
            <h3>No tienes postulaciones</h3>
            <p>Aún no has postulado a ningún proyecto. Explora los proyectos disponibles para comenzar.</p>
            <a href="/dashboard/projects/available" className={styles.ctaButton}>
              Ver Proyectos Disponibles
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-5xl mx-auto p-5">
        <div className={styles.pageHeader}>
          <h1 className="text-2xl font-bold">Mis Postulaciones</h1>
          <p className={styles.pageSubtitle}>
            Gestiona todas tus postulaciones a proyectos
          </p>
        </div>

        {/* Filtros */}
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <label htmlFor="status-filter" className={styles.filterLabel}>
              Filtrar por estado:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="accepted">Aceptadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="withdrawn">Retiradas</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fa-solid fa-clock" style={{ color: "#f59e0b" }}></i>
            </div>
            <div className={styles.statContent}>
              <h3>{postulations.filter(p => p.status === "pending").length}</h3>
              <p>Pendientes</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fa-solid fa-check-circle" style={{ color: "#10b981" }}></i>
            </div>
            <div className={styles.statContent}>
              <h3>{postulations.filter(p => p.status === "accepted").length}</h3>
              <p>Aceptadas</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fa-solid fa-times-circle" style={{ color: "#ef4444" }}></i>
            </div>
            <div className={styles.statContent}>
              <h3>{postulations.filter(p => p.status === "rejected").length}</h3>
              <p>Rechazadas</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className="fa-solid fa-file-text" style={{ color: "#6366f1" }}></i>
            </div>
            <div className={styles.statContent}>
              <h3>{postulations.length}</h3>
              <p>Total</p>
            </div>
          </div>
        </div>

        {/* Lista de postulaciones */}
        {filteredPostulations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <i className="fa-regular fa-file-text"></i>
            </div>
            <h3>No hay postulaciones con este filtro</h3>
            <p>Intenta cambiar el filtro para ver más resultados.</p>
          </div>
        ) : (
          <div className={styles.postulationsList}>
            {filteredPostulations.map((postulation) => (
              <div key={postulation.id} className={styles.postulationCard}>
                <div className={styles.postulationHeader}>
                  <h3 className={styles.projectTitle}>{postulation.project.title}</h3>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(postulation.status) }}
                  >
                    {getStatusLabel(postulation.status)}
                  </span>
                </div>

                <div className={styles.postulationContent}>
                  <div className={styles.projectDetails}>
                    <p className={styles.projectDescription}>
                      {postulation.project.description}
                    </p>
                    
                    <div className={styles.projectMeta}>
                      <div className={styles.metaItem}>
                        <i className="fa-solid fa-user"></i>
                        <span>Cliente: {postulation.client.first_name} {postulation.client.last_name}</span>
                      </div>
                      
                      {postulation.project.location && (
                        <div className={styles.metaItem}>
                          <i className="fa-solid fa-map-marker-alt"></i>
                          <span>{postulation.project.location}</span>
                        </div>
                      )}
                      
                      <div className={styles.metaItem}>
                        <i className="fa-solid fa-dollar-sign"></i>
                        <span>{formatCurrency(postulation.project.budget)}</span>
                      </div>
                      
                      <div className={styles.metaItem}>
                        <i className="fa-solid fa-calendar"></i>
                        <span>Postulado: {formatDate(postulation.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.postulationActions}>
                  {postulation.status === "accepted" && postulation.client.phone && (
                    <a
                      href={getWhatsAppLink(postulation.client.phone, postulation.project.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappButton}
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                      Contactar Cliente
                    </a>
                  )}
                  
                  {postulation.status === "pending" && (
                    <button
                      onClick={() => handleWithdrawPostulation(postulation.id)}
                      className={styles.withdrawButton}
                      disabled={loading}
                    >
                      <i className="fa-solid fa-times"></i>
                      Retirar Postulación
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

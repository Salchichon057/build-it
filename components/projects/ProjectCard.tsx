"use client";
import { useState } from "react";
import styles from "@/styles/dashboard/ProjectCard.module.css"; // Movido a styles/dashboard/
import { Project } from "@/lib/projects/model/project";
import { deleteProjectAction } from "@/lib/projects/actions/projectActions";

interface ProjectCardProps {
  project: Project;
  onDeleted?: () => void;
  onEdit?: (project: Project) => void;
}

export default function ProjectCard({ project, onDeleted, onEdit }: ProjectCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Presupuesto a convenir";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDelete = async () => {
    setPending(true);
    await deleteProjectAction(project.id);
    setPending(false);
    setShowConfirm(false);
    onDeleted?.();
  };

  return (
    <div className={styles.projectCard}>
      {/* Imagen del proyecto */}
      {project.image_url && (
        <div className={styles.cardImage}>
          <img 
            src={project.image_url} 
            alt={project.title}
            className={styles.projectImage}
          />
        </div>
      )}
      
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <i className="fa-solid fa-diagram-project"></i>
        </div>
        <div className={styles.cardTitleBlock}>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <span className={`${styles.cardStatus} ${styles[project.status]}`}>
            <i className="fa-solid fa-circle"></i>{" "}
            {project.status === "open"
              ? "Abierto"
              : project.status === "in_progress"
                ? "En progreso"
                : project.status === "completed"
                  ? "Completado"
                  : "Cancelado"}
          </span>
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.editBtn}
            onClick={() => onEdit?.(project)}
            title="Editar"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => setShowConfirm(true)}
            title="Eliminar"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <p className={styles.cardDescription}>{project.description}</p>
      <div className={styles.cardMeta}>
        {project.budget && (
          <span>
            <i className="fa-solid fa-money-bill-wave"></i> {formatCurrency(project.budget)}
          </span>
        )}
        {project.location && (
          <span>
            <i className="fa-solid fa-location-dot"></i> {project.location}
          </span>
        )}
        {project.start_date && (
          <span>
            <i className="fa-solid fa-calendar-day"></i> {project.start_date}
          </span>
        )}
        {project.end_date && (
          <span>
            <i className="fa-solid fa-calendar-check"></i> {project.end_date}
          </span>
        )}
      </div>
      {/* Modal de confirmación */}
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <p>¿Seguro que deseas eliminar este proyecto?</p>
            <div className={styles.confirmActions}>
              <button onClick={() => setShowConfirm(false)} disabled={pending}>
                Cancelar
              </button>
              <button
                className={styles.danger}
                onClick={handleDelete}
                disabled={pending}
              >
                {pending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

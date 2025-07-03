"use client";
import { useState } from "react";
import ProjectList from "./ProjectList";
import ProjectFormModal from "./ProjectFormModal";
import styles from "./projects.module.css";
import { createProjectAction } from "./actions";
import { Project } from "@/lib/projects/model/project";

interface ProjectsPageClientProps {
  projects: Project[];
}

export default function ProjectsPageClient({
  projects,
}: ProjectsPageClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Mis Proyectos</h1>
        <button className={styles.addButton} onClick={() => setOpen(true)}>
          <i className="fa-solid fa-plus"></i> Agregar Proyecto
        </button>
      </div>
      <ProjectList projects={projects} />
      <ProjectFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (formData) => {
          await createProjectAction(formData);
          setOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

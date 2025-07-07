"use client";
import { useState } from "react";
import ProjectList from "@/components/projects/ProjectList";
import ProjectFormModal from "@/components/projects/ProjectFormModal";
import styles from "@/styles/dashboard/projects.module.css";
import { createProjectAction, saveProjectAction } from "@/lib/projects/actions/projectActions";
import { Project } from "@/lib/projects/model/project";

interface ProjectsPageClientProps {
  projects: Project[];
}

export default function ProjectsPageClient({
  projects,
}: ProjectsPageClientProps) {
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(undefined);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Mis Proyectos</h1>
        <button className={styles.addButton} onClick={() => setOpen(true)}>
          <i className="fa-solid fa-plus"></i> Agregar Proyecto
        </button>
      </div>
      <ProjectList projects={projects} onEdit={handleEdit} />
      <ProjectFormModal
        open={open}
        onClose={handleClose}
        project={editingProject}
        onSubmit={async (formData) => {
          await saveProjectAction(formData);
          handleClose();
          window.location.reload();
        }}
      />
    </div>
  );
}

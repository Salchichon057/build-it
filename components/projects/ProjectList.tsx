"use client";
import { Project } from "@/lib/projects/model/project";
import ProjectCard from "./ProjectCard";
import styles from "@/styles/dashboard/projects.module.css"; // CSS principal
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();

  if (!projects.length) {
    return <div className={styles.empty}>No tienes proyectos aún.</div>;
  }

  return (
    <div className={styles.projectList}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDeleted={() => router.refresh()}
        />
      ))}
    </div>
  );
}

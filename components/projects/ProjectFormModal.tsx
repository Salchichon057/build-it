"use client";
import Modal from "@/components/modal/Modal";
import ProjectForm from "@/components/projects/ProjectForm";
import { Project } from "@/lib/projects/model/project";

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  project?: Project; // Proyecto para editar (opcional)
}

export default function ProjectFormModal({
  open,
  onClose,
  onSubmit,
  project,
}: ProjectFormModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ProjectForm onSubmit={onSubmit} onClose={onClose} project={project} />
    </Modal>
  );
}

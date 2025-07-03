"use client";
import Modal from "@/components/modal/Modal";
import ProjectForm from "@/components/projects/ProjectForm";

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProjectFormModal({
  open,
  onClose,
  onSubmit,
}: ProjectFormModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ProjectForm onSubmit={onSubmit} onClose={onClose} />
    </Modal>
  );
}

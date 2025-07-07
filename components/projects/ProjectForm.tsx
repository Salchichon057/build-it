"use client";
import { useState, useEffect } from "react";
import { projectSchema } from "@/lib/validators/projectSchema";
import { z } from "zod";
import styles from "@/styles/dashboard/projects.module.css";
import { InputGroup } from "../InputGroup";
import { getCategoriesAction } from "@/lib/categories/actions/categoryActions";
import { Project } from "@/lib/projects/model/project";

interface ProjectFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
  project?: Project; // Proyecto para editar (opcional)
}

type FormState = {
  title: string;
  description: string;
  budget: string;
  location: string;
  start_date: string;
  end_date: string;
  category_id: string;
  image: File | null;
};

export default function ProjectForm({ onSubmit, onClose, project }: ProjectFormProps) {
  const [form, setForm] = useState<FormState>({
    title: project?.title || "",
    description: project?.description || "",
    budget: project?.budget ? project.budget.toString() : "",
    location: project?.location || "",
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    category_id: project?.category_id || "",
    image: null,
  });
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategoriesAction();
        const categoryOptions = [
          { value: "", label: "Selecciona una categoría..." },
          ...categoriesData.map(cat => ({ value: cat.id, label: cat.name }))
        ];
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Validación en tiempo real de fechas
  const validateDateField = (name: string, value: string) => {
    const today = getTodayString();
    let error = "";

    if (name === "start_date" && value) {
      if (value < today) {
        error = "La fecha de inicio no puede ser anterior a hoy";
      }
    }

    if (name === "end_date" && value) {
      if (value < today) {
        error = "La fecha de fin no puede ser anterior a hoy";
      } else if (form.start_date && value < form.start_date) {
        error = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    // Si cambió start_date, revalidar end_date también
    if (name === "start_date" && form.end_date) {
      if (form.end_date < value) {
        setFieldErrors((prev) => ({
          ...prev,
          end_date: "La fecha de fin debe ser posterior a la fecha de inicio",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          end_date: undefined,
        }));
      }
    }

    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Validación especial para campos de fecha
    if (name === "start_date" || name === "end_date") {
      const dateError = validateDateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: dateError || undefined }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0] || null;
      
      // Validar tamaño del archivo
      if (file) {
        const maxSizeInMB = 8; // Límite un poco menor que el servidor (10MB)
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        
        if (file.size > maxSizeInBytes) {
          setFieldErrors((prev) => ({ 
            ...prev, 
            image: `La imagen es demasiado grande. Máximo ${maxSizeInMB}MB permitidos. Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
          }));
          return;
        }
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          setFieldErrors((prev) => ({ 
            ...prev, 
            image: 'Solo se permiten archivos de imagen (jpg, png, gif, etc.)' 
          }));
          return;
        }
      }
      
      setForm((prev) => ({ ...prev, image: file }));
      setFieldErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    // Prepara el payload para validar
    const payload = {
      ...form,
      budget: form.budget ? Number(form.budget) : undefined,
      users_id: "dummy", // El validador espera este campo, pero el server lo pone real
      status: "open" as const,
    };

    // Valida con Zod
    const result = projectSchema.safeParse(payload);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};

      Object.entries(errors).forEach(([key, value]) => {
        if (value && value.length > 0) {
          formattedErrors[key] = value[0]; // Toma el primer error
        }
      });

      setFieldErrors(formattedErrors);
      setPending(false);
      return;
    }

    // Envía el formData real
    const formData = new FormData();
    
    // Si es edición, agregar el project_id
    if (project) {
      formData.append('project_id', project.id);
    }
    
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        // Agregar archivo de imagen
        formData.append(key, value);
      } else if (key !== 'image') {
        // Agregar otros campos como string (excluir image si es null)
        formData.append(key, value as string);
      }
    });

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear el proyecto");
    } finally {
      setPending(false);
    }
  };

  const todayString = getTodayString();

  return (
    <form className={styles.projectForm} onSubmit={handleSubmit} noValidate>
      <h2>{project ? "Editar Proyecto" : "Nuevo Proyecto"}</h2>

      <InputGroup
        label="Título"
        id="title"
        name="title"
        type="text"
        value={form.title}
        onChange={handleChange}
        required
        error={fieldErrors.title}
      />

      <InputGroup
        label="Descripción"
        id="description"
        name="description"
        type="textarea"
        value={form.description}
        onChange={handleChange}
        required
        error={fieldErrors.description}
        rows={4}
      />

      <InputGroup
        label="Presupuesto (MXN)"
        id="budget"
        name="budget"
        type="number"
        value={form.budget}
        onChange={handleChange}
        error={fieldErrors.budget}
        min={0}
        step={0.01}
        placeholder="Ej: 50000.00"
      />

      <InputGroup
        label="Ubicación"
        id="location"
        name="location"
        type="text"
        value={form.location}
        onChange={handleChange}
        error={fieldErrors.location}
      />

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <i className="fa-solid fa-image"></i>
          Imagen del proyecto
        </label>
        <InputGroup
          label=""
          id="image"
          name="image"
          type="file"
          value={form.image}
          onChange={handleImageChange}
          accept="image/*"
          error={fieldErrors.image}
        />
        {form.image && (
          <div className={styles.imagePreview}>
            <img 
              src={URL.createObjectURL(form.image)} 
              alt="Preview del proyecto"
              className={styles.previewImage}
            />
          </div>
        )}
      </div>

      <InputGroup
        label="Categoría del proyecto"
        id="category_id"
        name="category_id"
        type="select"
        value={form.category_id}
        onChange={handleChange}
        required
        error={fieldErrors.category_id}
        options={categories}
      />

      <InputGroup
        label="Fecha de inicio"
        id="start_date"
        name="start_date"
        type="date"
        value={form.start_date}
        onChange={handleChange}
        required
        error={fieldErrors.start_date}
        min={todayString} // No permite seleccionar fechas anteriores a hoy
      />

      <InputGroup
        label="Fecha de fin"
        id="end_date"
        name="end_date"
        type="date"
        value={form.end_date}
        onChange={handleChange}
        error={fieldErrors.end_date}
        min={form.start_date || todayString} // No permite fechas anteriores a inicio o hoy
      />

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formActions}>
        <button type="button" onClick={onClose} disabled={pending}>
          Cancelar
        </button>
        <button type="submit" disabled={pending}>
          {pending 
            ? (project ? "Editando..." : "Creando...") 
            : (project ? "Editar" : "Crear")
          }
        </button>
      </div>
    </form>
  );
}

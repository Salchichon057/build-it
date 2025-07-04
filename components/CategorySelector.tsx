"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/auth/login.module.css"; // Reutilizamos los estilos de auth

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categoryIds: string[]) => void;
  maxCategories?: number;
  className?: string;
  disabled?: boolean;
}

export default function CategorySelector({
  selectedCategories,
  onCategoriesChange,
  maxCategories = 5,
  className = "",
  disabled = false
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar categorías disponibles
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Importar la acción para obtener categorías reales
        const { getCategoriesAction } = await import("@/lib/categories/actions/categoryActions");
        const realCategories = await getCategoriesAction();
        
        if (realCategories.length > 0) {
          setCategories(realCategories);
        } else {
          // Fallback a categorías mock si no hay datos
          const mockCategories: Category[] = [
            { id: "1", name: "Arquitectura" },
            { id: "2", name: "Construcción" },
            { id: "3", name: "Ingeniería Civil" },
            { id: "4", name: "Diseño Interior" },
            { id: "5", name: "Electricidad" },
            { id: "6", name: "Plomería" },
            { id: "7", name: "Jardinería" },
            { id: "8", name: "Pintura" },
            { id: "9", name: "Carpintería" },
            { id: "10", name: "Albañilería" },
            { id: "11", name: "Techado" },
            { id: "12", name: "Pisos" },
            { id: "13", name: "Ventanas y Puertas" },
            { id: "14", name: "Climatización" },
            { id: "15", name: "Seguridad" }
          ];
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        // Usar categorías mock en caso de error
        const mockCategories: Category[] = [
          { id: "1", name: "Arquitectura" },
          { id: "2", name: "Construcción" },
          { id: "3", name: "Ingeniería Civil" },
          { id: "4", name: "Diseño Interior" },
          { id: "5", name: "Electricidad" },
          { id: "6", name: "Plomería" },
          { id: "7", name: "Jardinería" },
          { id: "8", name: "Pintura" },
          { id: "9", name: "Carpintería" },
          { id: "10", name: "Albañilería" },
          { id: "11", name: "Techado" },
          { id: "12", name: "Pisos" },
          { id: "13", name: "Ventanas y Puertas" },
          { id: "14", name: "Climatización" },
          { id: "15", name: "Seguridad" }
        ];
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCategories.includes(category.id)
  );

  const getSelectedCategoryNames = () => {
    return categories
      .filter(category => selectedCategories.includes(category.id))
      .map(category => category.name);
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // Remover categoría
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      // Agregar categoría (si no se excede el máximo)
      if (selectedCategories.length < maxCategories) {
        onCategoriesChange([...selectedCategories, categoryId]);
      }
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
  };

  if (loading) {
    return (
      <div className={`${styles.inputGroup} ${className}`}>
        <div className={styles.input}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          Cargando categorías...
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {/* Categorías seleccionadas */}
      <div className={styles.selectedItems}>
        {getSelectedCategoryNames().map((categoryName, index) => {
          const categoryId = categories.find(c => c.name === categoryName)?.id;
          return (
            <span key={categoryId} className={styles.selectedItem}>
              {categoryName}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => categoryId && handleRemoveCategory(categoryId)}
                  className={styles.removeButton}
                  aria-label={`Quitar ${categoryName}`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </span>
          );
        })}
        
        {selectedCategories.length === 0 && (
          <span className={styles.placeholder}>
            No hay categorías seleccionadas
          </span>
        )}
      </div>

      {/* Selector desplegable */}
      {!disabled && (
        <div className={styles.selectorContainer}>
          <button
            type="button"
            className={styles.selectorButton}
            onClick={() => setIsOpen(!isOpen)}
            disabled={selectedCategories.length >= maxCategories}
          >
            <i className="fa-solid fa-tag"></i>
            {selectedCategories.length >= maxCategories 
              ? `Máximo ${maxCategories} categorías` 
              : "Agregar categoría"
            }
            <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
          </button>

          {isOpen && (
            <div className={styles.dropdown}>
              <div className={styles.searchContainer}>
                <i className="fa-solid fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.itemsList}>
                {filteredCategories.length === 0 ? (
                  <div className={styles.noResults}>
                    {searchTerm ? "No se encontraron categorías" : "Todas las categorías están seleccionadas"}
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={styles.item}
                      onClick={() => {
                        handleCategoryToggle(category.id);
                        setSearchTerm("");
                        if (selectedCategories.length + 1 >= maxCategories) {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <i className="fa-solid fa-tag"></i>
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contador */}
      <div className={styles.counter}>
        {selectedCategories.length} / {maxCategories} categorías
      </div>
    </div>
  );
}

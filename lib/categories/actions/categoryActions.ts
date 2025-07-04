"use server";

import { categoryService, Category } from "../service/categoryService";

/**
 * Obtiene todas las categorías disponibles
 */
export async function getCategoriesAction(): Promise<Category[]> {
  try {
    return await categoryService.getAll();
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

/**
 * Crea una nueva categoría
 */
export async function createCategoryAction(name: string): Promise<Category | null> {
  try {
    return await categoryService.create(name);
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

/**
 * Obtiene las categorías de un proyecto específico
 */
export async function getProjectCategoriesAction(projectId: string): Promise<Category[]> {
  try {
    return await categoryService.getByProjectId(projectId);
  } catch (error) {
    console.error("Error getting project categories:", error);
    return [];
  }
}

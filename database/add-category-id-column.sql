-- =========================
-- AGREGAR COLUMNA CATEGORY_ID A PROJECTS
-- =========================

-- Agregar columna category_id a la tabla projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES category(id);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);

-- Verificar la estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND table_schema = 'public'
ORDER BY ordinal_position;

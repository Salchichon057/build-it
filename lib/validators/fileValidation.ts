export const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export const validateFile = (
    file: File | null,
    field: "cv_file" | "profile_image"
): string | null => {
    if (!file) return null;
    if (field === "cv_file") {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type))
            return "Solo se permiten archivos PDF o DOCX para el CV.";
        if (file.size > MAX_CV_SIZE)
            return `El tamaño del archivo de CV excede el límite máximo de ${MAX_CV_SIZE / (1024 * 1024)}MB.`;
    } else if (field === "profile_image") {
        const allowedTypes = ["image/png", "image/jpeg"];
        if (!allowedTypes.includes(file.type))
            return "Solo se permiten archivos PNG o JPEG para la imagen de perfil.";
        if (file.size > MAX_PROFILE_IMAGE_SIZE)
            return `El tamaño de la imagen de perfil excede el límite máximo de ${MAX_PROFILE_IMAGE_SIZE / (1024 * 1024)}MB.`;
    }
    return null;
};
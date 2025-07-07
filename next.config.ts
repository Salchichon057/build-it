import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Aumentado para permitir imágenes más grandes
    },
  },
};

export default nextConfig;
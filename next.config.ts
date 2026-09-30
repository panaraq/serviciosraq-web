import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // El editor guarda las portadas de Instagram como imágenes dentro del contenido.
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;

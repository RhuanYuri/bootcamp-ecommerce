import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Alterado para aceitar qualquer hostname
      },
      {
        protocol: "http", // Opcional: Adicione se precisar de fontes http
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
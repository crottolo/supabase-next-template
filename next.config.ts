import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurazione per build standalone (necessaria per Docker)
  output: 'standalone',
  
  // Comprimi le immagini automaticamente
  images: {
    unoptimized: false,
  },
  
  // Configura i headers di sicurezza
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Transpila i moduli ESM se necessario
  transpilePackages: [],
  
  // Configurazione per le variabili d'ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;

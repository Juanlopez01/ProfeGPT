// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Si necesitás usar rewrites (por ejemplo, para redirigir a una API externa en desarrollo)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Cambiá si usás otro backend o proxy
      },
    ];
  },

  // Activá experimental si lo necesitás (opcional)
  experimental: {
    // otras flags válidas si hiciste opt-in a alguna beta
  },
};

export default nextConfig;

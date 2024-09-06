/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose', 'pino'], // <-- needed external packages for server components
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v2.exercisedb.io',
        port: '',
      },
    ],
  },
  webpack: (config) => {
    config.experiments = {
      // <-- needed for mongoose
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;

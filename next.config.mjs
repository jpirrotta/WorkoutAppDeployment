/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose', 'pino', 'pino-pretty'], // <-- needed external packages for server components
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v2.exercisedb.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
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

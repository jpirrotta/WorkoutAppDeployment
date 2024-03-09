/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // ? might not be needed
  experimental: {
    esmExternals: 'loose', // <-- needed for mongoose
    serverComponentsExternalPackages: ['mongoose', 'pino'], // <-- needed external packages for server components
  },
  webpack(config) {
    config.experiments = {
      // <-- needed for mongoose
      topLevelAwait: true,
      layers: true,
    };

    // needed for loading SVGs as React components
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    //============================

    return config;
  },
};

export default nextConfig;

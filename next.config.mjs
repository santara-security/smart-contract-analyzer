/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false,
  },
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["react-markdown"],
  },
};

export default nextConfig;

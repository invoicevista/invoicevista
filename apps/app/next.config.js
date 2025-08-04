/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  // Skip type checking and linting during build if env vars are missing
  typescript: {
    ignoreBuildErrors: process.env.SKIP_BUILD_ERRORS === 'true',
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_BUILD_ERRORS === 'true',
  },
};

export default nextConfig;
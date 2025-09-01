import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/lookbook/:path*',
        destination: '/lookbook/:path*',
      },
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
      },
      {
        source: '/moodboard/:path*',
        destination: '/moodboard/:path*',
      },
    ];
  },
};

export default nextConfig;
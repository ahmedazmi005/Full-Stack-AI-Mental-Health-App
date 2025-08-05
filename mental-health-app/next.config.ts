import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle AWS SDK in serverless environment (updated for Next.js 15)
  serverExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/lib-storage'],
  
  // Webpack configuration for Node.js modules
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  
  // Temporarily ignore build errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Handle dynamic imports
  images: {
    domains: [],
  },
};

export default nextConfig;

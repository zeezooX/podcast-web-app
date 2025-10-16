import type { NextConfig } from "next";

// Parse the API URL from environment variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const url = new URL(apiUrl.replace('/api', '')); // Remove /api suffix to get base URL

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: '/api/files/**',
      },
    ],
  },
};

export default nextConfig;

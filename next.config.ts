import type { NextConfig } from "next";

const nextConfig: {
  devIndicators: { errorIndicator: boolean; buildActivityPosition: string };
  rewrites(): Promise<[{ destination: string; source: string }]>;
  eslint: { ignoreDuringBuilds: boolean };
} = {
  devIndicators: {
    buildActivityPosition: 'top-right',
    errorIndicator: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default nextConfig;

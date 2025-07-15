import type { NextConfig } from "next";

const nextConfig: {
  devIndicators: { errorIndicator: boolean; buildActivityPosition: string };
  rewrites(): Promise<[{ destination: string; source: string }]>;
  compress: boolean;
  poweredByHeader: boolean;
  generateEtags: boolean;
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
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;

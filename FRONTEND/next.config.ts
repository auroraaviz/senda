import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "htpp://localhost:8080"}/:path*`,
      },
    ];
  },
};

export default nextConfig;

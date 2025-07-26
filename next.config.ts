import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mudocsstorage.blob.core.windows.net",
        pathname: "/file-covers/**",
      },
    ],
  },
  devIndicators: { position: "bottom-right" },
  async rewrites() {
    return [
      {
        source: "/remote/:path*",
        destination: "https://mudocsstorage.blob.core.windows.net/:path*",
      },
    ];
  },
};

export default nextConfig;

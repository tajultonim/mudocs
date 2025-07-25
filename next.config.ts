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
};

export default nextConfig;

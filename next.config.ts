import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images:{
    domains:["picsum.photos"]
  }
};


export default nextConfig;

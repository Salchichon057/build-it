import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // '5mb', '10mb'
    },
  },
};

export default nextConfig;
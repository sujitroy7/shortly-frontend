import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@shortly/ui", "@shortly/lib"],
};

export default nextConfig;

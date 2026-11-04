import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: process.env.REACT_COMPILER === "1",
};

export default nextConfig;

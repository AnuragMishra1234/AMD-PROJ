/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Prevents Next.js from bundling these native / heavy modules on the server.
    // They are required as-is at runtime (Node.js native addons / C++ bindings).
    serverComponentsExternalPackages: ["pdf-parse", "chromadb"],
  },
};

export default nextConfig;

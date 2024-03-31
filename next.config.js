/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@azure/storage-blob"],
  },
};

module.exports = nextConfig;

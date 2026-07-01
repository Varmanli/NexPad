/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker/Coolify deployments — bundles only the
  // production dependencies actually needed into .next/standalone.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "s3.ir-thr-at1.arvanstorage.ir",
      },
    ],
  },
};

export default nextConfig;

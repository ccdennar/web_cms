
/** @type {import('next').NextConfig} */

const nextConfig = {
  // ==========================================
  // DOCKER PRODUCTION CONFIGURATION
  // ==========================================

  // Generate a standalone Node.js server
  // for a smaller production Docker image.
  output: "standalone",

  // ==========================================
  // NEXT.JS CONFIGURATION
  // ==========================================

  reactStrictMode: true,

  // ==========================================
  // IMAGE CONFIGURATION
  // ==========================================

  images: {
    remotePatterns: [
      // Payload CMS accessed from the browser
      // or when running Next.js locally.
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },

      // Payload CMS accessed through the
      // shared Docker network.
      // This hostname will work once both
      // services share a Docker network.
      {
        protocol: "http",
        hostname: "payload",
        port: "3000",
        pathname: "/**",
      },

      // Production example:
      // {
      //   protocol: "https",
      //   hostname: "api.yourbakery.com",
      //   pathname: "/**",
      // },
    ],
  },

  // ==========================================
  // BUILD CONFIGURATION
  // ==========================================

  poweredByHeader: false,
};

module.exports = nextConfig;


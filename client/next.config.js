/** @type {import('next').NextConfig} */
const nextConfig = {
  // Overridable so a verification build can run alongside `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // The former "Hobbies" section is now "Community".
      { source: "/hobbies", destination: "/community", permanent: true },
      { source: "/hobbies/:slug", destination: "/community/:slug", permanent: true },
    ];
  },
};

module.exports = nextConfig;

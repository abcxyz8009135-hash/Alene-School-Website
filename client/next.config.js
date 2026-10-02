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
      // Admin routes renamed in the dashboard restructure (temporary so they
      // can still change).
      { source: "/admin/program-content", destination: "/admin/programs", permanent: false },
      { source: "/admin/content", destination: "/admin/content/homepage", permanent: false },
      { source: "/admin/site-content", destination: "/admin/content/homepage", permanent: false },
      { source: "/admin/exam-results", destination: "/admin/results", permanent: false },
      { source: "/admin/exam-results/:path*", destination: "/admin/results/:path*", permanent: false },
    ];
  },
};

module.exports = nextConfig;

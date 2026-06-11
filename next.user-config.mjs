/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Security Headers for all pages ─────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to ALL routes
        source: "/:path*",
        headers: [
          // Prevent clickjacking — only allow iframe embedding from same origin
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // No MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak referrer to YouTube or 3rd parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Disable sensitive browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
        ],
      },
      {
        // Extra cache-control for the LMS watch pages — prevent CDN/browser caching of video pages
        source: "/lms/watch/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ]
  },

  // ─── Image domain allowlist ──────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.vercel-storage.com" },
    ],
  },
}

export default nextConfig

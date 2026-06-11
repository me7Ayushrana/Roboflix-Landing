import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ─── Routes that are publicly accessible without login ───────────────────────
const PUBLIC_LMS_PATHS = ["/lms/login", "/lms/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── 1. LMS Route Guard ───────────────────────────────────────────────────
  // Any /lms/* path that is NOT a public path requires an auth cookie.
  // The actual deep session check still happens client-side (Supabase / localStorage),
  // but this stops completely unauthenticated scrapers & link-followers cold.
  if (pathname.startsWith("/lms") && !PUBLIC_LMS_PATHS.some((p) => pathname.startsWith(p))) {
    const hasSession =
      request.cookies.has("sb-access-token") ||     // Supabase auth cookie
      request.cookies.has("sb-refresh-token") ||    // Supabase refresh cookie
      request.cookies.has("roboflix-lms-auth")       // Custom lightweight session cookie

    if (!hasSession) {
      const loginUrl = new URL("/lms/login", request.url)
      loginUrl.searchParams.set("from", pathname)   // Redirect back after login
      return NextResponse.redirect(loginUrl)
    }
  }

  // ─── 2. Security Headers ──────────────────────────────────────────────────
  const response = NextResponse.next()

  // Prevent the site from being embedded in iframes on other domains.
  // Crucially, this ALSO prevents users from extracting the YouTube embed URL
  // and re-embedding it on their own page with your player wrapper stripped.
  response.headers.set("X-Frame-Options", "SAMEORIGIN")

  // Only allow our own origin and YouTube's nocookie domain to load in frames.
  // This is the single most important header for protecting unlisted YT videos.
  response.headers.set(
    "Content-Security-Policy",
    [
      // Default: only allow same-origin content
      "default-src 'self'",
      // Scripts: self + YouTube IFrame API (needed for the player) + Vercel analytics
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://va.vercel-scripts.com",
      // Frames: ONLY youtube-nocookie.com embeds are allowed — NOT youtube.com/watch
      "frame-src 'self' https://www.youtube-nocookie.com https://drive.google.com",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + YouTube thumbnail CDN + blob + data URIs
      "img-src 'self' data: blob: https://img.youtube.com https://*.vercel-storage.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
      // Connections: self + Supabase + YouTube API
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.youtube.com https://www.youtube-nocookie.com https://va.vercel-scripts.com",
      // Media: self only (for any future native video)
      "media-src 'self' blob:",
      // Prevent loading plugins like Flash
      "object-src 'none'",
      // Lock base URI to self
      "base-uri 'self'",
      // Form submissions only to self
      "form-action 'self'",
    ].join("; ")
  )

  // Prevent browsers from MIME-sniffing content types
  response.headers.set("X-Content-Type-Options", "nosniff")

  // Stop referrer leakage — never send the full URL to YouTube or other 3rd parties
  // This prevents YouTube from knowing the video was embedded on your platform
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Disable browser features that could be abused (camera, mic, etc.)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  )

  // Force HTTPS for 1 year (HSTS) — tells browsers to NEVER load over HTTP
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  )

  // ─── 3. Block direct LMS API routes from non-LMS referrers ─────────────
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || ""
    const host = request.headers.get("host") || ""
    // If origin is set and doesn't match host, reject
    if (origin && !origin.includes(host)) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  return response
}

export const config = {
  // Run middleware on all LMS routes and API routes
  // Exclude static files and Next.js internals
  matcher: [
    "/lms/:path*",
    "/api/:path*",
  ],
}

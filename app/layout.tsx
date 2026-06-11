import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { FloatingCtaButton } from "@/components/floating-cta-button"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "ROBOFLIX - Learn Robotics Netflix Style | 5 Seasons of Hands-On Projects",
  description:
    "Master robotics with 5 binge-worthy seasons. Learn Arduino, ROS, autonomous rovers, robotic arms, and hexapod walkers. ₹989 entry pass. Build real robots.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Android and Mobile browser optimizations */}
        <meta name="theme-color" content="#070707" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Right-Click and DevTools Inspect Protection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
              });
              document.addEventListener('keydown', function(e) {
                const key = e.key.toLowerCase();
                
                // 1. Block F12
                if (e.key === 'F12') {
                  e.preventDefault();
                  return;
                }

                // 2. Block Ctrl+Shift+I/J/C/U (Windows/Linux Inspect)
                if (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'u')) {
                  e.preventDefault();
                  return;
                }

                // 3. Block Cmd+Option+I/J/C/U (Mac Inspect)
                if (e.metaKey && e.altKey && (key === 'i' || key === 'j' || key === 'c' || key === 'u')) {
                  e.preventDefault();
                  return;
                }

                // 4. Block Cmd+Shift+I (Mac native "Email Link" shortcut which opens Mail client)
                if (e.metaKey && e.shiftKey && key === 'i') {
                  e.preventDefault();
                  window.location.href = "mailto:ayushamit007@gmail.com?subject=Roboflix%20Support";
                  return;
                }

                // 5. Block Cmd+S / Ctrl+S (Save Page Source)
                if ((e.ctrlKey || e.metaKey) && key === 's') {
                  e.preventDefault();
                  return;
                }

                // 6. Block Cmd+U / Ctrl+U (View Page Source)
                if ((e.ctrlKey || e.metaKey) && key === 'u') {
                  e.preventDefault();
                  return;
                }
              });
            `
          }}
        />
      </head>
      <body className={`${manrope.variable} font-sans antialiased bg-black text-white`}>
        <LenisProvider>{children}</LenisProvider>
        <FloatingCtaButton />
        <Analytics />
      </body>
    </html>
  )
}

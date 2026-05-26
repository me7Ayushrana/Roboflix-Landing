"use client"

import Link from "next/link"
import { Zap, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Netflix-style Thumbnail */}
        <div className="mb-12 group cursor-pointer">
          <div className="relative rounded-xl overflow-hidden border-2 border-red-600/40 shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300">
            <img
              src="/hero-thumbnail.png"
              alt="ROBOFLIX: Your Robotics Journey"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-600/60 mb-8">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-red-400">Season 1 Launching June 15 - Founding Batch Open Now</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
            Master Robotics.
            <span className="block text-red-600">Build Your Future.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-2 leading-relaxed text-balance font-semibold">
            Learn to build 3 working robots in just 5 months. No expensive setup needed. Just you, simple materials, and step-by-step lessons that actually make sense.
          </p>

          <p className="text-sm sm:text-base text-red-500/80 max-w-3xl mx-auto mb-4 leading-relaxed text-balance">
            Robotics skills make you stand out everywhere — in college projects, job interviews, and competitions. The best time to start? Right now.
          </p>

          {/* Pricing Highlight */}
          <div className="mb-12 inline-flex items-center justify-center gap-3 px-6 py-3 bg-black/80 border border-red-600/40 rounded-full text-sm sm:text-base">
            <span className="text-white font-semibold">Just ₹989</span>
            <span className="text-gray-500 line-through decoration-red-500 decoration-2">₹2,999</span>
            <span className="text-red-500 font-bold">Limited time</span>
            <span className="text-gray-500">·</span>
            <span className="text-red-500 font-bold">Learn forever</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">Cancel anytime</span>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="#pricing" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 text-base sm:text-lg shadow-lg shadow-red-600/50">
                Join Now
              </button>
            </Link>
            <Link href="/lms/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 text-base sm:text-lg border border-gray-600">
                Go to LMS
              </button>
            </Link>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">4.9</span> Rating
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">50+</span> Founding Students
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">54+</span> Episodes
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">3</span> Real Robots Built
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">30 Day</span> Money Back
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

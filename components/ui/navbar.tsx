"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#seasons", label: "Seasons" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#projects", label: "Projects" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-4">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 rounded-full bg-black/70 border border-red-600/30 backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="font-display text-base sm:text-lg font-bold text-white tracking-wider shrink-0">
          <span className="text-red-600">ROBO</span>FLIX
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition-colors text-gray-300 hover:text-white hover:bg-red-600/20"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/lms/login"
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition-colors text-gray-300 hover:text-white hover:bg-red-600/20"
          >
            Go to LMS
          </Link>
          <Link
            href="#pricing"
            target="_self"
            className="ml-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Start Building →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 p-3 bg-black/95 border-b border-red-600/30 backdrop-blur-md md:hidden z-30">
          <div className="max-w-5xl mx-auto flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 text-sm rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-red-600/20"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/lms/login"
              className="px-4 py-2.5 text-sm rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-red-600/20"
              onClick={() => setIsOpen(false)}
            >
              Go to LMS
            </Link>
            <Link
              href="#pricing"
              className="px-4 py-2.5 text-sm rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-center"
              onClick={() => setIsOpen(false)}
            >
              Start Building →
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

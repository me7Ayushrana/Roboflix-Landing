"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function FloatingCtaButton() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Hide on LMS pages
  const isLmsPage = pathname?.includes("/lms")

  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.getElementById("pricing")
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect()
        // Show button when pricing section is NOT in view (user has scrolled past or not reached it yet)
        setIsVisible(rect.top > window.innerHeight || rect.bottom < 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible || isLmsPage) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
    >
      <Link href="#pricing">
        <button className="group flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-600/50 hover:shadow-red-600/70 hover:scale-110 duration-300 text-sm sm:text-base whitespace-nowrap">
          <span>Join Now</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </Link>
    </motion.div>
  )
}

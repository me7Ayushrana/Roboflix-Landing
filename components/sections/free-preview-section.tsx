"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FreePreviewSection() {
  return (
    <section id="free-preview" className="px-6 py-24 bg-black/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Watch Free Before You Commit
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Full trailer is completely free.
            <br />
            No email. No credit card. Just watch and decide.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See our teaching style, meet the instructors, and watch what you'll build — completely for free, no strings attached.
          </p>
        </motion.div>

        {/* Video Embed Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative rounded-xl overflow-hidden border border-red-600/30 bg-black/60 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-600/40 mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-gray-400">Roboflix Trailer</p>
              <p className="text-sm text-gray-500 mt-2">Coming Soon</p>
            </div>
          </div>
        </motion.div>

        {/* CTA After Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">
            Liked what you saw?
            <br />
            <span className="text-white font-semibold">Everything else unlocks at ₹989 →</span>
          </p>
          <Link href="https://rzp.io/rzp/roboflix" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/50">
              Start Building — ₹989
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function VividSuccessSection() {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-red-600/10 via-black/40 to-black/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-12">
            Your First Robot Interview Story
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-gray-300 leading-relaxed mb-12">
            <p>
              You're in a job interview.
              <br />
              <span className="text-gray-400">They ask: "Show us something you've built."</span>
            </p>

            <p>
              You pull out your phone.
              <br />
              <span className="text-gray-400">You play a video.</span>
            </p>

            <p>
              <span className="text-white font-semibold">A robot YOU built — moving, detecting objects,</span>
              <br />
              <span className="text-white font-semibold">doing exactly what you programmed it to do.</span>
            </p>

            <p>
              <span className="text-red-600 font-bold text-2xl">"I built this myself. In 2 months."</span>
            </p>

            <p>
              <span className="text-gray-400 italic">That's the moment everything changes.</span>
            </p>
          </div>

          <div className="space-y-6 mb-12">
            <p className="text-white font-semibold text-lg">
              That moment isn't about luck.
              <br />
              <span className="text-gray-400">It's what happens when you actually BUILD robots instead of just learning about them.</span>
            </p>

            <p className="text-gray-400">
              It starts here.
              <br />
              It starts with <span className="text-red-600 font-bold">just ₹989</span>.
              <br />
              <span className="text-white font-semibold">It starts today.</span>
            </p>
          </div>

          <Link href="#pricing">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/50">
              Join Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

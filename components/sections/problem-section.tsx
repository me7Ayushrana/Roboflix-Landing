"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function ProblemSection() {
  return (
    <section className="px-6 py-24 bg-black/40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">The RoboFlix Difference</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-12">
            Why Traditional Learning Doesn't Work for Robotics
          </h2>

          {/* Pull Quote */}
          <div className="border-l-4 border-red-600 bg-black/60 border border-l-4 border-red-600 rounded-r-lg p-8 md:p-12 mb-12 max-w-3xl mx-auto text-left">
            <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
              "4 years. ₹8-10 lakhs. Hundreds of assignments. Zero robots built. That&apos;s theory, not skills."
            </p>
          </div>

          <div className="space-y-8 text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto text-left mb-12">
            <p>
              College teaches you <span className="text-white">math and theory.</span> But robotics? You need to <span className="text-white">build things with your hands.</span> That's how you actually learn.
            </p>

            <p>
              <span className="text-white font-semibold">RoboFlix is different.</span> Every lesson, you complete one small project. You see results immediately. You build real skills, real fast.
            </p>

            <p className="text-white font-semibold">
              That's the secret to learning robotics the right way.
            </p>
          </div>

          {/* Stakes Line */}
          <p className="text-xl md:text-2xl font-bold text-white max-w-3xl mx-auto mb-8">
            Start now, and you'll have 3 working robots on your resume before the year ends.
          </p>

          <Link href="#pricing">
            <button className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/50">
              Join Now
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

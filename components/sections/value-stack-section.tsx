"use client"

import { motion } from "framer-motion"

export function ValueStackSection() {
  return (
    <section className="px-6 py-24 bg-black/40">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Why subscription and not a one time payment?
          </h2>
        </motion.div>

        {/* Subscription Model Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-black/60 border border-gray-700 rounded-xl p-8 md:p-12 space-y-6 text-center md:text-left"
        >
          <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
            <p>
              Because a course you buy once — you watch once. Then it sits in your downloads forever.
            </p>

            <p className="pt-4">
              With RoboFlix you pay{" "}
              <span className="text-white font-bold">
                ₹598 for 15 days
              </span>
              {" "}then{" "}
              <span className="text-white font-bold">
                ₹399/month
              </span>
              {" "}after that.
            </p>

            <p>
              Or pay{" "}
              <span className="text-white font-bold">
                ₹989 for your first month
              </span>
              {" "}then{" "}
              <span className="text-white font-bold">
                ₹299/month
              </span>
              {" "}after that.
            </p>

            <p className="pt-4">
              Every month — new season. New robot. New skills.
            </p>

            <p>
              <span className="text-white font-bold">
                You are not buying a course.
              </span>
            </p>

            <p>
              <span className="text-white font-bold">
                You are joining a builder's journey that levels you up every single month.
              </span>
            </p>

            <p className="pt-4 text-red-400 font-semibold">
              Cancel anytime. No questions. No guilt.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

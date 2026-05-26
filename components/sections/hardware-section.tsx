"use client"

import { motion } from "framer-motion"

const components = [
  "Arduino Uno or ESP32 board",
  "L298N Motor Driver",
  "Ultrasonic sensor HC-SR04",
  "IR sensors x2",
  "DC motors x2 with wheels",
  "Servo motor x1",
  "Jumper wires and breadboard",
  "USB cable",
]

export function HardwareSection() {
  return (
    <section className="px-6 py-24 bg-black/40">
      <div className="max-w-5xl mx-auto">
        {/* First Part */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            What Hardware Do You Need?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            You don&apos;t need an expensive lab.
            <br />
            You need a table, a laptop and a starter kit.
          </p>

          {/* Starter Kit */}
          <div className="border border-red-600/20 rounded-xl bg-black/60 p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Season 1 Hardware
            </h3>

            <ul className="space-y-3 mb-8">
              {components.map((component, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
                  {component}
                </motion.li>
              ))}
            </ul>

            <p className="text-gray-400">
              The moment you enroll we send you the exact shopping list with direct buy links for every component above.
              <br />
              <span className="text-white font-semibold">No guessing. No wasted money. No confusion.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

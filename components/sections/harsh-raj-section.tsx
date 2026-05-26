"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function HarshRajSection() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Video Embed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative bg-black rounded-xl overflow-hidden border border-gray-800">
              <div className="aspect-video flex items-center justify-center bg-black/80">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/r4RlhzXnUQs"
                  title="6-DOF Robotic Arm Build"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </motion.div>

          {/* Story Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">From the Community</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Built a 6-DOF robotic arm. No 3D printer. No lab. Just pure curiosity.
              </h2>
            </div>

            <div className="space-y-4 text-gray-400 leading-relaxed text-lg">
              <p>
                Harsh Raj grew up in Nasrichak, a small village in Jamui district, Bihar — no robotics lab, no 3D printer, no mentor. Now studying in Varanasi, he had one thing most students didn&apos;t: an obsession with making things move.
              </p>

              <p>
                Inspired by Iron Man, he started experimenting with electronics in class 8 after receiving a WeMos D1 Mini ESP8266. By class 10, he built a fully functional 6-DOF robotic arm from scratch using locally available materials.
              </p>

              <p>
                Every joint, bracket, and line of code was handcrafted by him. He even created a unique record-and-play system by modifying ordinary servo motors — without expensive encoders or high-end hardware.
              </p>

              <p>
                <span className="text-white font-semibold">No shortcuts. No sponsorship. Just a curious kid from Bihar who refused to wait for resources and built his own future.</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-700">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">6-DOF</p>
                <p className="text-xs text-gray-500 mt-1">Degrees of Freedom Built</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">₹500</p>
                <p className="text-xs text-gray-500 mt-1">Lab Equipment Budget</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">100%</p>
                <p className="text-xs text-gray-500 mt-1">Hand Fabricated</p>
              </div>
            </div>

            {/* Profile */}
            <div>
              <p className="text-gray-400 mb-3">🧑 Harsh Raj · Nasrichak, Jamui, Bihar → Varanasi, UP</p>
              <p className="text-sm text-gray-500">Early Roboflix community member</p>
            </div>

            {/* Closing Quote */}
            <p className="text-xl font-semibold text-white border-l-4 border-red-600 pl-6">
              "If Harsh can build a 6-DOF arm from a village in Bihar with zero lab access — what&apos;s your excuse?"
            </p>

            <Link href="#pricing">
              <button className="w-full px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/50">
                Join Now
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Instagram, Linkedin, Share2 } from "lucide-react"

const benefits = [
  {
    icon: Instagram,
    title: "Get Featured",
    description: "Post your robot build online. Tag #Roboflix. Your build gets featured on our Instagram every week. The best builds get pinned to our community wall.",
  },
  {
    icon: Linkedin,
    title: "Build Your Identity",
    description: "Add your Season 1 Builder badge to LinkedIn. Show it in interviews. Not because it is a certificate — but because it proves you actually built something.",
  },
  {
    icon: Share2,
    title: "Prove It",
    description: "A video of a walking robot on your profile is worth more than any certificate on your wall. This is your identity now. You are a builder.",
  },
]

export function SocialCurrencySection() {
  return (
    <section className="px-6 py-24 bg-black/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Build It. Post It. Own It.
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Every robot you build on Roboflix — post it online. Because proof matters more than certificates.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-red-600/20 bg-black/60 hover:border-red-600/50 transition-all"
              >
                <Icon className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

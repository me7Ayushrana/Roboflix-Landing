"use client"

import { motion } from "framer-motion"

const successStories = [
  {
    quote: "I went from zero coding knowledge to building my first robot in 2 months! The Netflix-style learning kept me hooked. Best money I spent.",
    name: "Arjun Singh",
    role: "Student, Season 1 Complete",
  },
  {
    quote: "The ROS and MATLAB sections genuinely prepared me for my internship. Couldn't have done it without Roboflix!",
    name: "Priya Sharma",
    role: "Intern @ TCS, Season 2 Active",
  },
  {
    quote: "This is how robotics education should be. Engaging, practical, and actually fun. Addictive is the right word!",
    name: "Aditya Verma",
    role: "College Student, Season 3",
  },
]

const communityStats = [
  { number: "500+", label: "Active Members" },
  { number: "10+", label: "Internships Offered" },
  { number: "Weekly", label: "Live Sessions" },
]

export function SuccessStoriesSection() {
  return (
    <section className="px-6 py-24 bg-black/40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-red-600 uppercase tracking-wider mb-4">Success Stories</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            From Curious to <span className="text-red-600">Roboticist</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-balance text-lg">
            Real students sharing their robotics journey and real results.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {successStories.map((story, idx) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-xl border border-red-600/20 bg-black/60 hover:bg-black/80 hover:border-red-600/60 transition-all duration-300"
            >
              {/* Quote */}
              <p className="text-gray-300 mb-6 leading-relaxed italic">&quot;{story.quote}&quot;</p>

              {/* User Info */}
              <div>
                <p className="text-white font-semibold text-sm">{story.name}</p>
                <p className="text-red-600 text-xs font-medium">{story.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-red-600/20 pt-12"
        >
          <h3 className="text-center text-2xl font-bold text-white mb-12">Join a community of robotics enthusiasts</h3>
          <div className="grid grid-cols-3 gap-8">
            {communityStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-red-600 mb-2">{stat.number}</p>
                <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

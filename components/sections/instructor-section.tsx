"use client"

import { motion } from "framer-motion"

export function InstructorSection() {
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
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">Your Guide</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-12">
            Who teaches you
          </h2>
        </motion.div>

        {/* Instructor Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="border border-red-600/20 rounded-xl bg-black/60 p-8 md:p-12 hover:border-red-600/50 transition-all">
            {/* Photo */}
            <div className="mb-8 flex justify-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-600/40 shadow-lg">
                <img 
                  src="/founder-ishinder.jpg" 
                  alt="Ishinder Singh - Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Instructor Info */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ishinder Singh</h3>
              <p className="text-red-600 font-semibold text-lg">Founder, XAIR AI Robotics · Embedded Systems Engineer</p>
            </div>

            {/* Bio */}
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                I didn&apos;t learn robotics in a classroom. I learned it by breaking things, debugging at 2am, and figuring out why my servo wasn&apos;t responding at 3am.
              </p>

              <p>
                I run active R&D projects for real clients — hotels, defence, industrial automation. <span className="text-white font-semibold">The robots here are not demo projects. They are real machines built for real deployments.</span>
              </p>

              <p>
                I built Roboflix because no college ever taught me what I actually needed. Every episode is what I wish someone had taught me.
              </p>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-gray-700">
              {["Embedded Systems", "ROS2", "Defence R&D", "Industrial Automation"].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full text-sm text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

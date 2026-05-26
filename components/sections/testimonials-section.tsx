"use client"

import { motion } from "motion/react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

const testimonials = [
  {
    text: "I went from zero coding knowledge to building my first robot in 2 months! The Netflix-style learning kept me hooked. Best money I spent.",
    image: "/testimonial-1.jpg",
    name: "Arjun Singh",
    role: "Student, Season 1 Complete",
  },
  {
    text: "The ROS and MATLAB sections genuinely prepared me for my internship. Couldn&apos;t have done it without Roboflix!",
    image: "/testimonial-2.jpg",
    name: "Priya Sharma",
    role: "Intern @ TCS, Season 2 Active",
  },
  {
    text: "This is how robotics education should be. Engaging, practical, and actually fun. Addictive is the right word!",
    image: "/testimonial-3.jpg",
    name: "Aditya Verma",
    role: "College Student, Season 3",
  },
  {
    text: "Roboflix made me confident enough to pursue robotics as my career. The community is incredible too!",
    image: "/testimonial-4.jpg",
    name: "Shreya Patel",
    role: "Junior Roboticist",
  },
  {
    text: "The project files and code examples are gold. Every episode builds on previous ones perfectly.",
    image: "/testimonial-5.jpg",
    name: "Rahul Gupta",
    role: "Hobbyist Builder",
  },
  {
    text: "Finally, robotics education that respects my intelligence and teaches real skills. Highly recommend!",
    image: "/testimonial-6.jpg",
    name: "Neha Mishra",
    role: "Tech Educator",
  },
  {
    text: "The hexapod project was mind-blowing. Building from CAD to actual locomotion is incredible.",
    image: "/testimonial-7.jpg",
    name: "Vivek Kumar",
    role: "Season 4 Participant",
  },
  {
    text: "Started as a curiosity, now I&apos;m getting robotics internship offers. Roboflix changed my trajectory.",
    image: "/testimonial-8.jpg",
    name: "Manish Nair",
    role: "Career Changer",
  },
  {
    text: "The community aspect is what made me stick with it. Everyone is supportive and passionate!",
    image: "/testimonial-9.jpg",
    name: "Isha Desai",
    role: "Premium Member",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function TestimonialsSection() {
  return (
    <section id="community" className="px-6 py-24 bg-black/40">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-12"
        >
          <div className="border border-red-600/50 py-1.5 px-4 rounded-full text-sm text-red-600">Success Stories</div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-6 text-center tracking-tight">
            From Curious to Roboticist
          </h2>
          <p className="text-center mt-4 text-gray-400 text-lg text-balance">
            Real students sharing their robotics journey and real results.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>

        <div className="mt-16 pt-16 border-t border-red-600/20">
          <p className="text-center text-sm text-gray-500 mb-8">Join a community of robotics enthusiasts</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-6 py-3 rounded-full bg-red-600/10 border border-red-600/30 text-sm text-gray-300">
              500+ Active Members
            </div>
            <div className="px-6 py-3 rounded-full bg-red-600/10 border border-red-600/30 text-sm text-gray-300">
              10+ Internships Offered
            </div>
            <div className="px-6 py-3 rounded-full bg-red-600/10 border border-red-600/30 text-sm text-gray-300">
              Weekly Live Sessions
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

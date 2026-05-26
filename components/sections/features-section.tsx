"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"

const roboticProjects = [
  {
    name: "Ghost Rover",
    season: "Season 3",
    description: "Autonomous rover with computer vision, sensor fusion, and intelligent path planning.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GhostRover-P5s9genDniu6jkV89P8PlPM6mFchoR.jpeg",
    tools: ["ROS2", "OpenCV", "SLAM", "AI Vision"],
  },
  {
    name: "Iron Arm",
    season: "Season 2",
    description: "A 3-DOF robotic arm built from scratch — no 3D printer required. Learn inverse kinematics, servo control, and real mechanical design with hand-fabricated parts.",
    image: "/ironarm.png",
    tools: ["Arduino", "Servo Control", "Inverse Kinematics", "CAD"],
  },
  {
    name: "Robo Crab",
    season: "Season 4",
    description: "A 4-legged quadruped walker with dynamic gait control and terrain adaptation. Build, calibrate, and program a robot that actually walks.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FourlegCrab-t98xz8yq1KhLInAVoWEG53ZYazyPsc.jpeg",
    tools: ["ROS2", "Gait Algorithms", "IMU Sensing", "Python"],
  },
]

export function FeaturesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isAutoPlaying) return

    autoPlayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roboticProjects.length)
    }, 5000)

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current)
    }
  }, [isAutoPlaying])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + roboticProjects.length) % roboticProjects.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % roboticProjects.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  const currentProject = roboticProjects[currentIndex]

  return (
    <section id="projects" className="px-0 py-24 bg-black/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-red-600 uppercase tracking-wider mb-4">Featured Projects</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Build Real Robots
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-balance text-lg">
            Work on industry-inspired projects. From autonomous rovers to robotic arms to hexapod walkers. All code and CAD files included.
          </p>
        </motion.div>
      </div>

      {/* Netflix-style Project Carousel */}
      <div className="relative group w-full">
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden"
        >
          {/* Carousel Track */}
          <div
            className="flex h-full transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}%))`,
            }}
          >
            {roboticProjects.map((project) => (
              <div
                key={project.name}
                className="w-full h-full flex-shrink-0 flex items-center justify-center px-2 sm:px-4"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-auto object-contain rounded-lg border border-red-600/20"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Project Info */}
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="text-center">
            <span className="text-red-600 font-bold text-sm uppercase tracking-widest">{currentProject.season}</span>
            <div className="flex items-center justify-center gap-6 mt-2 mb-4">
              <button
                onClick={handlePrev}
                className="p-2 sm:p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 shadow-lg shadow-red-600/50"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <h3 className="text-3xl md:text-4xl font-bold text-white flex-1">{currentProject.name}</h3>
              <button
                onClick={handleNext}
                className="p-2 sm:p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 shadow-lg shadow-red-600/50"
                aria-label="Next project"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed max-w-3xl mx-auto">{currentProject.description}</p>

            {/* Tools */}
            <div className="mb-8 flex justify-center">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Key Technologies</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentProject.tools.map((tool) => (
                    <span key={tool} className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full border border-red-600/40">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link href="https://rzp.io/rzp/roboflix" target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/50 hover:shadow-red-600/70 group/btn">
                Enroll Now
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {roboticProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-red-600 w-8"
                  : "bg-gray-600 w-2 hover:bg-gray-400"
              }`}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>

        {/* Project Counter */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          Project {currentIndex + 1} of {roboticProjects.length}
        </div>
      </div>
    </section>
  )
}

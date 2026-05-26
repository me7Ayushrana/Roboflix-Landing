"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const seasons = [
  {
    code: "S1",
    name: "ORIGIN",
    tagline: "The System Wakes",
    tools: ["Arduino", "ESP32", "Python", "C++", "Linux"],
    episodes: [
      { num: 1, title: "Electricity Unlocked", outcome: "Voltage, Current, Power, Ohm's Law", difficulty: "Beginner" },
      { num: 2, title: "Your First Brain", outcome: "Arduino/ESP32 intro, IDE setup, first upload", difficulty: "Beginner" },
      { num: 3, title: "Making It Move", outcome: "DC motors, servo motors, motor driver basics", difficulty: "Beginner" },
      { num: 4, title: "Teaching It to Feel", outcome: "Ultrasonic, IR, light sensors wired to motor", difficulty: "Intermediate" },
      { num: 5, title: "C++ That Does Things", outcome: "Functions, loops, logic controlling hardware", difficulty: "Intermediate" },
      { num: 6, title: "Python Meets the Machine", outcome: "Python via Raspberry Pi, serial communication", difficulty: "Intermediate" },
      { num: 7, title: "Linux Is Your Workshop", outcome: "Terminal, file system, running scripts, SSH", difficulty: "Intermediate" },
    ],
  },
  {
    code: "S2",
    name: "CONTROL",
    tagline: "Build and Control a Robotic Arm",
    tools: ["ROS", "MATLAB", "Gazebo", "Fusion 360", "Kinematics"],
    episodes: [
      { num: 1, title: "Anatomy of an Arm", outcome: "Degrees of freedom, joint types, servo selection", difficulty: "Beginner" },
      { num: 2, title: "Design It First", outcome: "CAD intro in Fusion 360, sketching geometry", difficulty: "Beginner" },
      { num: 3, title: "Build the Structure", outcome: "3D printing parts or laser-cut assembly", difficulty: "Intermediate" },
      { num: 4, title: "Wire the Joints", outcome: "Servo wiring, PCA9685 PWM driver, power management", difficulty: "Intermediate" },
      { num: 5, title: "MATLAB Intro", outcome: "MATLAB basics, plotting motion curves", difficulty: "Intermediate" },
      { num: 6, title: "Forward Kinematics", outcome: "Where is the end-effector? Math made visual", difficulty: "Advanced" },
      { num: 7, title: "Inverse Kinematics", outcome: "Given a target—how does the arm get there?", difficulty: "Advanced" },
      { num: 8, title: "ROS First Contact", outcome: "ROS intro, nodes, topics, why ROS exists", difficulty: "Intermediate" },
      { num: 9, title: "ROS Controls the Arm", outcome: "ROS node sends commands to servos", difficulty: "Intermediate" },
      { num: 10, title: "Gazebo Simulation", outcome: "Simulate the arm in Gazebo before tuning", difficulty: "Advanced" },
    ],
  },
  {
    code: "S3",
    name: "AUTONOMY",
    tagline: "Autonomous Rover",
    tools: ["ROS2", "OpenCV", "LiDAR", "Navigation", "Sensor Fusion"],
    episodes: [
      { num: 1, title: "Rover Architecture", outcome: "Chassis types, wheel config, drivetrain design", difficulty: "Beginner" },
      { num: 2, title: "CAD the Chassis", outcome: "Full rover CAD in Fusion 360", difficulty: "Beginner" },
      { num: 3, title: "Drive System", outcome: "L298N motor driver, encoder basics, differential drive", difficulty: "Intermediate" },
      { num: 4, title: "Sensor Stack", outcome: "Ultrasonic, LiDAR intro, IMU, camera wired", difficulty: "Intermediate" },
      { num: 5, title: "ROS2 Navigation Stack", outcome: "ROS2 setup, Nav2 intro, transform trees", difficulty: "Intermediate" },
      { num: 6, title: "Gazebo Simulation", outcome: "Full rover in Gazebo, virtual sensor testing", difficulty: "Intermediate" },
      { num: 7, title: "Obstacle Avoidance", outcome: "Sensor fusion logic, reactive navigation", difficulty: "Advanced" },
      { num: 8, title: "Camera + OpenCV", outcome: "Object detection, lane following, colour tracking", difficulty: "Advanced" },
      { num: 9, title: "Path Planning Basics", outcome: "A* algorithm concept, waypoint navigation", difficulty: "Advanced" },
      { num: 10, title: "Full Autonomous Run", outcome: "Everything integrated, tuned, demonstrated", difficulty: "Advanced" },
    ],
  },
  {
    code: "S4",
    name: "EVOLUTION",
    tagline: "Quadruped from Zero",
    tools: ["CAD", "Gait Algorithms", "ROS2", "Gazebo", "MuJoCo"],
    episodes: [
      { num: 1, title: "Why Legs?", outcome: "Legged robotics vs wheeled, biomechanics", difficulty: "Beginner" },
      { num: 2, title: "Hexapod vs Quadruped", outcome: "Stability triangles, why 4 legs", difficulty: "Beginner" },
      { num: 3, title: "Full CAD from Zero", outcome: "Body, legs, joints complete design", difficulty: "Intermediate" },
      { num: 4, title: "Print and Assemble", outcome: "3D printing strategy, assembly sequence", difficulty: "Intermediate" },
      { num: 5, title: "Electronics Layout", outcome: "24 servos, power bus design, placement", difficulty: "Intermediate" },
      { num: 6, title: "AI-Assisted Design", outcome: "Using AI tools to validate geometry", difficulty: "Intermediate" },
      { num: 7, title: "Basic Gait — Trot", outcome: "Trot gait algorithm, timing sequences", difficulty: "Advanced" },
      { num: 8, title: "Gait Library", outcome: "Walk, trot, creep gaits all coded", difficulty: "Advanced" },
      { num: 9, title: "ROS2 Integration", outcome: "ROS2 control architecture for legs", difficulty: "Advanced" },
      { num: 10, title: "Gazebo + MuJoCo", outcome: "Simulate quadruped, test gaits virtually", difficulty: "Advanced" },
      { num: 11, title: "Terrain Adaptation", outcome: "IMU feedback to adjust gait on slope", difficulty: "Advanced" },
      { num: 12, title: "Final Showcase Build", outcome: "Complete working RoboCrab demo", difficulty: "Advanced" },
    ],
  },
  {
    code: "S5",
    name: "DOMINATION",
    tagline: "World Map Robotics",
    tools: ["Isaac Sim", "MATLAB Simulink", "RL Training", "Advanced ROS2"],
    episodes: [
      { num: 1, title: "Where You Stand", outcome: "Skills audit, what professional looks like", difficulty: "Intermediate" },
      { num: 2, title: "Isaac Sim Deep Dive", outcome: "NVIDIA Isaac Sim setup, importing robots", difficulty: "Intermediate" },
      { num: 3, title: "Isaac Lab", outcome: "RL for robotics, training a policy", difficulty: "Advanced" },
      { num: 4, title: "ROS2 Advanced", outcome: "Lifecycle nodes, custom interfaces, hardware", difficulty: "Advanced" },
      { num: 5, title: "MATLAB Simulink", outcome: "Control systems design, PID tuning", difficulty: "Advanced" },
      { num: 6, title: "Gazebo Advanced", outcome: "Multi-robot simulation, custom plugins", difficulty: "Advanced" },
      { num: 7, title: "What to Learn Next", outcome: "Papers, projects, careers, competitions", difficulty: "Advanced" },
      { num: 8, title: "Enter the Field", outcome: "Open source, portfolio, internship prep", difficulty: "Advanced" },
    ],
  },
]

export function CurriculumSection() {
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0)
  const activeSeason = seasons[activeSeasonIndex]

  return (
    <section className="px-6 py-24 bg-black/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">Full Curriculum — Explore All 5 Seasons</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
            What You&apos;ll Build & Learn
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Click through each season to see the complete journey from Arduino basics to advanced robotics</p>
        </motion.div>

        {/* Progress Arc */}
        <div className="mb-12">
          <div className="flex gap-2 mb-4">
            {seasons.map((season, idx) => (
              <div key={idx} className="flex-1 h-1 rounded-full" style={{
                backgroundColor: idx === activeSeasonIndex ? '#dc2626' : '#374151'
              }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wider font-semibold">
            {seasons.map((season) => (
              <span key={season.code}>{season.code}</span>
            ))}
          </div>
        </div>

        {/* Season Tabs with Navigation Hints */}
        <div className="mb-12">
          <motion.div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-6">
            {seasons.map((season, idx) => (
              <motion.button
                key={season.code}
                onClick={() => setActiveSeasonIndex(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 md:px-7 py-3 md:py-4 rounded-xl transition-all font-semibold text-center cursor-pointer relative group ${
                  idx === activeSeasonIndex
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 border border-red-600'
                    : 'bg-black/60 text-gray-300 border border-gray-700 hover:border-red-600 hover:bg-black/80'
                }`}
              >
                <span className="block text-sm md:text-base font-bold">{season.code}</span>
                <span className="block text-xs md:text-sm mt-1 opacity-90">{season.name}</span>
                
                {/* Hover tooltip */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded bg-gray-900 border border-gray-700 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${
                  idx === activeSeasonIndex ? 'opacity-100 pointer-events-auto' : ''
                }`}>
                  {season.episodes.length} episodes
                </div>
              </motion.button>
            ))}
          </motion.div>
          
          {/* Navigation hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-500 text-sm flex items-center justify-center gap-2"
          >
            <span className="font-bold italic">Tap to explore</span>
            <span className="text-gray-600">•</span>
            <span>5 seasons</span>
            <span className="text-gray-600">•</span>
            <span>{seasons.reduce((total, s) => total + s.episodes.length, 0)} episodes</span>
          </motion.p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Left: Season Identity Block */}
          <motion.div
            key={`identity-${activeSeasonIndex}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:col-span-1 order-1 md:order-none"
          >
            <div className="rounded-xl border border-red-600/20 bg-black/60 p-4 md:p-6 md:sticky md:top-20">
              <div className="mb-6">
                <p className="text-red-600 font-bold text-2xl">{activeSeason.code}</p>
                <h3 className="text-3xl font-bold text-white mt-2 mb-1">{activeSeason.name}</h3>
                <p className="text-gray-400 text-sm">{activeSeason.tagline}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-red-600/20">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">Episodes</p>
                <p className="text-3xl font-bold text-red-600">{activeSeason.episodes.length}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">Key Tools</p>
                <div className="flex flex-wrap gap-2">
                  {activeSeason.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 bg-black/80 border border-red-600/40 text-red-400 text-xs font-medium rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Episode List */}
          <motion.div
            key={`episodes-${activeSeasonIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="md:col-span-2"
          >
            <div className="space-y-0">
              {activeSeason.episodes.map((episode, idx) => (
                <motion.div
                  key={episode.num}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08, ease: "easeOut" }}
                  whileHover={{ x: 4 }}
                  className="group border-b border-gray-800 hover:border-red-600/40 hover:bg-black/50 transition-all py-3 md:py-4 px-3 md:px-4 flex flex-col md:flex-row gap-3 md:gap-4 cursor-pointer"
                >
                  {/* Episode Number */}
                  <div className="flex gap-3 md:flex-col md:flex-shrink-0 md:flex items-start">
                    <div className="w-7 h-7 rounded bg-red-600/20 border border-red-600/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-xs font-bold">{episode.num}</span>
                    </div>

                    {/* Difficulty Tag - Mobile Position */}
                    <span className={`md:hidden text-xs font-semibold px-2 py-1 rounded ${
                      episode.difficulty === 'Beginner'
                        ? 'bg-green-600/20 text-green-400'
                        : episode.difficulty === 'Intermediate'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}>
                      {episode.difficulty}
                    </span>
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-red-400 transition-colors">
                      {episode.title}
                    </h4>
                    <p className="text-gray-500 text-xs">{episode.outcome}</p>
                  </div>

                  {/* Difficulty Tag - Desktop Position */}
                  <div className="hidden md:flex flex-shrink-0 items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      episode.difficulty === 'Beginner'
                        ? 'bg-green-600/20 text-green-400'
                        : episode.difficulty === 'Intermediate'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-red-600/20 text-red-400'
                    }`}>
                      {episode.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 p-8 rounded-xl border border-red-600/20 bg-red-600/5 text-center"
        >
          <div>
            <p className="text-4xl font-bold text-red-600 mb-2">47</p>
            <p className="text-gray-400 text-sm">Total Episodes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-600 mb-2">5</p>
            <p className="text-gray-400 text-sm">Seasons</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 mb-2">Infinite</p>
            <p className="text-gray-400 text-sm">Possibilities</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

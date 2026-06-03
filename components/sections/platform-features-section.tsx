"use client"

import { motion } from "framer-motion"
import { Cpu, Play, Video, MessageCircle, Zap } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Video,
    title: "Netflix-Style Learning",
    badge: "Cinema Player",
    description: "High-definition course player designed to eliminate learning friction. Completely masked to block YouTube branding, recommended channel grids, and third-party ads. Equipped with standard keyboard shortcuts, playback speed controls, and smart timestamp memory to resume learning on any device.",
    visual: (
      <div className="mt-8 aspect-video bg-neutral-950 rounded-xl border border-neutral-900 overflow-hidden relative flex items-center justify-center">
        <img 
          src="/netflix-style-thumbnail.jpg" 
          alt="Course Video Player" 
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/10"></div>
        
        {/* Simple centered play icon */}
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white relative z-10 shadow-lg">
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </div>
        
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-neutral-400 relative z-10">
          <span>08:42 / 15:30</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> HD Playback</span>
        </div>
      </div>
    )
  },
  {
    icon: MessageCircle,
    title: "Doubt Support & Student Pace",
    badge: "Adaptive Sync",
    description: "Never get stuck on a circuit or compile bug. Drop Doubt Pins directly on the video timeline at the exact second you are confused. Seamlessly share your simulator state with engineering mentors on WhatsApp for under-24h walkthroughs, and use peer heatmaps to navigate difficult concepts.",
    visual: (
      <div className="mt-8 p-4 rounded-xl bg-neutral-950/80 border border-neutral-900 flex flex-col justify-between h-48">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-neutral-400 font-bold uppercase tracking-wider">Lesson Heatmap Activity</span>
            <span className="text-red-500 font-bold">Timeline Doubt Pin active</span>
          </div>
          
          {/* Heatmap timeline visualization */}
          <div className="h-10 flex items-end gap-1 bg-neutral-950 p-2 rounded border border-neutral-900/60 relative overflow-hidden">
            {[10, 15, 35, 50, 75, 80, 65, 30, 20, 25, 55, 70, 90, 100, 60, 40, 25, 15, 10, 20, 35, 50].map((val, idx) => (
              <div 
                key={idx} 
                className="flex-1 rounded-t-sm"
                style={{ 
                  height: `${val}%`,
                  backgroundColor: val > 70 ? 'rgb(220, 38, 38)' : 'rgba(115, 115, 115, 0.2)'
                }}
              ></div>
            ))}
            {/* Red doubt pin marker on timeline */}
            <div className="absolute top-0 bottom-0 left-2/3 w-0.5 bg-red-500 z-10">
              <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-600 rounded-full border border-white/20 shadow-md"></div>
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-neutral-900/40 rounded border border-neutral-800 text-[10px] text-neutral-400 font-mono leading-relaxed">
          <span className="text-red-500 font-bold">Doubt at 11:45:</span> "Motor whines but does not rotate. Check supply voltage regulator connections..."
        </div>
      </div>
    )
  },
  {
    icon: Cpu,
    title: "Virtual Sandbox",
    badge: "Hardware Simulator",
    description: "Build and test robotics circuits directly in your browser. Wire microcontrollers like the ESP32 to breadboards, sensors, and actuators on an interactive, snap-to-grid grid. The simulator validates connections dynamically to ensure perfect logic before you build on hardware.",
    visual: (
      <div className="mt-8 relative h-48 bg-black border border-neutral-900 rounded-xl overflow-hidden flex flex-col justify-between p-2">
        {/* ESP32 Wiring simulator mockup matching user image exactly */}
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
          <svg viewBox="0 0 420 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Background grid */}
              <pattern id="dot-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.6" fill="#222" />
              </pattern>
              {/* LED gloss gradient */}
              <linearGradient id="led-highlight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Grid background */}
            <rect width="100%" height="100%" fill="url(#dot-grid)" rx="8" />

            {/* Jumper Wires (Rendered below components) */}
            {/* Common Ground (Gray) */}
            <path 
              d="M 111 115 L 111 145 Q 111 150 120 150 L 136 150 L 136 145 L 136 150 Q 136 155 145 150 L 220 150" 
              stroke="#525252" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
            />
            <path 
              d="M 136 85 L 136 150" 
              stroke="#525252" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
            />

            {/* Green LED anode wire to Resistor 2 (Green) */}
            <path 
              d="M 119 115 L 119 128 L 165 128" 
              stroke="#10b981" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
            />

            {/* Blue LED anode wire to Resistor 1 (Green) */}
            <path 
              d="M 144 85 L 144 120 L 165 120" 
              stroke="#10b981" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
            />

            {/* Resistor 1 to ESP32 Pin 21 (Green) */}
            <path 
              d="M 205 120 L 220 120" 
              stroke="#10b981" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Resistor 2 to ESP32 Pin 22 (Green) */}
            <path 
              d="M 205 128 L 220 128" 
              stroke="#10b981" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Ground connection to ESP32 GND (Gray) */}
            <path 
              d="M 220 150 L 230 150" 
              stroke="#525252" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              fill="none" 
            />

            {/* Components */}
            {/* Green LED */}
            <g transform="translate(108, 95)">
              {/* LED dome */}
              <path d="M 0 12 C 0 4, 12 4, 12 12 Z" fill="#10b981" opacity="0.9" />
              <path d="M 1 12 C 1 6, 11 6, 11 12 Z" fill="url(#led-highlight)" opacity="0.4" />
              {/* LED base rim */}
              <rect x="-1" y="12" width="14" height="2" rx="0.5" fill="#047857" />
              {/* Metal pins */}
              <line x1="3" y1="14" x2="3" y2="20" stroke="#9ca3af" strokeWidth="1" />
              <line x1="11" y1="14" x2="11" y2="20" stroke="#9ca3af" strokeWidth="1" />
            </g>

            {/* Blue LED */}
            <g transform="translate(133, 65)">
              {/* LED dome */}
              <path d="M 0 12 C 0 4, 12 4, 12 12 Z" fill="#3b82f6" opacity="0.9" />
              <path d="M 1 12 C 1 6, 11 6, 11 12 Z" fill="url(#led-highlight)" opacity="0.4" />
              {/* LED base rim */}
              <rect x="-1" y="12" width="14" height="2" rx="0.5" fill="#1d4ed8" />
              {/* Metal pins */}
              <line x1="3" y1="14" x2="3" y2="20" stroke="#9ca3af" strokeWidth="1" />
              <line x1="11" y1="14" x2="11" y2="20" stroke="#9ca3af" strokeWidth="1" />
            </g>

            {/* Resistor 1 */}
            <g transform="translate(165, 115)">
              {/* Leads */}
              <line x1="-8" y1="5" x2="0" y2="5" stroke="#9ca3af" strokeWidth="1" />
              <line x1="40" y1="5" x2="48" y2="5" stroke="#9ca3af" strokeWidth="1" />
              {/* Body */}
              <rect x="0" y="1" width="40" height="8" rx="2" fill="#d2b48c" stroke="#b49372" strokeWidth="0.8" />
              {/* Color bands (220 ohm: Red, Red, Brown, Gold) */}
              <rect x="6" y="1" width="3" height="8" fill="#ef4444" />
              <rect x="13" y="1" width="3" height="8" fill="#ef4444" />
              <rect x="20" y="1" width="3" height="8" fill="#78350f" />
              <rect x="30" y="1" width="3" height="8" fill="#fbbf24" />
            </g>

            {/* Resistor 2 */}
            <g transform="translate(165, 123)">
              {/* Leads */}
              <line x1="-8" y1="5" x2="0" y2="5" stroke="#9ca3af" strokeWidth="1" />
              <line x1="40" y1="5" x2="48" y2="5" stroke="#9ca3af" strokeWidth="1" />
              {/* Body */}
              <rect x="0" y="1" width="40" height="8" rx="2" fill="#d2b48c" stroke="#b49372" strokeWidth="0.8" />
              {/* Color bands (220 ohm: Red, Red, Brown, Gold) */}
              <rect x="6" y="1" width="3" height="8" fill="#ef4444" />
              <rect x="13" y="1" width="3" height="8" fill="#ef4444" />
              <rect x="20" y="1" width="3" height="8" fill="#78350f" />
              <rect x="30" y="1" width="3" height="8" fill="#fbbf24" />
            </g>

            {/* ESP32 Board */}
            <g transform="translate(225, 30)">
              {/* PCB Board */}
              <rect x="0" y="0" width="80" height="130" rx="4" fill="#0f0f0f" stroke="#1f1f1f" strokeWidth="1" />
              {/* Wi-Fi Antenna area */}
              <rect x="10" y="4" width="60" height="18" fill="#18181b" rx="2" />
              <path d="M 15 8 H 65 V 16 H 15 Z M 20 11 H 60" stroke="#3f3f46" strokeWidth="0.8" />
              
              {/* ESP-WROOM-32 Main chip metal casing */}
              <rect x="12" y="26" width="56" height="42" rx="2" fill="#2d2d30" stroke="#3f3f46" strokeWidth="0.8" />
              {/* Shield details */}
              <circle cx="20" cy="34" r="2" fill="#52525b" />
              <text x="40" y="52" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ESP32</text>
              
              {/* USB Connector */}
              <rect x="28" y="122" width="24" height="10" rx="1" fill="#71717a" />
              <rect x="31" y="125" width="18" height="7" rx="0.5" fill="#27272a" />
              
              {/* Yellow Header Pin Pads (Left row) */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <g key={`left-pin-${i}`} transform={`translate(4, ${26 + i * 6.2})`}>
                  <circle cx="0" cy="0" r="1.8" fill="#eab308" />
                  <circle cx="0" cy="0" r="0.8" fill="#18181b" />
                </g>
              ))}
              {/* Yellow Header Pin Pads (Right row) */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <g key={`right-pin-${i}`} transform={`translate(76, ${26 + i * 6.2})`}>
                  <circle cx="0" cy="0" r="1.8" fill="#eab308" />
                  <circle cx="0" cy="0" r="0.8" fill="#18181b" />
                </g>
              ))}
              
              {/* Status LEDs on board */}
              <circle cx="18" cy="115" r="1.5" fill="#ef4444" />
              <circle cx="62" cy="115" r="1.5" fill="#eab308" />
            </g>
          </svg>
        </div>

        {/* Simulator controls at bottom */}
        <div className="w-full flex items-center justify-between px-2 py-1 bg-neutral-950 rounded-full border border-neutral-900 relative z-20">
          <span className="text-[7.5px] font-bold text-yellow-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> STANDBY
          </span>
          <div className="flex gap-1">
            <span className="text-[7px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono">Verify</span>
            <span className="text-[7px] bg-red-600 px-2 py-0.5 rounded text-white font-bold font-mono">Upload & Run</span>
          </div>
        </div>
      </div>
    )
  }
]

export function PlatformFeaturesSection() {
  return (
    <section id="features" className="px-6 py-28 bg-black relative overflow-hidden border-t border-neutral-900">
      {/* Subtle Background Accent Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600/20" /> The RoboFlix Smart LMS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Engineered For <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Hands-On Builders</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            We built a custom-designed, intelligence-first learning platform from scratch. 
            Not just simple video classes, but an active sandbox environment that enables real building.
          </motion.p>
        </div>

        {/* 3-Column Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 md:p-8 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-sm flex flex-col justify-between hover:border-red-600/20 hover:shadow-[0_0_20px_rgba(229,9,20,0.04)] transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2.5 rounded-lg bg-red-600/10 text-red-500 border border-red-600/20 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600/20 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase border bg-neutral-900/40 text-neutral-500 border-neutral-800 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
                
                {feature.visual}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

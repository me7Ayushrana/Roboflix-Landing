"use client"

import { motion } from "framer-motion"
import { Cpu, Play, Flame, HelpCircle, Bookmark, MessageSquare, ArrowRight, Zap, Library, CheckCircle, Video, MessageCircle, Code2, FolderHeart, ShieldAlert, Award, Layers } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Cpu,
    title: "Hardware Virtual Lab Sandbox",
    badge: "Top Feature",
    isHero: true,
    description: "An industry-first virtual breadboard environment. Wire up microcontrollers (Arduino Uno, Raspberry Pi 4) directly in your browser. The canvas automatically validates pin connections, prevents battery short-circuiting, and color-matches wires in real-time so you build with absolute confidence before touching physical parts.",
    className: "md:col-span-2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-red-600/40 hover:border-red-500 shadow-[0_4px_30px_rgba(229,9,20,0.1)]",
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-black/80 border border-neutral-800 overflow-hidden relative group-hover:border-red-500/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-mono text-neutral-400">virtual_sandbox_core.io</span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
            <CheckCircle className="w-3 h-3" /> System Diagnostics Stable
          </span>
        </div>
        
        {/* Photorealistic components overlapping inside canvas visual */}
        <div className="relative h-44 flex items-center justify-around gap-4 z-10 p-2 overflow-hidden bg-neutral-950/60 rounded-lg border border-neutral-900">
          {/* Arduino board */}
          <div className="relative group-hover:scale-105 transition-transform duration-500 w-32 shrink-0">
            <img 
              src="/arduino-uno.png" 
              alt="Arduino Uno" 
              className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute top-1 right-2 bg-yellow-500/10 text-yellow-500 text-[8px] font-mono border border-yellow-500/20 px-1 rounded">COM3</div>
          </div>

          {/* Golden animated curved wire connection */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* VCC wire */}
              <motion.path 
                d="M 120 70 Q 180 30 240 75" 
                stroke="#E50914" 
                strokeWidth="2.5" 
                fill="none" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
              {/* GND wire */}
              <motion.path 
                d="M 120 90 Q 180 130 240 100" 
                stroke="#000000" 
                strokeWidth="2.5" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
              {/* Signal wire */}
              <motion.path 
                d="M 120 110 Q 190 80 240 120" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* SG90 Servo motor */}
          <div className="relative group-hover:scale-105 transition-transform duration-500 w-28 shrink-0">
            <img 
              src="/servo-sg90.png" 
              alt="SG90 Servo" 
              className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute bottom-1 left-2 bg-red-600/10 text-red-500 text-[8px] font-mono border border-red-600/20 px-1 rounded">PWM ACTIVE</div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: Video,
    title: "Netflix-Style Widescreen Player",
    badge: "Top Feature",
    isHero: true,
    description: "Immersive learning like you have never seen before. Watch ultra-high-definition lecture videos inside our custom player designed to eliminate distractions—no YouTube logos, recommended channels, overlays, or ads. Toggle speed, control with smart keyboard hotkeys, and enjoy full widescreen immersion.",
    className: "md:col-span-1 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-red-600/40 hover:border-red-500 shadow-[0_4px_30px_rgba(229,9,20,0.1)]",
    visual: (
      <div className="mt-6 aspect-video bg-black rounded-xl border border-neutral-800 flex items-center justify-center relative overflow-hidden group-hover:border-red-500/20 transition-all duration-300">
        <img 
          src="/netflix-style-thumbnail.jpg" 
          alt="Netflix-Style Player" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        
        <div className="w-14 h-14 rounded-full bg-red-600/90 border border-white/20 flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:bg-red-600 shadow-[0_0_20px_#E50914] transition-all duration-300">
          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
        </div>
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-neutral-300 relative z-10">
          <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">08:42 / 15:30</span>
          <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest text-[8px] animate-pulse">Cinematic Mode</span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800 z-10">
          <div className="h-full w-2/3 bg-red-600 shadow-[0_0_8px_#E50914]"></div>
        </div>
      </div>
    )
  },
  {
    icon: MessageCircle,
    title: "24/7 Dedicated WhatsApp Doubt Support",
    badge: "Top Feature",
    isHero: true,
    description: "Never stay stuck. One single click matches your current timeline second, exact code files, and virtual lab coordinates, formulating a pre-filled WhatsApp message. Submit this directly to our dedicated engineering mentors, getting custom screen recordings and scripts back in under 24 hours.",
    className: "md:col-span-1 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-red-600/40 hover:border-red-500 shadow-[0_4px_30px_rgba(229,9,20,0.1)]",
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wider">Expert Mentor Active</span>
          </div>
          <span className="text-[8px] font-mono text-neutral-400">Response: Avg. 12m</span>
        </div>
        
        <div className="space-y-2">
          <div className="p-2 rounded bg-neutral-950/90 text-[10px] text-neutral-400 border border-neutral-900 font-mono leading-relaxed">
            <span className="text-red-500 font-bold">You (Ep 4):</span> "My TT Geared Motor is not turning when uploaded. Here is my wiring and code link..."
          </div>
          <div className="p-2 rounded bg-emerald-950/30 text-[10px] text-neutral-200 border border-emerald-950 font-mono leading-relaxed">
            <span className="text-emerald-500 font-bold">Roboflix Support:</span> "Hey Ayush! Checked your code link. You connected the logic wire to Pin 8, but the code references Pin 9. Update the pinMode and it will spin!"
          </div>
        </div>
      </div>
    )
  },
  {
    icon: Code2,
    title: "Dual Code & 3D CAD Hub",
    badge: "Direct Download",
    isHero: false,
    description: "Write C++ codes inside a built-in sandbox while watching episodes. Instantly access, rotate, and inspect photorealistic 3D CAD files (.STL & .STEP models) directly from the player view. Download production-ready schematics with a single click.",
    className: "md:col-span-1 bg-neutral-900/40 backdrop-blur-sm border-neutral-800/80 hover:border-red-600/30 shadow-lg",
    visual: (
      <div className="mt-6 p-3.5 rounded-xl bg-black/80 border border-neutral-800/80 font-mono text-[10px] text-neutral-400 relative overflow-hidden group-hover:border-red-500/10 transition-colors">
        <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span className="text-neutral-300">motor_controller.ino</span>
        </div>
        <div className="space-y-1">
          <p><span className="text-red-500">#define</span> MOTOR_PIN 9</p>
          <p><span className="text-blue-400">void</span> <span className="text-yellow-400">setup</span>() &#123;</p>
          <p className="pl-3">pinMode(MOTOR_PIN, OUTPUT);</p>
          <p>&#125;</p>
          <p><span className="text-blue-400">void</span> <span className="text-yellow-400">loop</span>() &#123; ... &#125;</p>
        </div>
        <div className="absolute top-1 right-2 bg-red-600 text-white font-bold text-[8px] px-2 py-0.5 rounded shadow">CAD ACTIVE</div>
      </div>
    )
  },
  {
    icon: FolderHeart,
    title: "1-Click 'Save to Library' Deck",
    badge: "Personal Vault",
    isHero: false,
    description: "Heart key code snippets, custom wiring configurations, or lecture chapters during video sessions. They automatically compile into your secure Personal Reference Library, complete with responsive bookmark previews for instant revisions.",
    className: "md:col-span-1 bg-neutral-900/40 backdrop-blur-sm border-neutral-800/80 hover:border-red-600/30 shadow-lg",
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-black/80 border border-neutral-800/80 relative group-hover:border-red-500/10 transition-colors">
        <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Library className="w-3.5 h-3.5 text-red-500" /> Saved References (3)
          </span>
          <span className="text-[9px] bg-red-600/10 text-red-500 px-1.5 py-0.5 rounded font-mono">Synced</span>
        </div>
        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="p-2 rounded bg-neutral-900/60 text-neutral-300 border border-neutral-950 flex justify-between items-center hover:bg-neutral-900 transition-colors">
            <span>Ep 4 — H-Bridge Wiring Layout</span>
            <span className="text-red-500 font-bold">12:15</span>
          </div>
          <div className="p-2 rounded bg-neutral-900/60 text-neutral-300 border border-neutral-950 flex justify-between items-center hover:bg-neutral-900 transition-colors">
            <span>Ep 2 — Servo Rotation Code</span>
            <span className="text-red-500 font-bold">03:45</span>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: Layers,
    title: "17+ Photorealistic Parts Catalog",
    badge: "Hardware Renders",
    isHero: false,
    description: "Access rich component assets directly inside the simulator catalog. Real product photos are serving with 100% transparent screen blending, allowing components to overlay seamlessly on the workbench canvas for absolute visual realism.",
    className: "md:col-span-1 bg-neutral-900/40 backdrop-blur-sm border-neutral-800/80 hover:border-red-600/30 shadow-lg",
    visual: (
      <div className="mt-6 h-28 flex items-center justify-center gap-3 relative overflow-hidden bg-neutral-950/60 rounded-xl border border-neutral-900 p-2">
        <motion.img 
          src="/geared-dc-motor.png" 
          alt="DC Motor" 
          className="w-16 h-auto object-contain drop-shadow-md shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img 
          src="/lipo-battery.png" 
          alt="LiPo Battery" 
          className="w-14 h-auto object-contain drop-shadow-md shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img 
          src="/lm2596-buck.png" 
          alt="Buck Converter" 
          className="w-14 h-auto object-contain drop-shadow-md shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    )
  },
  {
    icon: ShieldAlert,
    title: "Instructor & Peer Analytics Dashboard",
    badge: "Big Data",
    isHero: false,
    description: "Our platform leverages aggregated analytics to build watch progress graphs and doubt hotspots. Instructors monitor real-time dropout segments, while peers navigate through visual heatmap spikes to skip typical bottlenecks.",
    className: "md:col-span-1 bg-neutral-900/40 backdrop-blur-sm border-neutral-800/80 hover:border-red-600/30 shadow-lg overflow-hidden relative",
    visual: (
      <div className="mt-6 aspect-video rounded-xl overflow-hidden border border-neutral-800/80 relative group-hover:border-red-500/10 transition-colors">
        <img 
          src="/analytics-dashboard-dark-mode-with-charts-and-grap.jpg" 
          alt="Analytics Dashboard" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] font-mono text-neutral-300">
          <span>Heatmap Analytics</span>
          <span className="text-red-500 font-bold">100% Data-Driven</span>
        </div>
      </div>
    )
  },
  {
    icon: Award,
    title: "Gamified XP & Engineering Milestones",
    badge: "Progression Engine",
    isHero: true,
    description: "Every circuit successfully wired, C++ code verified, and episode fully completed earns you XP points. Climb the progression ranks from Novice Tinkerer to Robotics Commander. Unlock secret founders' badges and showcase verified micro-credentials on your professional portfolio.",
    className: "md:col-span-2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-red-600/40 hover:border-red-500 shadow-[0_4px_30px_rgba(229,9,20,0.1)]",
    visual: (
      <div className="mt-6 p-4 rounded-xl bg-black/80 border border-neutral-800/80 overflow-hidden relative group-hover:border-red-500/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">Level 4: Robotics Commander</span>
              <span className="text-red-500 font-bold">2,450 / 3,000 XP</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full border border-neutral-900 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_8px_#E50914]"
                initial={{ width: 0 }}
                whileInView={{ width: "81%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 shadow">
              <Award className="w-3.5 h-3.5 text-red-500 fill-red-500/10 animate-bounce" /> Level Up Unlocked
            </span>
          </div>
        </div>
      </div>
    )
  }
]

export function PlatformFeaturesSection() {
  return (
    <section id="features" className="px-6 py-28 bg-black relative overflow-hidden border-t border-neutral-900">
      {/* Background Accent Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600/20" /> The RoboFlix Smart LMS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Engineered For <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Hands-On Builders</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            We built a custom-designed, intelligence-first learning platform from scratch. 
            Not just simple video classes, but an active sandbox environment that enables real building.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`p-6 md:p-8 rounded-2xl border backdrop-blur-md flex flex-col justify-between transition-all duration-300 group ${feature.className}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${
                      feature.isHero 
                        ? "bg-red-600/20 text-red-500 border-red-500/30 group-hover:bg-red-600 group-hover:text-white" 
                        : "bg-neutral-800 text-neutral-400 border-neutral-700/80 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600/30"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider uppercase border px-3 py-1 rounded-full ${
                      feature.isHero
                        ? "bg-red-600/10 text-red-500 border-red-600/20"
                        : "bg-neutral-800/60 text-neutral-400 border-neutral-800"
                    }`}>
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className={`text-xl md:text-2xl font-bold text-white mb-3 transition-colors ${
                    feature.isHero ? "group-hover:text-red-500" : "group-hover:text-red-400"
                  }`}>
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

        {/* Call to action at bottom of grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link href="#pricing">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 group/cta">
              Experience the Smart LMS Now
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { MessageCircleQuestion } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { addDoubtPin } from "@/lib/playerEvents"

interface DoubtPinButtonProps {
  episodeId: string
  currentTime: number
  onPin?: (timestamp: number) => void
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? "0" : ""}${sec}`
}

export default function DoubtPinButton({ episodeId, currentTime, onPin }: DoubtPinButtonProps) {
  const [toast, setToast] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    const t = Math.floor(currentTime)
    addDoubtPin(episodeId, t)
    onPin?.(t)
    
    const label = `Doubt pinned at ${formatTime(t)} — we'll look into it`
    setToast(label)
    setPulsing(true)
    setTimeout(() => setToast(null), 3000)
    setTimeout(() => setPulsing(false), 600)
  }

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="doubt-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="flex items-center gap-2.5 bg-black/95 border border-amber-500/30 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md">
              <span className="text-amber-400 text-sm">📍</span>
              <span className="text-[12px] font-semibold text-white whitespace-nowrap">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center">
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="bg-black/95 border border-white/10 rounded-md px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
                I&apos;m confused here
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handlePin}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          animate={pulsing ? { scale: [1, 1.25, 0.9, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-white/5 hover:bg-amber-500/15 rounded-full text-gray-300 hover:text-amber-400 transition-all hover:scale-105 active:scale-95"
          title="I'm confused here — pin a doubt"
        >
          <MessageCircleQuestion className="w-4 h-4" />
        </motion.button>
      </div>
    </>
  )
}

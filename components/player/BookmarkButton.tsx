"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { addBookmark, removeBookmark, isBookmarked, type Bookmark } from "@/lib/playerEvents"

interface BookmarkButtonProps {
  episodeId: string
  seasonId: number
  episodeNumber: number
  episodeTitle: string
  currentTime: number
  onBookmarkChange?: (saved: boolean) => void
}

export default function BookmarkButton({
  episodeId,
  seasonId,
  episodeNumber,
  episodeTitle,
  currentTime,
  onBookmarkChange,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Load initial state from localStorage
  useEffect(() => {
    setSaved(isBookmarked(episodeId))
  }, [episodeId])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saved) {
      removeBookmark(episodeId)
      setSaved(false)
      onBookmarkChange?.(false)
    } else {
      const bookmark: Bookmark = {
        episodeId,
        seasonId,
        episodeNumber,
        title: episodeTitle,
        thumbnailUrl: `https://img.youtube.com/vi/yqWX86uT5jM/hqdefault.jpg`, // fallback, improved in watch page
        savedTimestamp: Math.floor(currentTime),
        savedAt: Date.now(),
      }
      addBookmark(bookmark)
      setSaved(true)
      setPulse(true)
      setTimeout(() => setPulse(false), 700)
      onBookmarkChange?.(true)
    }
  }

  return (
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
              {saved ? "Saved — click to remove" : "Save to My Library"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        animate={pulse ? { scale: [1, 1.35, 0.95, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className={`p-2 rounded-full transition-all hover:scale-105 active:scale-95 ${
          saved
            ? "bg-red-600/20 text-[#E50914] hover:bg-red-600/30"
            : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-red-400"
        }`}
        title={saved ? "Saved to My Library" : "Save to My Library"}
      >
        <Heart
          className={`w-4 h-4 transition-all ${saved ? "fill-[#E50914] text-[#E50914]" : ""}`}
        />
      </motion.button>
    </div>
  )
}

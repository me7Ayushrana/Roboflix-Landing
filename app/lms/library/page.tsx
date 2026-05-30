"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ArrowLeft, Clock, BookOpen, X } from "lucide-react"
import { getBookmarks, removeBookmark, type Bookmark } from "@/lib/playerEvents"

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? "0" : ""}${sec}`
}

export default function LibraryPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Auth guard
    const storedUser = localStorage.getItem("lms_user")
    if (!storedUser) {
      router.push("/lms/login")
      return
    }
    setBookmarks(getBookmarks().sort((a, b) => b.savedAt - a.savedAt))
    setIsLoading(false)
  }, [router])

  const handleRemove = (episodeId: string) => {
    removeBookmark(episodeId)
    setBookmarks(prev => prev.filter(b => b.episodeId !== episodeId))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">
              ROBO<span className="text-red-600">FLIX</span>
            </span>
          </Link>
          <span className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-sm font-bold text-gray-200 uppercase tracking-widest">My Library</span>
          </div>
          <div className="flex-1" />
          <Link href="/lms/dashboard">
            <button className="text-xs font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition">
              Dashboard
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Saved Episodes</h1>
          <p className="text-gray-500 text-sm">
            {bookmarks.length > 0
              ? `${bookmarks.length} episode${bookmarks.length === 1 ? "" : "s"} in your library`
              : "Your personal collection"}
          </p>
        </div>

        {/* Empty state */}
        {bookmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
              <Heart className="w-9 h-9 text-red-600/60" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No saved episodes yet</h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
              Hit the <span className="text-red-400 font-semibold">♥</span> heart button on any episode while watching to save it here.
            </p>
            <Link href="/lms/dashboard">
              <button className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-bold text-white transition shadow-lg shadow-red-900/30">
                Browse Episodes
              </button>
            </Link>
          </motion.div>
        )}

        {/* Bookmarks grid */}
        {bookmarks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {bookmarks.map((bm, i) => (
                <motion.div
                  key={bm.episodeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative bg-[#111] border border-gray-800 hover:border-red-900/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_8px_30px_rgba(229,9,20,0.1)] transition-all duration-300"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(bm.episodeId)}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-black/80 hover:bg-red-600 border border-white/10 hover:border-red-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Remove from library"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Thumbnail */}
                  <Link href={`/lms/watch/${bm.seasonId}/${bm.episodeNumber}?t=${bm.savedTimestamp}`}>
                    <div className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer">
                      <img
                        src={bm.thumbnailUrl}
                        alt={bm.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/yqWX86uT5jM/hqdefault.jpg`
                        }}
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Season badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600/90 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                        S{bm.seasonId}E{bm.episodeNumber}
                      </div>

                      {/* Saved timestamp chip */}
                      {bm.savedTimestamp > 0 && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/80 border border-white/10 rounded-full text-[10px] font-mono font-bold text-gray-300">
                          <Clock className="w-2.5 h-2.5" />
                          Saved at {formatTime(bm.savedTimestamp)}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Card info */}
                  <Link href={`/lms/watch/${bm.seasonId}/${bm.episodeNumber}?t=${bm.savedTimestamp}`}>
                    <div className="p-3 cursor-pointer">
                      <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                        {bm.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BookOpen className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600">
                          {new Date(bm.savedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

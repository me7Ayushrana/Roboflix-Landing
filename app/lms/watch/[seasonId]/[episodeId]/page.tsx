"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Menu, X, MessageCircle } from "lucide-react"
import { SEASONS_DATA } from "@/lib/lms-data"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export default function VideoPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const seasonId = parseInt(params.seasonId as string)
  const episodeId = parseInt(params.episodeId as string)
  
  const season = SEASONS_DATA.find((s) => s.id === seasonId)
  const episode = season?.episodes.find((e) => e.id === episodeId)
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [doubt, setDoubt] = useState("")
  const [showDoubtForm, setShowDoubtForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session && session.user) {
            setIsLoading(false)
            return
          }
        }
        
        // Fallback to local storage if Supabase is not configured or has no active session
        const storedUser = localStorage.getItem("lms_user")
        if (storedUser) {
          setIsLoading(false)
        } else {
          router.push("/lms/login")
        }
      } catch (err) {
        router.push("/lms/login")
      }
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-medium">Loading...</div>
      </div>
    )
  }

  if (!season || !episode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div>Episode not found</div>
      </div>
    )
  }

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Handle Ask Doubt button
  const handleAskDoubt = () => {
    if (!doubt.trim()) {
      alert("Please enter your doubt")
      return
    }

    const timestamp = formatTime(Math.floor(currentTime))
    const message = `I have a doubt in ${season.title} - ${episode.title} at ${timestamp}: ${doubt}`
    const whatsappUrl = `https://wa.me/8288898544?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    
    setDoubt("")
    setShowDoubtForm(false)
  }

  // Generate YouTube nocookie embed URL - completely hides YouTube branding
  const getYouTubeEmbedUrl = () => {
    const videoId = "yqWX86uT5jM"
    // modestbranding=1 hides YouTube logo, rel=0 removes related videos, showinfo=0 hides info
    return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&fs=1&autoplay=0&playsinline=1&iv_load_policy=3`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-gray-800">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href={`/lms/season/${season.id}`} className="hover:text-red-500 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <Link href="/">
            <span className="text-lg sm:text-xl font-bold">
              ROBO<span className="text-red-600">FLIX</span>
            </span>
          </Link>
          <div className="flex-1" />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden hover:text-red-500 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex gap-0 md:gap-6 px-4 sm:px-6 py-6">
        {/* Video Player - Center */}
        <div className="flex-1 min-w-0 order-2 md:order-1">
          {/* Video Container */}
          <div className="mb-6">
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={getYouTubeEmbedUrl()}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>

          {/* Episode Title & Info */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{episode.title}</h1>
            <p className="text-red-500 font-semibold text-sm uppercase tracking-wider mb-4">{season.title}</p>
            <p className="text-gray-400 text-sm sm:text-base mb-6">{episode.duration}</p>

            {/* Ask Doubt Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowDoubtForm(!showDoubtForm)}
              className="mb-6 flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Ask Doubt on WhatsApp
            </motion.button>

            {/* Doubt Form */}
            {showDoubtForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg"
              >
                <p className="text-sm text-gray-400 mb-3">
                  Ask your doubt at <span className="text-white font-semibold">{formatTime(Math.floor(currentTime))}</span>
                </p>
                <textarea
                  value={doubt}
                  onChange={(e) => setDoubt(e.target.value)}
                  placeholder="Describe your doubt here..."
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 mb-3 text-sm"
                  rows={3}
                />
                <button
                  onClick={handleAskDoubt}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition-colors text-sm"
                >
                  Send on WhatsApp
                </button>
              </motion.div>
            )}
          </div>

          {/* Episode Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">Description</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{episode.description}</p>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">Summary</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{episode.summary}</p>
          </div>

          {/* Resources */}
          {episode.files.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Resources & Files</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {episode.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-900 border border-gray-800 hover:border-red-600 rounded-lg transition-colors flex items-center gap-3 cursor-pointer hover:bg-gray-800"
                  >
                    <div className="w-10 h-10 bg-red-600/20 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 text-sm font-bold">📄</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{file.name}</p>
                      <p className="text-gray-500 text-xs">{file.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Snippets */}
          {episode.codes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Code</h2>
              <div className="space-y-3">
                {episode.codes.map((code, idx) => (
                  <div key={idx} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                    <p className="text-red-500 text-xs font-semibold uppercase mb-2">{code.language}</p>
                    <code className="text-gray-300 text-xs sm:text-sm font-mono break-all">{code.snippet}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Episodes Navigation */}
        {isSidebarOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-full md:w-80 order-1 md:order-2 flex flex-col h-fit sticky top-20"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              {/* All Episodes Header */}
              <div className="p-4 border-b border-gray-800 bg-black/50">
                <h3 className="font-bold text-white text-sm">All Episodes (S1-S5)</h3>
              </div>

              {/* Episodes List */}
              <div className="max-h-[600px] overflow-y-auto">
                {SEASONS_DATA.map((s) => (
                  <div key={s.id}>
                    {/* Season Header */}
                    <div className="px-4 py-3 bg-gray-800/50 text-gray-300 text-xs font-semibold uppercase border-b border-gray-700">
                      {s.title}
                    </div>

                    {/* Season Episodes */}
                    {s.episodes.map((ep) => {
                      const isActive = s.id === season.id && ep.id === episode.id
                      const isClickable = s.id === 1

                      return (
                        <div key={`${s.id}-${ep.id}`}>
                          {isClickable ? (
                            <Link href={`/lms/watch/${s.id}/${ep.id}`}>
                              <div
                                className={`p-3 border-l-2 cursor-pointer transition-colors text-xs sm:text-sm ${
                                  isActive
                                    ? "bg-red-600/20 border-red-600 text-red-500"
                                    : "border-transparent text-gray-300 hover:bg-gray-800/50"
                                }`}
                              >
                                <p className="font-semibold line-clamp-2">{ep.title}</p>
                                <p className="text-gray-500 text-xs mt-1">{ep.duration}</p>
                              </div>
                            </Link>
                          ) : (
                            <div className="p-3 border-l-2 border-transparent text-gray-500 cursor-not-allowed opacity-50 text-xs sm:text-sm">
                              <p className="font-semibold line-clamp-2">{ep.title}</p>
                              <p className="text-gray-600 text-xs mt-1">Coming Soon</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}


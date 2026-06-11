"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, PlayCircle, ChevronDown, Lock, X } from "lucide-react"
import { SEASONS_DATA } from "@/lib/lms-data"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export default function SeasonPage() {
  const params = useParams()
  const router = useRouter()
  const seasonId = parseInt(params.seasonId as string)
  const [seasonsData, setSeasonsData] = useState(SEASONS_DATA)
  const season = seasonsData.find((s) => s.id === seasonId) || SEASONS_DATA.find((s) => s.id === seasonId)
  const [showAllEpisodes, setShowAllEpisodes] = useState(false)
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userTier, setUserTier] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    const loadSeasons = async () => {
      let loadedFromDb = false
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from("roboflix_lms_settings")
            .select("value")
            .eq("key", "seasons_data")
            .maybeSingle()

          if (!error && data && data.value) {
            setSeasonsData(data.value as any)
            localStorage.setItem("roboflix_lms_seasons", JSON.stringify(data.value))
            loadedFromDb = true
          } else if (!error && !data) {
            // Seed cloud database in the background since it is empty!
            await supabase
              .from("roboflix_lms_settings")
              .insert([{ key: "seasons_data", value: SEASONS_DATA, updated_at: new Date().toISOString() }])
            
            setSeasonsData(SEASONS_DATA)
            localStorage.setItem("roboflix_lms_seasons", JSON.stringify(SEASONS_DATA))
            loadedFromDb = true
          }
        } catch (err) {
          console.error("Supabase load seasons error:", err)
        }
      }

      if (!loadedFromDb && typeof window !== "undefined") {
        const stored = localStorage.getItem("roboflix_lms_seasons")
        if (stored) {
          try {
            setSeasonsData(JSON.parse(stored))
          } catch (e) {
            console.error(e)
          }
        } else {
          setSeasonsData(SEASONS_DATA)
          localStorage.setItem("roboflix_lms_seasons", JSON.stringify(SEASONS_DATA))
          
          // Seed cloud database offline fallback
          if (isSupabaseConfigured()) {
            (async () => {
              try {
                await supabase
                  .from("roboflix_lms_settings")
                  .insert([{ key: "seasons_data", value: SEASONS_DATA, updated_at: new Date().toISOString() }])
              } catch (e) {
                console.error("Background seeding error:", e)
              }
            })()
          }
        }
      }
    }

    loadSeasons()
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      try {
        let loggedInEmail = ""
        
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session && session.user) {
            loggedInEmail = session.user.email || ""
          }
        }
        
        if (!loggedInEmail) {
          const storedUser = localStorage.getItem("lms_user")
          if (storedUser) {
            const parsed = JSON.parse(storedUser)
            loggedInEmail = parsed.email || ""
          }
        }

        if (loggedInEmail) {
          setUserEmail(loggedInEmail)
          
          // Check for demo session override
          const isDemoSession = localStorage.getItem("lms_demo_session") === "true"
          if (isDemoSession) {
            setUserTier("Free Trial")
            setIsLoading(false)
            return
          }
          
          // Check if admin
          const isAdmin = loggedInEmail.toLowerCase() === "ayushamit007@gmail.com" ||
                          loggedInEmail.toLowerCase() === "ishinder.dev@gmail.com"
          
          if (isAdmin) {
            setUserTier("Pro")
            setIsLoading(false)
            return
          }

          // Fetch tier from Supabase first
          let fetchedTier = ""
          let fetchedStatus = ""
          if (isSupabaseConfigured()) {
            try {
              const { data, error } = await supabase
                .from("roboflix_lms_users")
                .select("tier, status")
                .eq("email", loggedInEmail.trim().toLowerCase())
                .maybeSingle()
              
              if (!error && data) {
                fetchedTier = data.tier
                fetchedStatus = data.status
              }
            } catch (err) {
              console.error("Error fetching user tier from Supabase:", err)
            }
          }

          // Fallback to local storage for tier
          if (!fetchedTier) {
            const storedUsers = localStorage.getItem("roboflix_lms_users")
            if (storedUsers) {
              try {
                const usersList = JSON.parse(storedUsers) as any[]
                const record = usersList.find(u => u.email.toLowerCase() === loggedInEmail.trim().toLowerCase())
                if (record) {
                  fetchedTier = record.tier
                  fetchedStatus = record.status
                }
              } catch (e) {}
            }
          }

          const isActivePaid = fetchedStatus === "Active" && (fetchedTier === "Pro" || fetchedTier === "Founding Batch")
          setUserTier(isActivePaid ? fetchedTier : "Free Trial")
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

  if (!season) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div>Season not found</div>
      </div>
    )
  }

  // Show 2 episodes by default, show all if button clicked
  const visibleEpisodes = showAllEpisodes ? season.episodes : season.episodes.slice(0, 2)
  const hasMoreEpisodes = season.episodes.length > 2

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/lms/dashboard" className="hover:text-red-500 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <Link href="/">
            <span className="text-xl sm:text-2xl font-bold">
              ROBO<span className="text-red-600">FLIX</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        {/* Season Header */}
        <div className="relative h-40 sm:h-56 rounded-lg overflow-hidden mb-8">
          <img
            src={season.image}
            alt={season.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <p className="text-red-500 font-semibold text-sm uppercase tracking-wider mb-2">{season.subtitle}</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-white">{season.title}</h1>
          </div>
        </div>

        {/* Season Description */}
        <div className="mb-12">
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">{season.description}</p>
        </div>

        {/* Episodes Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Episodes</h2>
          <div className="space-y-4">
            {visibleEpisodes.map((episode) => {
              const isLocked = userTier === "Free Trial" && episode.id !== 1

              const episodeCard = (
                <motion.div
                  whileHover={!isLocked ? { backgroundColor: "rgba(31, 41, 55, 0.8)" } : undefined}
                  className={`p-5 sm:p-6 rounded-lg border transition-all ${
                    isLocked 
                      ? "bg-gray-900/20 border-gray-800/30 opacity-60 cursor-pointer"
                      : "bg-gray-900/50 hover:bg-gray-800 cursor-pointer border-gray-800/50 hover:border-red-600/30 group"
                  }`}
                  onClick={isLocked ? () => setShowUpgradeModal(true) : undefined}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    {/* Play or Lock Button */}
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${
                      isLocked
                        ? "bg-gray-950/40 border-gray-850 text-gray-500"
                        : "bg-gray-800 group-hover:bg-red-600/20 border-gray-700 text-red-500 group-hover:text-red-400"
                    }`}>
                      {isLocked ? (
                        <Lock className="w-5 h-5 sm:w-7 sm:h-7 text-gray-500" />
                      ) : (
                        <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 group-hover:text-red-400" />
                      )}
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg sm:text-xl font-semibold transition-colors ${
                          isLocked ? "text-gray-505" : "text-white group-hover:text-red-500"
                        }`}>
                          {episode.title}
                        </h3>
                        {isLocked && (
                          <span className="px-2 py-0.5 bg-red-950/20 border border-red-500/20 text-[9px] font-bold text-red-500 rounded uppercase tracking-wider">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className={`text-sm sm:text-base mb-3 line-clamp-2 ${isLocked ? "text-gray-600" : "text-gray-400"}`}>
                        {episode.description}
                      </p>
                      <p className={`text-xs sm:text-sm ${isLocked ? "text-gray-650" : "text-gray-505"}`}>{episode.duration}</p>
                    </div>

                    {/* Arrow Icon */}
                    {!isLocked && (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1 group-hover:text-red-500 transition-colors hidden sm:block" />
                    )}
                  </div>
                </motion.div>
              )

              return isLocked ? (
                <div key={episode.id}>{episodeCard}</div>
              ) : (
                <Link key={episode.id} href={`/lms/watch/${season.id}/${episode.id}`}>
                  {episodeCard}
                </Link>
              )
            })}
          </div>

          {/* Show All Button */}
          {hasMoreEpisodes && !showAllEpisodes && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAllEpisodes(true)}
              className="mt-6 w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Show All {season.episodes.length} Episodes
            </motion.button>
          )}

          {/* Hide Episodes Button */}
          {showAllEpisodes && hasMoreEpisodes && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAllEpisodes(false)}
              className="mt-6 w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors border border-gray-700"
            >
              Show Less
            </motion.button>
          )}
        </div>
      </main>

      {/* ── UPGRADE TO PRO MODAL ────────────────────────────────── */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowUpgradeModal(false) }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-red-600/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.25)]"
            >
              {/* Glow border ring */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-red-600/40 via-transparent to-red-955/20 pointer-events-none" />

              <div className="relative">
                {/* Close button */}
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute right-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-5 text-xl shadow-[0_0_15px_rgba(220,38,38,0.15)] text-red-500">
                  🔒
                </div>

                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Premium Lesson Locked</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Start your professional robotics career today. Upgrade to Roboflix Premium to unlock all 5 seasons (54+ episodes), source code repositories, wiring schematics, and WhatsApp doubt support.
                </p>

                <div className="mb-6 p-4 bg-gray-900/60 border border-gray-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Founding Batch Price</span>
                    <span className="text-white text-xl font-extrabold font-mono">₹989</span>
                    <span className="text-gray-500 line-through text-xs font-mono ml-2">₹2,999</span>
                  </div>
                  <span className="px-2.5 py-1 bg-red-600/20 border border-red-500/40 rounded-full text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                    Save 67%
                  </span>
                </div>

                <div className="space-y-3">
                  <Link href="/#pricing" onClick={() => setShowUpgradeModal(false)}>
                    <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-600/35 hover:scale-[1.01]">
                      Unlock Premium Now
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full py-3 bg-transparent hover:bg-white/5 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Keep Exploring Free Content
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

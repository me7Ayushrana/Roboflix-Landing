"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

// The allowed admin accounts and their default password fallbacks
const ADMIN_CREDENTIALS: Record<string, string> = {
  "ayushamit007@gmail.com": "sexyroboflix",
  "ishinder.dev@gmail.com": "sexyishinder",
}

export default function LmsLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")

  // Initialize default users list in localStorage if it doesn't exist yet
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("roboflix_lms_users")
      const defaultList = [
        { email: "hloshishirdwivedi@gmail.com", phone: "6260087052", status: "Active", tier: "Founding Batch" },
        { email: "rkrohan0718@gmail.com", phone: "8449844821", status: "Active", tier: "Pro" },
        { email: "sid22prakash@gmail.com", phone: "9074423858", status: "Active", tier: "Pro" },
        { email: "ansh.ritesh.singh.2010@gmail.com", phone: "9049410576", status: "Active", tier: "Pro" },
        { email: "jemit57@gmail.com", phone: "437-224-3735", status: "Active", tier: "Founding Batch" },
        { email: "ishinder@gmail.com", phone: "8288898544", status: "Active", tier: "Pro" },
        { email: "ajityadav8776@gmail.com", phone: "9870723164", status: "Active", tier: "Pro" },
        { email: "kalemanthan8@gmail.com", phone: "9421600978", status: "Active", tier: "Pro" },
        { email: "aditya.jayrobotics92@gmail.com", phone: "6260694595", status: "Active", tier: "Pro" },
        { email: "sameer.kumar.sachdeva@gmail.com", phone: "9891445801", status: "Active", tier: "Pro" },
        { email: "abdullahhabib11.mh@gmail.com", phone: "9870786706", status: "Active", tier: "Pro" },
        { email: "divakersharma86@gmail.com", phone: "6307949742", status: "Active", tier: "Pro" },
        { email: "kevadiyaprakruti@gmail.com", phone: "6353050746", status: "Active", tier: "Pro" },
        { email: "mirzarahmathullahbaig@gmail.com", phone: "8309143616", status: "Active", tier: "Pro" },
        { email: "catchswapnoroop@gmail.com", phone: "9874158966", status: "Active", tier: "Pro" },
        { email: "yogeshprajapati7211@gmail.com", phone: "7990132748", status: "Active", tier: "Pro" },
        { email: "guptaamarjeet636@gmail.com", phone: "6299896341", status: "Active", tier: "Pro" },
        { email: "paulankur141@gmail.com", phone: "9864914544", status: "Active", tier: "Pro" },
        { email: "mohitmandawat16@gmail.com", phone: "7073988591", status: "Active", tier: "Pro" },
        { email: "parmindersinghunofficial@gmail.com", phone: "9717446891", status: "Active", tier: "Pro" },
        { email: "kspranks@gmail.com", phone: "6783567374", status: "Active", tier: "Pro" },
        { email: "kartikjain1312@gmail.com", phone: "8968766551", status: "Active", tier: "Pro" },
      ]
      if (!stored) {
        localStorage.setItem("roboflix_lms_users", JSON.stringify(defaultList))
      }
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const errParam = params.get("error")
      if (errParam === "session_expired") {
        setError("Your account has been logged out because it was logged in on another device. 🖥️")
      } else if (errParam === "access_denied") {
        setError("Access Denied: Your subscription has been revoked or has expired. 🔒")
      }
    }
  }, [])

  // Countdown timer to June 15, 2026
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2026-06-15").getTime()
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft("Season 1 is LIVE!")
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  // Set a lightweight session cookie so the server-side middleware can
  // detect authenticated users without reading localStorage.
  const setAuthCookie = () => {
    const maxAge = 60 * 60 * 24 * 7 // 7 days
    document.cookie = `roboflix-lms-auth=1; path=/; max-age=${maxAge}; SameSite=Strict; Secure`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedPassword = password.trim()
      const sessionId = Math.random().toString(36).substring(2) + Date.now().toString()

      const isDemoPass = trimmedPassword.toLowerCase() === "demoo" || 
                         trimmedPassword.toLowerCase() === "demo" || 
                         trimmedPassword.toLowerCase() === "trial" || 
                         trimmedPassword.toLowerCase() === "free"

      if (isDemoPass) {
        localStorage.setItem("lms_demo_session", "true")
        
        let finalPhone = trimmedPassword
        let finalTier = "Free Trial"
        let finalStatus = "Active"

        if (isSupabaseConfigured()) {
          try {
            const { data } = await supabase
              .from("roboflix_lms_users")
              .select("phone, tier, status")
              .eq("email", trimmedEmail)
              .maybeSingle()

            if (data) {
              const isDefaultDemoPhone = data.phone === "demo" || data.phone === "demoo" || data.phone === "trial" || data.phone === "free"
              finalPhone = isDefaultDemoPhone ? trimmedPassword : data.phone
              finalTier = data.tier || "Free Trial"
              finalStatus = data.status || "Active"

              await supabase
                .from("roboflix_lms_users")
                .update({ 
                  phone: finalPhone,
                  status: finalStatus,
                  tier: finalTier,
                  session_id: sessionId 
                })
                .eq("email", trimmedEmail)
            } else {
              await supabase
                .from("roboflix_lms_users")
                .insert([
                  {
                    email: trimmedEmail,
                    phone: trimmedPassword,
                    status: "Active",
                    tier: "Free Trial",
                    session_id: sessionId
                  }
                ])
            }
          } catch (e) {}
        }
        
        const stored = localStorage.getItem("roboflix_lms_users")
        const list = stored ? JSON.parse(stored) : []
        const idx = list.findIndex((u: any) => u.email.toLowerCase() === trimmedEmail)
        if (idx > -1) {
          const existing = list[idx]
          const isDefaultDemoPhone = existing.phone === "demo" || existing.phone === "demoo" || existing.phone === "trial" || existing.phone === "free"
          finalPhone = isDefaultDemoPhone ? trimmedPassword : existing.phone
          finalTier = existing.tier || finalTier
          finalStatus = existing.status || finalStatus
          list[idx] = { ...existing, phone: finalPhone, status: finalStatus, tier: finalTier, session_id: sessionId }
        } else {
          list.push({ email: trimmedEmail, phone: trimmedPassword, status: "Active", tier: "Free Trial", session_id: sessionId })
        }
        localStorage.setItem("roboflix_lms_users", JSON.stringify(list))
        
        localStorage.setItem("lms_user", JSON.stringify({ email: trimmedEmail, tier: finalTier }))
        localStorage.setItem("lms_session_id", sessionId)
        setAuthCookie()
        router.push("/lms/dashboard")
        return
      }

      localStorage.removeItem("lms_demo_session")

      const isAdminEmail = ADMIN_CREDENTIALS[trimmedEmail] !== undefined

      if (isAdminEmail) {
        // Load admin password from Supabase if configured, else use default
        let adminPassword = ADMIN_CREDENTIALS[trimmedEmail]
        if (isSupabaseConfigured()) {
          try {
            const { data } = await supabase
              .from("roboflix_lms_settings")
              .select("value")
              .eq("key", `admin_password_${trimmedEmail}`)
              .maybeSingle()
            if (data?.value) {
              adminPassword = data.value as string
            } else if (trimmedEmail === "ayushamit007@gmail.com") {
              // Legacy key fallback for ayushamit007
              const legacy = await supabase
                .from("roboflix_lms_settings")
                .select("value")
                .eq("key", "admin_password")
                .maybeSingle()
              if (legacy.data?.value) {
                adminPassword = legacy.data.value as string
              }
            }
          } catch {}
        }

        if (trimmedPassword === adminPassword) {
          // Track admin session token to enforce single-session control
          if (isSupabaseConfigured()) {
            try {
              // Store session id for this specific admin
              await supabase
                .from("roboflix_lms_settings")
                .upsert([{ key: `admin_session_id_${trimmedEmail}`, value: sessionId, updated_at: new Date().toISOString() }], { onConflict: "key" })
              
              // Legacy key for ayushamit007 backward compatibility
              if (trimmedEmail === "ayushamit007@gmail.com") {
                await supabase
                  .from("roboflix_lms_settings")
                  .upsert([{ key: "admin_session_id", value: sessionId, updated_at: new Date().toISOString() }], { onConflict: "key" })
              }
            } catch (e) {
              console.error("Failed to write admin session ID:", e)
            }
          }
          localStorage.setItem("lms_user", JSON.stringify({ email: trimmedEmail }))
          localStorage.setItem("lms_session_id", sessionId)
          setAuthCookie()
          router.push("/lms/dashboard")
        } else {
          setError("Invalid administrator password.")
        }
      } else {
        // Look up student record dynamically
        let studentRecord: any = null

        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase
              .from("roboflix_lms_users")
              .select("*")
              .eq("email", trimmedEmail)
              .maybeSingle()

            if (!error && data) {
              studentRecord = {
                email: data.email,
                phone: data.phone,
                status: data.status,
                tier: data.tier
              }
            }
          } catch (e) {
            console.error("Supabase login search error:", e)
          }
        }

        // Fallback to local storage if Supabase lookup failed or wasn't configured
        if (!studentRecord) {
          const storedUsers = localStorage.getItem("roboflix_lms_users")
          if (storedUsers) {
            try {
              const usersList = JSON.parse(storedUsers) as any[]
              const localRecord = usersList.find(u => u.email.toLowerCase() === trimmedEmail)
              if (localRecord) {
                studentRecord = localRecord
              }
            } catch (e) {
              // Ignore
            }
          }
        }

        // Process Authentication State
        if (studentRecord) {
          if (studentRecord.status === "Revoked") {
            setError("Your RoboFlix LMS subscription access has been revoked. Contact admin.")
            setLoading(false)
            return
          }
          
          const isPasswordMatch = studentRecord.phone === trimmedPassword || 
                                  (studentRecord.tier === "Free Trial" && (trimmedPassword.toLowerCase() === "demo" || trimmedPassword.toLowerCase() === "demoo"))

          if (isPasswordMatch && studentRecord.status === "Active") {
            // Track student session token to enforce single-session control
            if (isSupabaseConfigured()) {
              try {
                await supabase
                  .from("roboflix_lms_users")
                  .update({ session_id: sessionId })
                  .eq("email", trimmedEmail)
              } catch (e) {
                console.error("Failed to write student session ID:", e)
              }
            }

            // Sync user profile to local storage roboflix_lms_users so dashboard/seasons/watch pages can immediately read the tier
            const stored = localStorage.getItem("roboflix_lms_users")
            const list = stored ? JSON.parse(stored) : []
            const idx = list.findIndex((u: any) => u.email.toLowerCase() === trimmedEmail)
            if (idx > -1) {
              list[idx] = { ...list[idx], ...studentRecord }
            } else {
              list.push(studentRecord)
            }
            localStorage.setItem("roboflix_lms_users", JSON.stringify(list))

            // Enforce free trial override for dashboard/episodes
            if (studentRecord.tier === "Free Trial") {
              localStorage.setItem("lms_demo_session", "true")
            } else {
              localStorage.removeItem("lms_demo_session")
            }

            localStorage.setItem("lms_user", JSON.stringify({ email: trimmedEmail, tier: studentRecord.tier }))
            localStorage.setItem("lms_session_id", sessionId)
            setAuthCookie()
            router.push("/lms/dashboard")
          } else {
            setError("Invalid password.")
          }
        } else {
          setError("Access Denied: No active LMS subscription profile found for this email.")
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">

      {/* Header */}
      <div className="relative z-10 p-6 sm:p-8">
        <Link href="/">
          <div className="flex items-center gap-2 w-fit hover:opacity-80 transition">
            <span className="text-xl sm:text-2xl font-bold">
              ROBO<span className="text-red-600">FLIX</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 gap-8 md:gap-12 pb-8">
        {/* Left side - Welcome Message (mobile first) */}
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <div className="max-w-md mx-auto">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
              Welcome Back to <span className="text-red-600">RoboFlix</span>
            </h1>
            <p className="text-gray-300 mb-8 text-base leading-relaxed">
              Your gateway to mastering robotics. Login with your credentials to access all 5 seasons and continue your building journey.
            </p>

            {/* Countdown Timer */}
            <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-5 mb-8">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Season 1 Launch</p>
              <p className="text-2xl md:text-3xl font-bold text-white font-mono">{timeLeft || "Loading..."}</p>
              <p className="text-red-400 text-sm mt-3 font-semibold">Coming Soon</p>
            </div>

            <div className="text-gray-400 text-sm space-y-3">
              <p>
                <span className="text-red-500 font-semibold">🔑 Paid student access:</span> Use your registered email, and your registered phone number as the password.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="max-w-md mx-auto">
            <div className="bg-black/80 border border-red-600/30 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
              <p className="text-gray-400 text-sm mb-8">Access your learning dashboard</p>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                </div>



                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 cursor-disabled flex items-center justify-center gap-2 group"
                >
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Benefits */}
                <div className="pt-4 border-t border-gray-700 space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">What you get:</p>
                  <p className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="text-red-600 mt-1">✓</span>
                    <span>Access all 54+ episodes</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="text-red-600 mt-1">✓</span>
                    <span>Source code & CAD files</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="text-red-600 mt-1">✓</span>
                    <span>Live community access</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="text-red-600 mt-1">✓</span>
                    <span>Career mentorship</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Back to Home */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Not a member?{" "}
              <Link href="/" className="text-red-600 hover:text-red-500 font-semibold">
                Go back to website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

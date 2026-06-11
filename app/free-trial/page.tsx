"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle, Mail, Phone, User, GraduationCap, MapPin, Calendar, BookOpen, Brain, Sparkles, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

const steps = [
  { id: 1, title: "Personal Info", subtitle: "Let's get to know you" },
  { id: 2, title: "Contact Details", subtitle: "How we'll reach you" },
  { id: 3, title: "Background", subtitle: "Customize your experience" },
  { id: 4, title: "Generating Credentials", subtitle: "Setting up your trial" },
]

export default function FreeTrialPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    whatsapp: "",
    email: "",
    college: "",
    course: "",
    experience: "Beginner",
  })

  // Simulated credential screen data
  const [credentialsGenerated, setCredentialsGenerated] = useState(false)

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!formData.name || !formData.age || !formData.city) {
        setErrorMsg("Please fill in all personal details.")
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.whatsapp || !formData.email) {
        setErrorMsg("Please provide your contact details.")
        return
      }
      if (!formData.email.includes("@")) {
        setErrorMsg("Please provide a valid email.")
        return
      }
    }
    if (currentStep === 3) {
      if (!formData.college || !formData.course) {
        setErrorMsg("Please fill in your background details.")
        return
      }
    }

    setErrorMsg("")
    setCurrentStep(prev => prev + 1)

    if (currentStep === 3) {
      submitTrialRegistration()
    }
  }

  const handlePrev = () => {
    setErrorMsg("")
    setCurrentStep(prev => prev - 1)
  }

  const submitTrialRegistration = async () => {
    setIsSubmitting(true)
    
    try {
      // 1. Create Trial Profile for Admin Panel storage
      const trialProfile = {
        ...formData,
        timestamp: new Date().toISOString(),
        status: "Active",
        tier: "Free Trial"
      }
      
      const storedProfiles = localStorage.getItem("roboflix_trial_profiles")
      const profiles = storedProfiles ? JSON.parse(storedProfiles) : []
      profiles.push(trialProfile)
      localStorage.setItem("roboflix_trial_profiles", JSON.stringify(profiles))

      // 2. Insert into LMS Users for Auth Access
      const lmsUser = {
        email: formData.email,
        phone: "demo",
        status: "Active",
        tier: "Free Trial"
      }

      if (isSupabaseConfigured()) {
        try {
          await supabase.from("roboflix_lms_users").upsert([lmsUser], { onConflict: "email" })
        } catch (e) {
          console.error("Supabase upsert failed, continuing with local storage", e)
        }
      }

      const storedLmsUsers = localStorage.getItem("roboflix_lms_users")
      const lmsUsersList = storedLmsUsers ? JSON.parse(storedLmsUsers) : []
      const existingIdx = lmsUsersList.findIndex((u: any) => u.email === formData.email)
      if (existingIdx > -1) {
        lmsUsersList[existingIdx] = lmsUser
      } else {
        lmsUsersList.push(lmsUser)
      }
      localStorage.setItem("roboflix_lms_users", JSON.stringify(lmsUsersList))

      // Simulate network delay for "Generating Credentials" effect
      setTimeout(() => {
        setIsSubmitting(false)
        setCredentialsGenerated(true)
      }, 3000)

    } catch (err) {
      setErrorMsg("An error occurred. Please try again.")
      setCurrentStep(3)
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                    placeholder="19"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                    placeholder="New Delhi"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="+91 9876543210"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">We will send your login credentials to this number.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="hello@example.com"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Used as your LMS username.</p>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">College / University *</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. IIT Bombay"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Course / Branch *</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g. B.Tech Electronics"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <div className="relative">
                <Brain className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none appearance-none"
                >
                  <option value="Beginner">Beginner (No coding/hardware experience)</option>
                  <option value="Intermediate">Intermediate (Done some Arduino/Coding)</option>
                  <option value="Advanced">Advanced (Built custom PCBs/Robots)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center space-y-6"
          >
            {isSubmitting ? (
              <>
                <div className="w-20 h-20 border-4 border-gray-800 border-t-red-500 rounded-full animate-spin"></div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Setting up your Trial</h3>
                  <p className="text-gray-400">Generating secure credentials and provisioning your virtual lab...</p>
                </div>
              </>
            ) : credentialsGenerated ? (
              <>
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome to Roboflix!</h3>
                  <p className="text-gray-400 mb-6">Your Free Trial account has been successfully created. Use the credentials below to log in immediately.</p>
                  
                  <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-2xl text-left space-y-4 max-w-sm mx-auto mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full"></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Username (Email)</p>
                      <p className="text-white font-mono font-medium text-lg">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Password</p>
                      <p className="text-white font-mono font-medium text-lg">demo</p>
                    </div>
                  </div>

                  <Link href="/lms/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-1">
                    Login to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </>
            ) : null}
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans selection:bg-red-500/30">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-600/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-600/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 lg:px-12 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white tracking-tighter flex items-center gap-2">
          ROBO<span className="text-red-600">FLIX</span>
        </Link>
        {currentStep < 4 && (
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">
          {currentStep < 4 && (
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                7-Day Free Trial
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Join the Revolution.</h1>
              <p className="text-gray-400 text-lg">Experience the future of hardware learning.</p>
            </div>
          )}

          <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {currentStep < 4 && (
              <>
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 rounded-full z-0"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 rounded-full z-0 transition-all duration-500" 
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  ></div>
                  
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step < currentStep 
                          ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                          : step === currentStep
                          ? "bg-black border-2 border-red-500 text-red-500"
                          : "bg-black border border-gray-700 text-gray-500"
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-1">{steps[currentStep - 1].title}</h2>
                  <p className="text-gray-400">{steps[currentStep - 1].subtitle}</p>
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Error Message */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mt-6 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {errorMsg}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-800">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 font-semibold rounded-xl transition-colors ${
                    currentStep === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  {currentStep === 3 ? "Complete Registration" : "Continue"}
                  {currentStep === 3 ? <Send className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

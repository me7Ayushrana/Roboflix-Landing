import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"

export function CtaSection() {
  return (
    <section className="px-4 sm:px-6 py-24 bg-gradient-to-b from-red-950/20 to-black/60">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to <span className="text-red-600">Build Your First Robot?</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-400 mb-10 text-balance">
          Join 500+ students who are already building. Start with just ₹989. Learn forever. Cancel anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="#pricing" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 text-lg shadow-lg shadow-red-600/50">
              Join Now
            </button>
          </Link>
          <Link
            href="#"
            className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-sm sm:text-base font-semibold text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-lg hover:border-red-600 w-full sm:w-auto"
          >
            <span>Join Discord Community</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}

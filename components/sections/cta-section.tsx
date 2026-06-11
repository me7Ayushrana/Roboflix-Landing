import Link from "next/link"
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
        <div className="flex items-center justify-center">
          <Link href="#pricing" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 text-lg shadow-lg shadow-red-600/50">
              Join Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

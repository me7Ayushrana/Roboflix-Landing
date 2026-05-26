import { Check } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Test Drive",
    description: "Explore before committing.",
    highlighted: false,
    initialPrice: "₹598",
    initialPeriod: "for 15 days",
    label: "Best for curious beginners",
    features: [
      "Access first 5 episodes",
      "Try real robotics projects",
      "Full source code access",
      "Join the builder community",
      "Watch on any device",
      "Cancel anytime",
    ],
    cta: "Join Now",
    ctaLink: "https://rzp.io/rzp/iTDIyAC",
  },
  {
    name: "Builder Path",
    description: "For serious builders ready to grow.",
    highlighted: true,
    initialPrice: "₹989",
    initialPeriod: "for your first month",
    continuingPrice: "₹299",
    continuingPeriod: "/month",
    bestFor: "Most Popular",
    features: [
      "Everything in Test Drive",
      "New episodes every month",
      "CAD files & documentation",
      "Component buying links",
      "Weekly live Q&A sessions",
      "Internship & job opportunities",
      "Career guidance & mentorship",
      "Priority community support",
    ],
    cta: "Join Now",
    ctaLink: "https://rzp.io/rzp/roboflix",
  },
  {
    name: "Lifetime Access",
    description: "Pay once, learn forever.",
    highlighted: false,
    price: "₹9,899",
    period: "one-time",
    label: "Best for long-term learners",
    features: [
      "Everything in Builder Path",
      "All 54+ episodes forever",
      "All future seasons included",
      "Complete CAD & source files",
      "Lifetime community access",
      "Career mentorship forever",
      "Priority support lifetime",
      "No monthly payments ever",
    ],
    cta: "Join Now",
    ctaLink: "https://rzp.io/rzp/TUJFI5Sj",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 sm:px-6 py-24 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-red-600 uppercase tracking-wider mb-4">Three Simple Choices</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Path to Learning
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-balance text-lg">
            Try it first. Or dive in monthly. Or own it forever. Pick what works for you.
          </p>
        </div>

        {/* 3-Tier Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {pricingPlans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`rounded-2xl border flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-red-600/15 to-red-600/5 border-red-600 shadow-2xl shadow-red-600/20 p-8 md:scale-105 md:z-10"
                  : "bg-black/40 border-gray-700 hover:border-red-600/40 p-8"
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="mb-6 inline-block">
                  <span className="text-xs font-bold text-red-600 bg-red-600/20 px-4 py-2 rounded-full uppercase tracking-widest">
                    {plan.bestFor}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              {/* Label if exists */}
              {plan.label && !plan.highlighted && (
                <p className="text-xs text-gray-500 mb-4 italic">{plan.label}</p>
              )}

              {/* Pricing */}
              <div className="mb-8 pb-8 border-b border-gray-700/50">
                {plan.initialPrice ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl md:text-6xl font-bold text-white">
                        {plan.initialPrice}
                      </span>
                      <span className="text-gray-500 text-sm">{plan.initialPeriod}</span>
                    </div>
                    {plan.highlighted && (
                      <div className="inline-block px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-sm">
                        <p className="text-sm text-white font-semibold">
                          Then <span className="text-white font-bold text-lg">{plan.continuingPrice}</span><span className="text-white">{plan.continuingPeriod}</span> after
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-4 px-6 text-center rounded-lg font-bold text-base transition-all ${
                  plan.highlighted
                    ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/50"
                    : "bg-red-600/10 text-red-600 hover:bg-red-600/20 border border-red-600/30"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            All subscription plans can be cancelled anytime. <span className="text-red-600 font-semibold">No questions asked.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

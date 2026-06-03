import { Navbar } from "@/components/ui/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { SeasonCarouselSection } from "@/components/sections/season-carousel-section"
import { InstructorSection } from "@/components/sections/instructor-section"
import { ProblemSection } from "@/components/sections/problem-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { CurriculumSection } from "@/components/sections/curriculum-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { PlatformFeaturesSection } from "@/components/sections/platform-features-section"
import { ImpactSection } from "@/components/sections/impact-section"
import { HarshRajSection } from "@/components/sections/harsh-raj-section"
import { ValueStackSection } from "@/components/sections/value-stack-section"
import { HardwareSection } from "@/components/sections/hardware-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { VividSuccessSection } from "@/components/sections/vivid-success-section"
import { FAQSection } from "@/components/sections/faq-section"
import { CtaSection } from "@/components/sections/cta-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <SeasonCarouselSection />
      <InstructorSection />
      <ProblemSection />
      <HowItWorksSection />
      <CurriculumSection />
      <FeaturesSection />
      <PlatformFeaturesSection />
      <HarshRajSection />
      <ValueStackSection />
      <HardwareSection />
      <PricingSection />
      <VividSuccessSection />
      <FAQSection />
      <CtaSection />
      <FooterSection />
    </main>
  )
}

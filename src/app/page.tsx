import HeroSlider from "@/components/home/HeroSlider"
import HeroCopy from "@/components/home/HeroCopy"
import HeroStatsPanel from "@/components/home/HeroStatsPanel"
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection"
import IndustriesSection from "@/components/home/IndustriesSection"
import VisaTypesSection from "@/components/home/VisaTypesSection"
import WhyUsSection from "@/components/home/WhyUsSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import CtaSection from "@/components/home/CTASection"

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section aria-label="Hero" className="relative overflow-hidden bg-slate-900 pb-24 pt-20 text-white">
        <HeroSlider />

        {/* Grid lines overlay */}
        <div className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-20 mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-12">
          <HeroCopy />
          <div className="w-full shrink-0 lg:w-80 xl:w-96">
            <HeroStatsPanel />
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48h1440V24C1200 8 960 0 720 0S240 8 0 24v24z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Featured Jobs ─────────────────────────────────────────────────────── */}
      <FeaturedJobsSection />

      {/* ── Browse by Industry ────────────────────────────────────────────────── */}
      <IndustriesSection />

      {/* ── Visa Types ────────────────────────────────────────────────────────── */}
      <VisaTypesSection />

      {/* ── Why JOB-KR ────────────────────────────────────────────────────────── */}
      <WhyUsSection />

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── CTA + Employers strip + Footer ────────────────────────────────────── */}
      <CtaSection />

    </main>
  )
}

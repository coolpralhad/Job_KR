"use client"

import Link from "next/link"
import { useSpring, useTrail, useSprings, useInView, animated, config } from "@react-spring/web"
import { UserCircle2, SearchCheck, ClipboardCheck, ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

const steps = [
  {
    num:   "01",
    icon:  UserCircle2,
    title: "Create Your Profile",
    desc:  "Set your visa type, skills, TOPIK level, and preferred industries. Takes 3 minutes.",
    from:  "#2563eb", to: "#6366f1",
    detail: ["Visa type selection", "TOPIK level", "Preferred city & industry"],
  },
  {
    num:   "02",
    icon:  SearchCheck,
    title: "Find Visa-Matched Jobs",
    desc:  "Browse or search. Filter by city, salary, TOPIK level. AI shows your fit score instantly.",
    from:  "#059669", to: "#0d9488",
    detail: ["AI match scoring", "Salary & city filters", "TOPIK level filter"],
  },
  {
    num:   "03",
    icon:  ClipboardCheck,
    title: "Apply & Track",
    desc:  "One-click apply with your saved profile. Track every application in your dashboard.",
    from:  "#9333ea", to: "#ec4899",
    detail: ["One-click apply", "Document upload", "Application tracker"],
  },
]

export default function HowItWorksSection() {
  const [headerRef, headerInView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const { t } = useLang()

  const headerTrail = useTrail(3, {
    from: { opacity: 0, y: 20 },
    to: headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    config: { tension: 210, friction: 22 },
  })

  const [cardsRef, cardsInView] = useInView({ once: true, rootMargin: "-60px 0px" })

  const cardSprings = useSprings(3, steps.map((_, i) => ({
    from: { opacity: 0, y: 36, scale: 0.96 },
    to: cardsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.96 },
    delay: i * 120,
    config: { tension: 185, friction: 22 },
  })))

  const connectorSpring = useSpring({
    from: { scaleX: 0 },
    to: cardsInView ? { scaleX: 1 } : { scaleX: 0 },
    delay: 200,
    config: { tension: 80, friction: 22 },
  })

  return (
    <section className="relative overflow-hidden bg-gray-950 py-24 text-white">

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 translate-x-1/2 rounded-full bg-violet-600 opacity-10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="mb-14 text-center">
          <animated.p style={{ opacity: headerTrail[0].opacity, transform: headerTrail[0].y.to(y => `translateY(${y}px)`) }}
            className="mb-2 text-sm font-bold uppercase tracking-widest text-white/50">
            {t.howItWorks.eyebrow}
          </animated.p>
          <animated.h2 style={{ opacity: headerTrail[1].opacity, transform: headerTrail[1].y.to(y => `translateY(${y}px)`) }}
            className="text-3xl font-extrabold sm:text-4xl">
            {t.howItWorks.title}
          </animated.h2>
          <animated.p style={{ opacity: headerTrail[2].opacity, transform: headerTrail[2].y.to(y => `translateY(${y}px)`) }}
            className="mt-2 text-gray-400">
            {t.howItWorks.subtitle}
          </animated.p>
        </div>

        {/* Steps */}
        <div ref={cardsRef} className="relative grid gap-6 sm:grid-cols-3">

          {/* Connecting line */}
          <div className="absolute left-1/2 top-14 hidden -translate-x-1/2 sm:block" style={{ width: "calc(66.6% - 2rem)" }}>
            <div className="h-px overflow-hidden rounded-full bg-white/10">
              <animated.div
                style={{ scaleX: connectorSpring.scaleX, transformOrigin: "left", height: "1px", background: "linear-gradient(to right, #2563eb, #9333ea)" }}
              />
            </div>
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <animated.div key={step.num}
                style={{
                  opacity:   cardSprings[i].opacity,
                  transform: cardSprings[i].y.to(y => `translateY(${y}px)`),
                }}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                {/* Top accent */}
                <div className="h-1" style={{ background: `linear-gradient(to right, ${step.from}, ${step.to})` }} />

                <div className="flex flex-1 flex-col gap-5 p-6">
                  {/* Step number + icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${step.from}, ${step.to})` }}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-5xl font-black text-white/8 leading-none select-none">{step.num}</span>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base font-extrabold text-white">{t.howItWorks.steps[i]?.title ?? step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{t.howItWorks.steps[i]?.desc ?? step.desc}</p>
                  </div>

                  {/* Feature checklist */}
                  <ul className="mt-auto space-y-1.5">
                    {step.detail.map(d => (
                      <li key={d} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: step.from }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </animated.div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/40 transition-all hover:brightness-110 hover:shadow-xl">
            {t.howItWorks.startFree} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

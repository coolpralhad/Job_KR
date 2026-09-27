"use client"

import Link from "next/link"
import { useState } from "react"
import { useSpring, useTrail, useSprings, useInView, animated, config } from "@react-spring/web"
import { ArrowUpRight, Briefcase } from "lucide-react"
import { jobs } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

const visaTypes = [
  {
    code:  "E-7",
    name:  "Specialist Employment",
    who:   "Skilled professionals sponsored by a Korean company",
    from:  "#2563eb", to: "#6366f1",
    light: "#eff6ff", dark: "#1d4ed8",
  },
  {
    code:  "E-9",
    name:  "Non-professional Employment",
    who:   "Factory, farm & fishery workers via EPS system",
    from:  "#059669", to: "#16a34a",
    light: "#f0fdf4", dark: "#15803d",
  },
  {
    code:  "H-2",
    name:  "Work & Visit",
    who:   "Ethnic Koreans from CIS/China aged 18–60",
    from:  "#d97706", to: "#f59e0b",
    light: "#fffbeb", dark: "#b45309",
  },
  {
    code:  "F-4",
    name:  "Overseas Korean",
    who:   "Korean nationals & descendants living abroad",
    from:  "#9333ea", to: "#ec4899",
    light: "#fdf4ff", dark: "#7e22ce",
  },
  {
    code:  "F-6",
    name:  "Marriage Migrant",
    who:   "Spouse of a Korean national or permanent resident",
    from:  "#db2777", to: "#f43f5e",
    light: "#fef2f2", dark: "#be185d",
  },
  {
    code:  "D-10",
    name:  "Job Seeker Visa",
    who:   "Graduates & professionals actively seeking work",
    from:  "#0ea5e9", to: "#2563eb",
    light: "#f0f9ff", dark: "#0369a1",
  },
]

function AnimatedCount({ value }: { value: number }) {
  const [ref, inView] = useInView({ once: true })
  const spring = useSpring({
    from: { val: 0 },
    to:   { val: inView ? value : 0 },
    config: { ...config.molasses, duration: 800 },
  })
  return (
    <animated.span ref={ref}>
      {spring.val.to(v => Math.floor(v))}
    </animated.span>
  )
}

function VisaCard({ visa, index }: { visa: typeof visaTypes[number]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { t } = useLang()
  const count = jobs.filter(j => j.visaTypes.includes(visa.code as any)).length

  const [ref, inView] = useInView({ once: true, rootMargin: "-50px 0px" })

  const entrance = useSpring({
    from: { opacity: 0, y: 32, scale: 0.96 },
    to: inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.96 },
    delay: index * 90,
    config: { tension: 190, friction: 22 },
  })

  const hover = useSpring({
    y:     hovered ? -6 : 0,
    scale: hovered ? 1.02 : 1,
    config: config.wobbly,
  })

  const stripe = useSpring({
    height: hovered ? "6px" : "4px",
    config: { tension: 260, friction: 20 },
  })

  const arrow = useSpring({
    opacity:   hovered ? 1 : 0,
    x:         hovered ? 0 : -8,
    config: config.stiff,
  })

  return (
    <animated.div
      ref={ref}
      style={{
        opacity:   entrance.opacity,
        transform: entrance.y.to((y) => `translateY(${y}px) scale(1)`),
      }}
    >
      <Link href={`/jobs?visa=${visa.code}`}>
        <animated.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            transform:  hover.y.to(y => `translateY(${y}px) scale(${1})`),
            boxShadow:  hovered ? `0 20px 48px ${visa.from}44` : "0 2px 12px rgba(0,0,0,0.08)",
            transition: "box-shadow 0.35s ease",
          }}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
        >
          {/* Colour stripe */}
          <animated.div
            style={{ ...stripe, background: `linear-gradient(to right, ${visa.from}, ${visa.to})` }}
          />

          <div className="flex flex-1 flex-col gap-4 p-5">
            {/* Top row: big code + arrow */}
            <div className="flex items-start justify-between">
              <div>
                <span className="block text-3xl font-black tracking-tight"
                  style={{ background: `linear-gradient(135deg, ${visa.from}, ${visa.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {visa.code}
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-widest"
                  style={{ color: visa.dark }}>
                  {visa.name}
                </span>
              </div>
              <animated.div
                style={{ opacity: arrow.opacity, transform: arrow.x.to(x => `translateX(${x}px)`), background: `${visa.from}18` }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              >
                <ArrowUpRight className="h-4 w-4" style={{ color: visa.from }} />
              </animated.div>
            </div>

            {/* Who it's for */}
            <p className="flex-1 text-sm leading-relaxed text-gray-500">{visa.who}</p>

            {/* Footer: job count */}
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: `${visa.from}10` }}>
              <Briefcase className="h-3.5 w-3.5 shrink-0" style={{ color: visa.from }} />
              <span className="text-xs font-bold" style={{ color: visa.dark }}>
                <AnimatedCount value={count} /> {t.visaTypes.jobs}
              </span>
            </div>
          </div>
        </animated.div>
      </Link>
    </animated.div>
  )
}

export default function VisaTypesSection() {
  const [headerRef, inView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const { t } = useLang()

  const trail = useTrail(3, {
    from: { opacity: 0, y: 18 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    config: { tension: 210, friction: 22 },
  })

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20">

      {/* subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="mb-10 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <animated.p style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}
              className="mb-1 text-sm font-bold uppercase tracking-widest text-blue-600">
              {t.visaTypes.eyebrow}
            </animated.p>
            <animated.h2 style={{ opacity: trail[1].opacity, transform: trail[1].y.to(y => `translateY(${y}px)`) }}
              className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t.visaTypes.title}
            </animated.h2>
            <animated.p style={{ opacity: trail[2].opacity, transform: trail[2].y.to(y => `translateY(${y}px)`) }}
              className="mt-1 text-gray-500">
              {t.visaTypes.subtitle}
            </animated.p>
          </div>
          <animated.div style={{ opacity: trail[2].opacity }}>
            <Link href="/visa-guide"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900 sm:flex">
              {t.visaTypes.fullGuide} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </animated.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {visaTypes.map((v, i) => (
            <VisaCard key={v.code} visa={v} index={i} />
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/visa-guide"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900">
            {t.visaTypes.fullGuide} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

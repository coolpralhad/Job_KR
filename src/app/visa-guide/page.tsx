"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  useSpring, useTrail, useSprings, useChain,
  useSpringRef, animated, config,
} from "@react-spring/web"
import { useInView } from "@react-spring/web"
import {
  AlertTriangle, ArrowRight, Briefcase, CheckCircle2,
  Clock, Info, Search, Shield, Star, Users, Zap, X,
} from "lucide-react"
import { useLang } from "@/lib/i18n/context"

// ── Data ──────────────────────────────────────────────────────────────────────

type VisaCategory = "Work" | "Residency" | "Family" | "Job-seeker"

interface Visa {
  code:         string
  name:         string
  category:     VisaCategory
  gradient:     string
  from:         string   // spring color start
  to:           string   // spring color end
  bg:           string
  text:         string
  dot:          string
  duration:     string
  description:  string
  eligible:     string[]
  notes:        string
  canJobFilter: boolean
}

const visas: Visa[] = [
  {
    code: "E-7", name: "Specially Designated Activities", category: "Work",
    gradient: "from-blue-500 to-indigo-600", from: "#3b82f6", to: "#4f46e5",
    bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500",
    duration: "Up to 3 years (renewable)",
    description: "For professionally skilled foreign workers in designated industries. Employer must be approved and job role must appear on the government's designated activity list.",
    eligible: ["IT professionals & software engineers", "Engineers & technicians", "Healthcare workers", "Translators & interpreters", "Skilled specialists in approved fields"],
    notes: "Employer sponsorship required. One of the most common work visas for white-collar foreign workers in Korea.",
    canJobFilter: true,
  },
  {
    code: "E-9", name: "Non-professional Employment", category: "Work",
    gradient: "from-emerald-500 to-teal-600", from: "#10b981", to: "#0d9488",
    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500",
    duration: "Up to 3 years (extendable to 4 yrs 10 mo)",
    description: "For non-professional workers in manufacturing, agriculture, fishing, and construction under the Employment Permit System (EPS).",
    eligible: ["Factory & manufacturing workers", "Agricultural & livestock workers", "Construction workers", "Fishery industry workers"],
    notes: "Must pass Korean language test (EPS-TOPIK). Applications go through the official EPS system in your home country.",
    canJobFilter: true,
  },
  {
    code: "H-2", name: "Working Visit", category: "Work",
    gradient: "from-amber-400 to-orange-500", from: "#f59e0b", to: "#f97316",
    bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500",
    duration: "Up to 3 years",
    description: "For ethnic Koreans with foreign nationality (overseas Koreans). Allows work in designated fields without needing a specific employer sponsor before entry.",
    eligible: ["Ethnic Koreans with foreign nationality", "Eligible nationalities: China, CIS countries & others"],
    notes: "More flexible than E-9 — no employer sponsorship required before arrival.",
    canJobFilter: true,
  },
  {
    code: "F-4", name: "Overseas Korean", category: "Residency",
    gradient: "from-purple-500 to-violet-600", from: "#a855f7", to: "#7c3aed",
    bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500",
    duration: "Up to 3 years (multiple renewals)",
    description: "For ethnic Koreans with foreign nationality holding Korean citizenship or descendants of Korean nationals. Offers very broad work rights with minimal restrictions.",
    eligible: ["Overseas Koreans with foreign nationality", "Descendants of Korean nationals"],
    notes: "Cannot work in certain low-skilled industries, but otherwise has nearly unrestricted work rights.",
    canJobFilter: true,
  },
  {
    code: "F-6", name: "Marriage Migrant", category: "Family",
    gradient: "from-pink-500 to-rose-600", from: "#ec4899", to: "#e11d48",
    bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500",
    duration: "1–2 years initially (renewable)",
    description: "For foreign spouses of Korean nationals. Grants full work authorisation with no restriction on the type of employment.",
    eligible: ["Foreign spouses of Korean citizens"],
    notes: "No restriction on type of employment. Pathway to F-2 and eventually F-5 permanent residency.",
    canJobFilter: true,
  },
  {
    code: "D-10", name: "Job Seeker", category: "Job-seeker",
    gradient: "from-orange-500 to-red-500", from: "#f97316", to: "#ef4444",
    bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500",
    duration: "6 months (extendable to 1 year)",
    description: "Allows professionals and graduates to stay in Korea while actively searching for a job. Paid work is not permitted on this visa.",
    eligible: ["Korean university graduates", "Overseas university graduates", "Professionals with relevant work experience"],
    notes: "Work is not permitted until you convert to a work visa (typically E-7). Use this time to find an employer.",
    canJobFilter: false,
  },
  {
    code: "F-2", name: "Long-term Resident", category: "Residency",
    gradient: "from-amber-500 to-yellow-500", from: "#f59e0b", to: "#eab308",
    bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500",
    duration: "1–3 years (renewable)",
    description: "Long-term residency for those who have lived in Korea for an extended period. Full work authorisation across nearly all fields.",
    eligible: ["Long-term E-7 holders after 5+ years", "Qualifying family members", "Point-based system qualifiers"],
    notes: "Typically issued after several years under another visa. Stepping stone to F-5 permanent residency.",
    canJobFilter: true,
  },
  {
    code: "F-5", name: "Permanent Resident", category: "Residency",
    gradient: "from-indigo-500 to-purple-600", from: "#6366f1", to: "#9333ea",
    bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500",
    duration: "Permanent (re-register every 5 years)",
    description: "Permanent residency in Korea. Unrestricted work rights across all industries and occupations.",
    eligible: ["Long-term E-7 holders (5+ yrs, points)", "TOPIK Level 4+ holders", "F-2 visa upgrade path", "Investors & highly skilled workers"],
    notes: "No employment restrictions whatsoever. Highest level of stability for foreign workers in Korea.",
    canJobFilter: true,
  },
]

const categoryConfig: Record<VisaCategory, { bg: string; text: string; label: string }> = {
  "Work":       { bg: "bg-blue-100",   text: "text-blue-700",   label: "Work Visa"   },
  "Residency":  { bg: "bg-purple-100", text: "text-purple-700", label: "Residency"   },
  "Family":     { bg: "bg-pink-100",   text: "text-pink-700",   label: "Family"      },
  "Job-seeker": { bg: "bg-orange-100", text: "text-orange-700", label: "Job-seeker"  },
}

const pathways = [
  { label: "Manufacturing route", steps: ["E-9", "F-2", "F-5"], color: "#10b981" },
  { label: "Professional route",  steps: ["D-10", "E-7", "F-2", "F-5"], color: "#3b82f6" },
  { label: "Overseas Korean",     steps: ["H-2 / F-4", "F-2", "F-5"], color: "#a855f7" },
  { label: "Family route",        steps: ["F-6", "F-2", "F-5"], color: "#ec4899" },
]

// ── Animated Stat Counter ─────────────────────────────────────────────────────

function AnimatedStat({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  const [ref, inView] = useInView({ once: true })
  const spring = useSpring({
    from: { val: 0 },
    to:   { val: inView ? value : 0 },
    config: { ...config.molasses, duration: 900 },
  })

  return (
    <div ref={ref} className="flex items-center gap-2">
      {icon}
      <div>
        <animated.span className="text-xl font-extrabold text-white">
          {spring.val.to(v => Math.floor(v))}
        </animated.span>
        <span className="ml-1.5 text-xs text-gray-400">{label}</span>
      </div>
    </div>
  )
}

// ── Visa Card ─────────────────────────────────────────────────────────────────

function VisaCard({ visa, index }: { visa: Visa; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered,  setHovered]  = useState(false)
  const { t } = useLang()
  const cat = categoryConfig[visa.category]
  const badgeLabels: Record<VisaCategory, string> = {
    "Work":       t.visaGuide.badges.work,
    "Residency":  t.visaGuide.badges.residency,
    "Family":     t.visaGuide.badges.family,
    "Job-seeker": t.visaGuide.badges.jobseeker,
  }

  // Card entrance — trails in from parent
  const [ref, inView] = useInView({ once: true, rootMargin: "-60px 0px" })

  // Hover spring — card lifts + shadow blooms
  const hoverSpring = useSpring({
    transform: hovered ? "translateY(-8px) scale(1.015)" : "translateY(0px) scale(1)",
    boxShadow: hovered
      ? "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)"
      : "0 2px 8px rgba(0,0,0,0.06)",
    config: config.wobbly,
  })

  // Entrance spring
  const entranceSpring = useSpring({
    from: { opacity: 0, transform: "translateY(40px) scale(0.96)" },
    to: inView
      ? { opacity: 1, transform: "translateY(0px) scale(1)" }
      : { opacity: 0, transform: "translateY(40px) scale(0.96)" },
    delay: index * 80,
    config: { tension: 200, friction: 22 },
  })

  // Notes expand spring
  const expandSpring = useSpring({
    maxHeight: expanded ? "120px" : "0px",
    opacity:   expanded ? 1 : 0,
    config: { tension: 280, friction: 24 },
  })

  // Stripe spring — brightens on hover
  const stripeSpring = useSpring({
    opacity: hovered ? 1 : 0.85,
    height:  hovered ? "6px" : "4px",
    config: { tension: 300, friction: 20 },
  })

  // Badge scale spring on hover
  const badgeSpring = useSpring({
    transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0deg)",
    config: config.wobbly,
  })

  return (
    <animated.div
      ref={ref}
      style={{ ...entranceSpring, ...hoverSpring }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white cursor-default"
    >
      {/* Spring-animated colour stripe */}
      <animated.div
        style={{ ...stripeSpring, background: `linear-gradient(to right, ${visa.from}, ${visa.to})` }}
        className="w-full shrink-0"
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Spring badge */}
            <animated.div
              style={{ background: `linear-gradient(135deg, ${visa.from}, ${visa.to})`, ...badgeSpring }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-md"
            >
              {visa.code}
            </animated.div>
            <div>
              <h2 className="font-bold text-gray-900 leading-snug">{visa.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cat.bg} ${cat.text}`}>
                  {badgeLabels[visa.category]}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock className="h-3 w-3" />{visa.duration}
                </span>
              </div>
            </div>
          </div>
          <span className={`shrink-0 rounded-lg border px-2 py-1 text-xs font-extrabold ${visa.bg} ${visa.text}`}
            style={{ borderColor: visa.from + "33" }}>
            {visa.code}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-gray-600">{visa.description}</p>

        {/* Who can apply */}
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.visaGuide.card.whoCanApply}</p>
          <ul className="space-y-1.5">
            {visa.eligible.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${visa.dot}`} />
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          className={`mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${visa.bg} ${visa.text}`}
        >
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 font-medium">
            {expanded ? t.visaGuide.card.hideNote : t.visaGuide.card.importantNote}
          </span>
          <span className="shrink-0 font-bold">{expanded ? "▲" : "▼"}</span>
        </button>
        <animated.div style={expandSpring} className="overflow-hidden">
          <p className={`px-3 pt-2 pb-1 text-xs leading-relaxed ${visa.text}`}>{visa.notes}</p>
        </animated.div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5" />{t.visaGuide.card.immigration}
          </div>
          {visa.canJobFilter ? (
            <Link href={`/jobs?visa=${visa.code}`}>
              <animated.span
                style={{ background: `linear-gradient(to right, ${visa.from}, ${visa.to})` }}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-md"
              >
                <Briefcase className="h-3.5 w-3.5" />
                {t.visaGuide.card.findJobs} <ArrowRight className="h-3 w-3" />
              </animated.span>
            </Link>
          ) : (
            <span className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-medium text-orange-600">
              {t.visaGuide.card.workNotPermitted}
            </span>
          )}
        </div>
      </div>
    </animated.div>
  )
}

// ── Pathway Step ──────────────────────────────────────────────────────────────

function PathwayRow({ pathway, index }: { pathway: typeof pathways[number]; index: number }) {
  const { t } = useLang()
  const pathwayLabels: Record<string, string> = {
    "Manufacturing route": t.visaGuide.pathways.manufacturing,
    "Professional route":  t.visaGuide.pathways.professional,
    "Overseas Korean":     t.visaGuide.pathways.korean,
    "Family route":        t.visaGuide.pathways.family,
  }
  const [ref, inView] = useInView({ once: true })

  const trail = useTrail(pathway.steps.length, {
    from: { opacity: 0, x: -20 },
    to:   inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 },
    delay: index * 100,
    config: { tension: 280, friction: 22 },
  })

  return (
    <div ref={ref} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm">
      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: pathway.color }} />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-600">{pathwayLabels[pathway.label] ?? pathway.label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          {trail.map((style, i) => (
            <animated.span key={i} style={style} className="flex items-center gap-1">
              <span className="rounded-md px-1.5 py-0.5 text-xs font-bold" style={{ color: pathway.color, background: pathway.color + "18" }}>
                {pathway.steps[i]}
              </span>
              {i < pathway.steps.length - 1 && (
                <span className="text-gray-300 text-xs">→</span>
              )}
            </animated.span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Floating Orbs background ──────────────────────────────────────────────────

function HeroOrbs() {
  const orbs = [
    { color: "#3b82f6", size: 320, x: -160, y: -80,  delay: 0    },
    { color: "#7c3aed", size: 256, x: "60%", y: -40,  delay: 200  },
    { color: "#10b981", size: 200, x: "40%", y: "60%", delay: 400 },
  ]

  const springs = useSprings(orbs.length, orbs.map((o, i) => ({
    from: { opacity: 0, scale: 0.6 },
    to:   { opacity: 1, scale: 1 },
    delay: o.delay,
    config: { tension: 60, friction: 18 },
  })))

  return (
    <>
      {orbs.map((orb, i) => (
        <animated.div
          key={i}
          style={{
            ...springs[i],
            position: "absolute",
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            borderRadius: "50%",
            background: orb.color,
            opacity: springs[i].opacity.to(v => v * 0.18),
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const categories = ["All", "Work", "Residency", "Family", "Job-seeker"] as const

export default function VisaGuidePage() {
  const { t } = useLang()
  const tabLabels: Record<typeof categories[number], string> = {
    "All":        t.visaGuide.categories.all,
    "Work":       t.visaGuide.categories.work,
    "Residency":  t.visaGuide.categories.residency,
    "Family":     t.visaGuide.categories.family,
    "Job-seeker": t.visaGuide.categories.jobseeker,
  }
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All")
  const [query, setQuery] = useState("")

  const filtered = visas.filter(v => {
    if (activeCategory !== "All" && v.category !== activeCategory) return false
    if (query) {
      const q = query.toLowerCase()
      return v.code.toLowerCase().includes(q) || v.name.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
    }
    return true
  })

  // Hero title trail
  const heroTrail = useTrail(3, {
    from: { opacity: 0, y: 24 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 220, friction: 22 },
  })

  // Filter tab springs — one per category
  const tabSprings = useSprings(categories.length, categories.map(cat => ({
    background: activeCategory === cat ? "#111827" : "#ffffff",
    color:      activeCategory === cat ? "#ffffff" : "#6b7280",
    scale:      activeCategory === cat ? 1.05 : 1,
    config: config.stiff,
  })))

  // CTA banner spring
  const [ctaRef, ctaInView] = useInView({ once: true })
  const ctaSpring = useSpring({
    from: { opacity: 0, y: 32 },
    to:   ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    config: { tension: 160, friction: 20 },
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-900 pb-12 pt-12 text-white">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <HeroOrbs />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">

          {/* Trail-animated hero content */}
          <animated.div style={{ opacity: heroTrail[0].opacity, transform: heroTrail[0].y.to(y => `translateY(${y}px)`) }}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              {visas.length} visa types · always up to date
            </div>
          </animated.div>

          <animated.div style={{ opacity: heroTrail[1].opacity, transform: heroTrail[1].y.to(y => `translateY(${y}px)`) }}>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{t.visaGuide.title}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-300">
              {t.visaGuide.subtitle}
            </p>
          </animated.div>

          <animated.div style={{ opacity: heroTrail[2].opacity, transform: heroTrail[2].y.to(y => `translateY(${y}px)`) }} className="mt-5">
            {/* Disclaimer */}
            <div className="mb-5 inline-flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t.visaGuide.disclaimer}</span>
            </div>

            {/* Search */}
            <div className="flex max-w-sm gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.visaGuide.searchPlaceholder}
                  className="h-11 w-full rounded-xl border-0 bg-white/10 pl-10 pr-9 text-sm text-white placeholder:text-gray-500 ring-1 ring-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40" />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </animated.div>

          {/* Stats */}
          <div className="mt-7 flex flex-wrap gap-8">
            <AnimatedStat value={visas.filter(v => v.category === "Work").length}
              label={t.visaGuide.stats.work} icon={<Briefcase className="h-4 w-4 text-blue-400" />} />
            <AnimatedStat value={visas.filter(v => v.category === "Residency").length}
              label={t.visaGuide.stats.residency} icon={<Star className="h-4 w-4 text-purple-400" />} />
            <AnimatedStat value={visas.filter(v => v.category !== "Work" && v.category !== "Residency").length}
              label={t.visaGuide.stats.family} icon={<Users className="h-4 w-4 text-pink-400" />} />
          </div>
        </div>
      </div>

      {/* ── Spring-animated category filter bar ──────────────────────────── */}
      <div className="sticky top-[63px] z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat, i) => (
              <animated.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: tabSprings[i].background,
                  color:      tabSprings[i].color,
                  transform:  tabSprings[i].scale.to(s => `scale(${s})`),
                }}
                className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-shadow hover:shadow-sm"
              >
                {cat === "All" ? `${tabLabels["All"]} (${visas.length})` : tabLabels[cat]}
              </animated.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cards grid ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        <p className="mb-5 text-sm text-gray-500">
          {t.visaGuide.showing} <span className="font-extrabold text-gray-900">{filtered.length}</span> {t.visaGuide.visaType}
          {activeCategory !== "All" && <> · <span className="font-semibold">{activeCategory}</span></>}
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <Search className="mb-3 h-10 w-10 text-gray-200" />
            <p className="font-semibold text-gray-600">{t.visaGuide.empty.title}</p>
            <button onClick={() => { setQuery(""); setActiveCategory("All") }}
              className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
              {t.visaGuide.empty.reset}
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((visa, i) => <VisaCard key={visa.code} visa={visa} index={i} />)}
          </div>
        )}

        {/* ── Pathway section ────────────────────────────────────────────── */}
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400">
              {t.visaGuide.pathways.title}
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pathways.map((p, i) => <PathwayRow key={p.label} pathway={p} index={i} />)}
          </div>
        </div>

        {/* ── CTA banner ─────────────────────────────────────────────────── */}
        <animated.div ref={ctaRef} style={ctaSpring} className="mt-10">
          <div className="overflow-hidden rounded-2xl shadow-lg shadow-blue-200">
            <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-white">{t.visaGuide.cta.title}</h3>
                <p className="mt-1 text-sm text-blue-200">{t.visaGuide.cta.subtitle}</p>
              </div>
              <Link href="/jobs"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md">
                {t.visaGuide.cta.btn} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </animated.div>

      </div>
    </div>
  )
}

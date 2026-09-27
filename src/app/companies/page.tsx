"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSpring, useTrail, useSprings, useInView, animated, config } from "@react-spring/web"
import {
  Search, X, MapPin, Briefcase, BadgeCheck,
  Users, Calendar, ExternalLink, Building2,
  Factory, Monitor, Wheat, HardHat,
  Hotel, HeartPulse, GraduationCap, Truck,
  ArrowUpRight, Zap,
} from "lucide-react"
import { companies, industries, type Industry } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

const industryConfig: Record<Industry, {
  Icon: React.ElementType
  accent: string; gradient: string; bg: string; text: string
  from: string; to: string
}> = {
  "Manufacturing": { Icon: Factory,       accent: "from-blue-600 to-cyan-500",     gradient: "from-blue-500 to-indigo-600",   bg: "bg-blue-50",   text: "text-blue-700",   from: "#2563eb", to: "#06b6d4" },
  "IT & Software": { Icon: Monitor,       accent: "from-violet-600 to-indigo-500", gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700", from: "#7c3aed", to: "#6366f1" },
  "Agriculture":   { Icon: Wheat,         accent: "from-emerald-600 to-green-500", gradient: "from-green-500 to-emerald-600", bg: "bg-green-50",  text: "text-green-700",  from: "#059669", to: "#16a34a" },
  "Construction":  { Icon: HardHat,       accent: "from-orange-600 to-amber-500",  gradient: "from-orange-500 to-amber-600",  bg: "bg-orange-50", text: "text-orange-700", from: "#ea580c", to: "#d97706" },
  "Hospitality":   { Icon: Hotel,         accent: "from-pink-600 to-rose-500",     gradient: "from-pink-500 to-rose-600",     bg: "bg-pink-50",   text: "text-pink-700",   from: "#db2777", to: "#e11d48" },
  "Healthcare":    { Icon: HeartPulse,    accent: "from-red-600 to-rose-500",      gradient: "from-red-500 to-rose-600",      bg: "bg-red-50",    text: "text-red-700",    from: "#dc2626", to: "#e11d48" },
  "Education":     { Icon: GraduationCap, accent: "from-teal-600 to-cyan-500",     gradient: "from-teal-500 to-cyan-600",     bg: "bg-teal-50",   text: "text-teal-700",   from: "#0d9488", to: "#0891b2" },
  "Logistics":     { Icon: Truck,         accent: "from-amber-600 to-yellow-500",  gradient: "from-amber-500 to-orange-600",  bg: "bg-amber-50",  text: "text-amber-700",  from: "#d97706", to: "#ea580c" },
}

// ── Hero Orbs ─────────────────────────────────────────────────────────────────

function HeroOrbs() {
  const springs = useSprings(3, [
    { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, config: { tension: 55, friction: 18 } },
    { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, delay: 180, config: { tension: 55, friction: 18 } },
    { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, delay: 350, config: { tension: 55, friction: 18 } },
  ])
  const orbs = [
    { color: "#2563eb", size: 340, left: -160, top: -80 },
    { color: "#7c3aed", size: 260, right: -130, bottom: -40 },
    { color: "#059669", size: 200, left: "42%", top: "40%" },
  ]
  return (
    <>
      {orbs.map((o, i) => (
        <animated.div key={i} style={{
          ...springs[i],
          position: "absolute", borderRadius: "50%",
          width: o.size, height: o.size,
          background: o.color,
          opacity: springs[i].opacity.to(v => v * 0.18),
          filter: "blur(80px)", pointerEvents: "none",
          left: (o as any).left, top: (o as any).top,
          right: (o as any).right, bottom: (o as any).bottom,
        }} />
      ))}
    </>
  )
}

// ── Animated stat ─────────────────────────────────────────────────────────────

function AnimatedStat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  const [ref, inView] = useInView({ once: true })
  const spring = useSpring({
    from: { val: 0 },
    to: { val: inView ? value : 0 },
    config: { ...config.molasses, duration: 900 },
  })
  return (
    <div ref={ref}>
      <animated.div className={`text-2xl font-extrabold ${accent ? "text-yellow-300" : "text-white"}`}>
        {spring.val.to(v => Math.floor(v))}
      </animated.div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

// ── Company Card ──────────────────────────────────────────────────────────────

function CompanyCard({ company, index }: { company: typeof companies[number]; index: number }) {
  const { t } = useLang()
  const cfg  = industryConfig[company.industry]
  const Icon = cfg?.Icon ?? Building2
  const [hovered, setHovered] = useState(false)

  const [ref, inView] = useInView({ once: true, rootMargin: "-50px 0px" })

  const entrance = useSpring({
    from: { opacity: 0, transform: "translateY(36px) scale(0.96)" },
    to: inView ? { opacity: 1, transform: "translateY(0px) scale(1)" } : { opacity: 0, transform: "translateY(36px) scale(0.96)" },
    delay: index * 70,
    config: { tension: 200, friction: 22 },
  })

  const hover = useSpring({
    transform: hovered ? "translateY(-7px) scale(1.015)" : "translateY(0px) scale(1)",
    boxShadow: hovered ? "0 20px 50px rgba(59,130,246,0.16)" : "0 2px 8px rgba(0,0,0,0.06)",
    config: config.wobbly,
  })

  const bannerHeight = useSpring({
    height: hovered ? "72px" : "64px",
    config: { tension: 300, friction: 22 },
  })

  const badge = useSpring({
    transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
    config: config.wobbly,
  })

  return (
    <animated.div
      ref={ref}
      style={{ ...entrance, ...hover }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
    >
      {/* Animated banner */}
      <animated.div
        style={{ ...bannerHeight, background: `linear-gradient(135deg, ${cfg?.from ?? "#3b82f6"}, ${cfg?.to ?? "#6366f1"})`, position: "relative", flexShrink: 0 }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
        {company.verified && (
          <div className="absolute right-4 top-3.5 flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-white/30">
            <BadgeCheck className="h-3 w-3" /> {t.companies.card.verified}
          </div>
        )}
        {/* Logo straddling banner bottom */}
        <div className="absolute bottom-0 left-5 z-10 translate-y-1/2">
          <animated.div
            style={{ background: `linear-gradient(135deg, ${cfg?.from ?? "#3b82f6"}, ${cfg?.to ?? "#6366f1"})`, ...badge }}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-md ring-2 ring-white"
          >
            {company.logo}
          </animated.div>
        </div>
      </animated.div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-9">
        <h2 className="text-base font-bold leading-snug text-gray-900 transition-colors" style={{ color: hovered ? "#1d4ed8" : "#111827" }}>
          {company.name}
        </h2>

        <div className="mt-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg?.bg ?? "bg-blue-50"} ${cfg?.text ?? "text-blue-700"}`}>
            <Icon className="h-3 w-3" />{company.industry}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />{company.city}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 shrink-0 text-gray-400" />{company.employees}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />{t.companies.card.est} {company.founded}</span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">{company.about}</p>

        <div className="my-4 h-px shrink-0 bg-gray-100" />

        <div className="flex items-center justify-between gap-3">
          <Link href={`/jobs?company=${company.id}`}>
            <animated.span
              style={{ background: `linear-gradient(to right, ${cfg?.from ?? "#3b82f6"}, ${cfg?.to ?? "#6366f1"})` }}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 hover:shadow-md"
            >
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              {company.activeJobs} {t.companies.card.openJobs}
            </animated.span>
          </Link>
          {company.website && (
            <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-[11px] text-gray-400 transition-colors hover:text-blue-600">
              <span className="truncate">{company.website}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </animated.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CompaniesPage() {
  const { t } = useLang()
  const [query, setQuery]       = useState("")
  const [industry, setIndustry] = useState<Industry | "">("")

  const filtered = useMemo(() => companies.filter(c => {
    if (industry && c.industry !== industry) return false
    if (query) {
      const q = query.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.about.toLowerCase().includes(q)
    }
    return true
  }), [query, industry])

  const totalAll     = companies.reduce((s, c) => s + c.activeJobs, 0)
  const filteredJobs = filtered.reduce((s, c) => s + c.activeJobs, 0)

  // Hero trail
  const heroTrail = useTrail(3, {
    from: { opacity: 0, y: 22 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 220, friction: 22 },
  })

  // Industry filter tab springs
  const allTabs = ["All", ...industries] as const
  const tabSprings = useSprings(allTabs.length, allTabs.map(tab => ({
    background: (tab === "All" ? industry === "" : industry === tab) ? "#111827" : "#ffffff",
    color:      (tab === "All" ? industry === "" : industry === tab) ? "#ffffff" : "#6b7280",
    scale:      (tab === "All" ? industry === "" : industry === tab) ? 1.05 : 1,
    config: config.stiff,
  })))

  // CTA spring
  const [ctaRef, ctaInView] = useInView({ once: true })
  const ctaSpring = useSpring({
    from: { opacity: 0, y: 24 },
    to: ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    config: { tension: 180, friction: 22 },
  })

  // Count bar spring
  const [countRef, countInView] = useInView({ once: true })
  const countSpring = useSpring({
    from: { opacity: 0, x: -16 },
    to: countInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 },
    config: { tension: 220, friction: 22 },
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-950 py-14 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <HeroOrbs />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <animated.div style={{ opacity: heroTrail[0].opacity, transform: heroTrail[0].y.to(y => `translateY(${y}px)`) }}>
            <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
              {t.companies.badge}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {t.companies.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-400">
              {t.companies.subtitle}{" "}
              <span className="font-semibold text-white">{companies.length} companies</span> with{" "}
              <span className="font-semibold text-yellow-300">{totalAll} open positions</span>.
            </p>
          </animated.div>

          {/* Animated stats */}
          <animated.div style={{ opacity: heroTrail[1].opacity, transform: heroTrail[1].y.to(y => `translateY(${y}px)`) }}
            className="mt-7 flex flex-wrap gap-8">
            <AnimatedStat value={companies.length} label={t.companies.stats.verified} />
            <AnimatedStat value={totalAll} label={t.companies.stats.positions} accent />
            <AnimatedStat value={industries.length} label={t.companies.stats.industries} />
          </animated.div>

          {/* Search */}
          <animated.div style={{ opacity: heroTrail[2].opacity, transform: heroTrail[2].y.to(y => `translateY(${y}px)`) }}
            className="mt-7 flex max-w-sm gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.companies.searchPlaceholder}
                className="h-11 w-full rounded-xl border-0 bg-white/10 pl-10 pr-9 text-sm text-white placeholder:text-gray-500 ring-1 ring-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40" />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </animated.div>
        </div>
      </div>

      {/* ── Industry filter bar ───────────────────────────────────────────── */}
      <div className="sticky top-[63px] z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3" style={{ scrollbarWidth: "none" }}>
            {/* All button */}
            <animated.button
              onClick={() => setIndustry("")}
              style={{ background: tabSprings[0].background, color: tabSprings[0].color, transform: tabSprings[0].scale.to(s => `scale(${s})`) }}
              className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
            >
              {t.companies.allIndustries}
            </animated.button>

            {/* Per-industry buttons */}
            {industries.map((ind, i) => {
              const cfg    = industryConfig[ind]
              const active = industry === ind
              return (
                <animated.button
                  key={ind}
                  onClick={() => setIndustry(active ? "" : ind)}
                  style={{
                    background: tabSprings[i + 1].background,
                    color:      tabSprings[i + 1].color,
                    transform:  tabSprings[i + 1].scale.to(s => `scale(${s})`),
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium ${active ? `${cfg.bg} border-transparent` : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <cfg.Icon className="h-3.5 w-3.5" />{ind}
                </animated.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Count bar */}
        <animated.div ref={countRef} style={countSpring}
          className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              <span className="font-extrabold text-gray-900">{filtered.length}</span>{" "}
              compan{filtered.length !== 1 ? "ies" : "y"}
              {" · "}
              <span className="font-semibold text-blue-700">{filteredJobs} {t.companies.openPositions}</span>
            </span>
          </div>
          {(query || industry) && (
            <button onClick={() => { setQuery(""); setIndustry("") }}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-700">
              <X className="h-3.5 w-3.5" /> {t.companies.clear}
            </button>
          )}
        </animated.div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-center">
            <Building2 className="mb-3 h-12 w-12 text-gray-200" />
            <h3 className="text-base font-semibold text-gray-600">{t.companies.empty.title}</h3>
            <button onClick={() => { setQuery(""); setIndustry("") }}
              className="mt-5 rounded-xl border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50">
              {t.companies.empty.clear}
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company, i) => <CompanyCard key={company.id} company={company} index={i} />)}
          </div>
        )}

      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 bg-white">
        <animated.div ref={ctaRef} style={ctaSpring}
          className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="h-4 w-4 text-yellow-400" />
            {t.companies.cta.text}
          </div>
          <Link href="/employers"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 hover:shadow-md transition-all">
            {t.companies.cta.btn} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </animated.div>
      </div>

    </div>
  )
}

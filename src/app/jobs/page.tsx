"use client"

import { useState, useMemo } from "react"
import { useLang } from "@/lib/i18n/context"
import Link from "next/link"
import { useSpring, useTrail, useSprings, useInView, animated, config } from "@react-spring/web"
import {
  Search, X, MapPin, Clock, Users, BadgeCheck,
  Heart, SlidersHorizontal, ChevronDown, ArrowRight, Zap, Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  jobs, cities, visaOptions, industries,
  formatSalary, daysAgo,
  type Job, type VisaType, type Industry,
} from "@/lib/mock-data"

const visaStyle: Record<string, { bg: string; text: string; dot: string; from: string; to: string }> = {
  "E-7":  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500",    from: "#3b82f6", to: "#6366f1" },
  "E-9":  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", from: "#10b981", to: "#0d9488" },
  "H-2":  { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   from: "#f59e0b", to: "#f97316" },
  "F-4":  { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-500",  from: "#a855f7", to: "#7c3aed" },
  "F-6":  { bg: "bg-pink-100",    text: "text-pink-700",    dot: "bg-pink-500",    from: "#ec4899", to: "#e11d48" },
  "D-10": { bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500",  from: "#f97316", to: "#ef4444" },
}

const industryColor: Record<string, { bg: string; text: string; dot: string }> = {
  "Manufacturing": { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "IT & Software": { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  "Agriculture":   { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  "Construction":  { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Hospitality":   { bg: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-500"   },
  "Healthcare":    { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  "Education":     { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-500"   },
  "Logistics":     { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
}

const jobTypes = ["Full-time", "Part-time", "Contract", "Seasonal"] as const
type Filters = { visas: VisaType[]; industry: Industry | ""; city: string; jobType: string }
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({ job, index }: { job: Job; index: number }) {
  const { t } = useLang()
  const [saved, setSaved] = useState(false)
  const [hovered, setHovered] = useState(false)
  const primaryVisa = job.visaTypes[0] ?? "E-7"
  const vs = visaStyle[primaryVisa] ?? visaStyle["E-7"]
  const ic = industryColor[job.industry]

  const [ref, inView] = useInView({ once: true, rootMargin: "-40px 0px" })

  const entrance = useSpring({
    from: { opacity: 0, transform: "translateY(36px) scale(0.96)" },
    to: inView ? { opacity: 1, transform: "translateY(0px) scale(1)" } : { opacity: 0, transform: "translateY(36px) scale(0.96)" },
    delay: index * 70,
    config: { tension: 200, friction: 22 },
  })

  const hover = useSpring({
    transform: hovered ? "translateY(-7px) scale(1.015)" : "translateY(0px) scale(1)",
    boxShadow: hovered ? "0 20px 50px rgba(59,130,246,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
    config: config.wobbly,
  })

  const stripe = useSpring({
    height: hovered ? "6px" : "4px",
    opacity: hovered ? 1 : 0.8,
    config: { tension: 300, friction: 20 },
  })

  const badge = useSpring({
    transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1) rotate(0deg)",
    config: config.wobbly,
  })

  const heartSpring = useSpring({
    transform: saved ? "scale(1.3)" : "scale(1)",
    config: config.wobbly,
  })

  return (
    <animated.div
      ref={ref}
      style={{ ...entrance, ...hover }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200 bg-white"
    >
      <animated.div style={{ ...stripe, background: `linear-gradient(to right, ${vs.from}, ${vs.to})` }} className="w-full shrink-0" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <animated.div style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})`, ...badge }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-sm">
            {job.company.logo}
          </animated.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate font-bold text-gray-900">{job.title}</h3>
                <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                  <span className="truncate">{job.company.name}</span>
                  {job.company.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />}
                </div>
              </div>
              {job.featured && (
                <span className="shrink-0 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-700 ring-1 ring-yellow-200">
                  {t.jobsPage.card.featured}
                </span>
              )}
            </div>
          </div>
          <animated.button
            style={heartSpring}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved(s => !s) }}
            className={`shrink-0 ${saved ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-red-500" : ""}`} />
          </animated.button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { icon: <MapPin className="h-3 w-3 shrink-0" />, label: job.city },
            { icon: <Clock className="h-3 w-3 shrink-0" />, label: job.jobType },
            { icon: <Users className="h-3 w-3 shrink-0" />, label: `${job.applicants} ${t.jobsPage.card.applied}` },
          ].map(m => (
            <span key={m.label} className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              {m.icon}{m.label}
            </span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {job.visaTypes.map(v => {
            const s = visaStyle[v] ?? visaStyle["E-7"]
            return (
              <span key={v} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{v}
              </span>
            )
          })}
          {job.topikLevel && (
            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              TOPIK {job.topikLevel}+
            </span>
          )}
          {ic && (
            <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${ic.bg} ${ic.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${ic.dot}`} />{job.industry}
            </span>
          )}
        </div>

        <div className="my-3 h-px shrink-0 bg-gray-100" />

        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-gray-900">
            {formatSalary(job.salary.min, job.salary.max)}
            <span className="ml-1 text-xs font-normal text-gray-400">{t.jobsPage.card.perMonth}</span>
          </span>
          <span className="text-xs text-gray-400">{daysAgo(job.postedAt)}</span>
        </div>

        <Link href={`/jobs/${job.id}`}>
          <animated.div
            style={{ background: `linear-gradient(to right, ${vs.from}, ${vs.to})` }}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-white opacity-30 transition-opacity duration-300 hover:opacity-100"
          >
            {t.jobsPage.card.viewJob} <ArrowRight className="h-4 w-4" />
          </animated.div>
        </Link>
      </div>
    </animated.div>
  )
}

// ── Filter controls ───────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>
}

function FilterControls({ filters, onChange }: { filters: Filters; onChange: (p: Partial<Filters>) => void }) {
  const { t } = useLang()
  return (
    <div className="space-y-5">
      <div>
        <FilterLabel>{t.jobsPage.filters.visaType}</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {visaOptions.map(v => {
            const active = filters.visas.includes(v)
            const s = visaStyle[v]
            return (
              <button key={v} onClick={() => onChange({ visas: toggle(filters.visas, v) })}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${active ? `${s.bg} ${s.text} border-transparent shadow-sm` : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                {active && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />}{v}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <FilterLabel>{t.jobsPage.filters.industry}</FilterLabel>
        <div className="grid grid-cols-2 gap-1">
          {industries.map(ind => {
            const active = filters.industry === ind
            const c = industryColor[ind]
            return (
              <button key={ind} onClick={() => onChange({ industry: active ? "" : ind as Industry })}
                className={`flex items-center gap-1.5 truncate rounded-lg px-2.5 py-1.5 text-xs transition-all ${active ? `${c.bg} ${c.text} font-semibold` : "text-gray-600 hover:bg-gray-100"}`}>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? c.dot : "bg-gray-300"}`} />
                <span className="truncate">{ind}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <FilterLabel>{t.jobsPage.filters.city}</FilterLabel>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <select value={filters.city} onChange={e => onChange({ city: e.target.value })}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-7 pr-7 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="">{t.jobsPage.filters.allCities}</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div>
        <FilterLabel>{t.jobsPage.filters.jobType}</FilterLabel>
        <div className="grid grid-cols-2 gap-1">
          {jobTypes.map(jt => {
            const active = filters.jobType === jt
            return (
              <button key={jt} onClick={() => onChange({ jobType: active ? "" : jt })}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${active ? "bg-blue-600 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50"}`}>
                {jt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Hero Orbs ─────────────────────────────────────────────────────────────────

function HeroOrbs() {
  const springs = useSprings(3, [
    { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, config: { tension: 55, friction: 16 } },
    { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, delay: 150, config: { tension: 55, friction: 16 } },
    { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, delay: 300, config: { tension: 55, friction: 16 } },
  ])
  const orbs = [
    { color: "#3b82f6", size: 320, left: -140, top: -60 },
    { color: "#7c3aed", size: 260, right: -120, bottom: -40 },
    { color: "#10b981", size: 180, left: "45%", top: "30%" },
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const { t } = useLang()
  const sortOptions = [
    { key: "newest",  label: t.jobsPage.sort.newest      },
    { key: "salary",  label: t.jobsPage.sort.highestPay  },
    { key: "popular", label: t.jobsPage.sort.mostApplied },
  ] as const
  const [query, setQuery]           = useState("")
  const [sort, setSort]             = useState<"newest" | "salary" | "popular">("newest")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [filters, setFilters]       = useState<Filters>({ visas: [], industry: "", city: "", jobType: "" })
  function patch(p: Partial<Filters>) { setFilters(f => ({ ...f, ...p })) }

  const filtered = useMemo(() => {
    let r = jobs.filter(job => {
      if (query) {
        const q = query.toLowerCase()
        if (!job.title.toLowerCase().includes(q) && !job.company.name.toLowerCase().includes(q) && !job.city.toLowerCase().includes(q)) return false
      }
      if (filters.visas.length > 0 && !filters.visas.some(v => job.visaTypes.includes(v))) return false
      if (filters.industry && job.industry !== filters.industry) return false
      if (filters.city && job.city !== filters.city) return false
      if (filters.jobType && job.jobType !== filters.jobType) return false
      return true
    })
    if (sort === "newest")  r = [...r].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    if (sort === "salary")  r = [...r].sort((a, b) => b.salary.max - a.salary.max)
    if (sort === "popular") r = [...r].sort((a, b) => b.applicants - a.applicants)
    return r
  }, [query, filters, sort])

  const activeChips = [
    ...filters.visas.map(v => ({ key: `v-${v}`, label: v, clear: () => patch({ visas: toggle(filters.visas, v) }) })),
    ...(filters.industry ? [{ key: "ind",  label: filters.industry, clear: () => patch({ industry: "" }) }] : []),
    ...(filters.city     ? [{ key: "city", label: filters.city,     clear: () => patch({ city: "" }) }]     : []),
    ...(filters.jobType  ? [{ key: "type", label: filters.jobType,  clear: () => patch({ jobType: "" }) }]  : []),
  ]

  // Hero trail
  const heroTrail = useTrail(3, {
    from: { opacity: 0, y: 20 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 220, friction: 22 },
  })

  // Sort button springs
  const sortSprings = useSprings(sortOptions.length, sortOptions.map(s => ({
    background: sort === s.key ? "#1d4ed8" : "#ffffff",
    color:      sort === s.key ? "#ffffff" : "#4b5563",
    scale:      sort === s.key ? 1.05 : 1,
    config: config.stiff,
  })))

  // Mobile drawer spring
  const drawerSpring = useSpring({
    transform: mobileOpen ? "translateX(0%)" : "translateX(100%)",
    config: { tension: 280, friction: 26 },
  })
  const overlaySpring = useSpring({
    opacity: mobileOpen ? 1 : 0,
    pointerEvents: mobileOpen ? "auto" as const : "none" as const,
    config: config.stiff,
  })

  // Trust strip trail
  const [trustRef, trustInView] = useInView({ once: true })
  const trustTrail = useTrail(3, {
    from: { opacity: 0, y: 12 },
    to: trustInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    config: { tension: 200, friction: 22 },
  })
  const trustItems = [
    { icon: <BadgeCheck className="h-4 w-4 text-blue-500" />, label: t.jobsPage.trust.verified },
    { icon: <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />, label: t.jobsPage.trust.rating },
    { icon: <Zap className="h-4 w-4 text-green-500" />, label: t.jobsPage.trust.daily },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-900 py-10 text-white">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <HeroOrbs />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <animated.div style={{ opacity: heroTrail[0].opacity, transform: heroTrail[0].y.to(y => `translateY(${y}px)`) }}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              {jobs.length} jobs · {t.jobsPage.updatedDaily}
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            </div>
          </animated.div>

          <animated.div style={{ opacity: heroTrail[1].opacity, transform: heroTrail[1].y.to(y => `translateY(${y}px)`) }}>
            <h1 className="text-2xl font-extrabold sm:text-3xl">{t.jobsPage.title}</h1>
            <p className="mt-1.5 text-sm text-blue-300">{t.jobsPage.subtitle}</p>
          </animated.div>

          <animated.div style={{ opacity: heroTrail[2].opacity, transform: heroTrail[2].y.to(y => `translateY(${y}px)`) }} className="mt-5 flex gap-2">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.jobsPage.searchPlaceholder}
                className="h-11 w-full rounded-xl border-0 bg-white pl-10 pr-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>}
            </div>
            <button onClick={() => setMobileOpen(true)}
              className="relative flex h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/20 hover:bg-white/20 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> {t.jobsPage.filtersBtn}
              {activeChips.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-gray-900">{activeChips.length}</span>
              )}
            </button>
          </animated.div>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex gap-7">

          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-600">{t.jobsPage.filters.title}</span>
                </div>
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">{filtered.length}</span>
              </div>
              <div className="px-4 py-4"><FilterControls filters={filters} onChange={patch} /></div>
              {(filters.visas.length > 0 || filters.industry || filters.city || filters.jobType) && (
                <div className="border-t border-gray-100 px-4 pb-4">
                  <button onClick={() => patch({ visas: [], industry: "", city: "", jobType: "" })}
                    className="w-full rounded-lg border border-gray-200 py-1.5 text-xs text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                    {t.jobsPage.filters.clearAll}
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Job list */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                <span className="font-extrabold text-gray-900">{filtered.length}</span> {t.jobsPage.results.found}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{t.jobsPage.sort.label}</span>
                {sortOptions.map((s, i) => (
                  <animated.button key={s.key} onClick={() => setSort(s.key)}
                    style={{ background: sortSprings[i].background, color: sortSprings[i].color, transform: sortSprings[i].scale.to(v => `scale(${v})`) }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium shadow-sm">
                    {s.label}
                  </animated.button>
                ))}
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {activeChips.map(chip => (
                  <span key={chip.key} className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {chip.label}
                    <button onClick={chip.clear}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <button onClick={() => patch({ visas: [], industry: "", city: "", jobType: "" })} className="text-xs text-gray-400 underline hover:text-gray-600">{t.jobsPage.results.clear}</button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <Search className="mb-3 h-10 w-10 text-gray-200" />
                <h3 className="font-semibold text-gray-600">{t.jobsPage.results.noJobs}</h3>
                <p className="mt-1 text-sm text-gray-400">{t.jobsPage.results.noJobsSub}</p>
                <Button variant="outline" className="mt-5" onClick={() => { setQuery(""); patch({ visas: [], industry: "", city: "", jobType: "" }) }}>{t.jobsPage.results.clearAll}</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filtered.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div ref={trustRef} className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-5 sm:px-6">
          {trustItems.map((item, i) => (
            <animated.span key={item.label} style={{ opacity: trustTrail[i].opacity, transform: trustTrail[i].y.to(y => `translateY(${y}px)`) }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              {item.icon}{item.label}
            </animated.span>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      <animated.div style={overlaySpring} onClick={() => setMobileOpen(false)}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      <animated.div style={drawerSpring} className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
          <span className="font-semibold text-gray-900">{t.jobsPage.filters.title}</span>
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 hover:bg-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterControls filters={filters} onChange={patch} />
        </div>
        <div className="border-t p-4">
          <Button className="w-full bg-blue-700 text-white hover:bg-blue-800" onClick={() => setMobileOpen(false)}>
            {t.jobsPage.showJobs} {filtered.length}
          </Button>
        </div>
      </animated.div>

    </div>
  )
}

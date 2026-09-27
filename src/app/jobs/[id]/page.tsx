"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { use, useState, useEffect, useRef } from "react"
import { useSpring, useTrail, useInView, useSprings, animated, config } from "@react-spring/web"
import {
  ArrowLeft, MapPin, Clock, Users, BadgeCheck, Banknote,
  FileText, CheckCircle2, Gift, Globe, Calendar, Building2,
  Briefcase, Heart, Share2, ExternalLink, Zap, ArrowRight,
  Copy, X, Check,
} from "lucide-react"
import { jobs, formatSalary, daysAgo, type Job } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

// ── colour tokens ──────────────────────────────────────────────────────────────

const visaColors: Record<string, { bg: string; text: string; dot: string; from: string; to: string }> = {
  "E-7":  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500",    from: "#3b82f6", to: "#6366f1" },
  "E-9":  { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", from: "#10b981", to: "#0d9488" },
  "H-2":  { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500",   from: "#f59e0b", to: "#f97316" },
  "F-4":  { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-500",  from: "#a855f7", to: "#7c3aed" },
  "F-6":  { bg: "bg-pink-100",    text: "text-pink-700",    dot: "bg-pink-500",    from: "#ec4899", to: "#e11d48" },
  "D-10": { bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500",  from: "#f97316", to: "#ef4444" },
}

// ── Similar card ───────────────────────────────────────────────────────────────

function SimilarCard({ job, index }: { job: Job; index: number }) {
  const [ref, inView] = useInView({ once: true })
  const spring = useSpring({
    from: { opacity: 0, x: 16 },
    to: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 },
    delay: index * 80,
    config: { tension: 220, friction: 24 },
  })
  const vs = visaColors[job.visaTypes[0] ?? "E-7"]
  const { t } = useLang()
  const [hover, setHover] = useState(false)
  const hoverSpring = useSpring({ x: hover ? 3 : 0, config: config.stiff })

  return (
    <animated.div ref={ref} style={spring}>
      <Link href={`/jobs/${job.id}`}>
        <animated.div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ transform: hoverSpring.x.to(x => `translateX(${x}px)`) }}
          className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 group"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})` }}>
            {job.company.logo}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{job.title}</p>
            <p className="truncate text-xs text-gray-500">{job.company.name}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">{formatSalary(job.salary.min, job.salary.max)}</span>
              <span className="text-[10px] text-gray-400">{t.jobDetail.perMonth}</span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors mt-1" />
        </animated.div>
      </Link>
    </animated.div>
  )
}

// ── Share popover ─────────────────────────────────────────────────────────────

function SharePopover({ jobTitle, onClose }: { jobTitle: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const { t } = useLang()
  const url = typeof window !== "undefined" ? window.location.href : ""

  const spring = useSpring({
    from: { opacity: 0, y: 8, scale: 0.95 },
    to:   { opacity: 1, y: 0, scale: 1 },
    config: config.wobbly,
  })

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Close on outside click
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  const shareItems = [
    {
      icon: Copy,
      svgPath: undefined,
      label: copied ? t.jobDetail.shareCopied : t.jobDetail.shareCopyLink,
      color: "#6366f1",
      bg: "#eff6ff",
      action: copyLink,
      done: copied,
    },
    {
      icon: null,
      svgPath: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
      label: "LinkedIn",
      color: "#0a66c2",
      bg: "#eff6ff",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
    },
    {
      icon: null,
      svgPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.85L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      label: "X / Twitter",
      color: "#000",
      bg: "#f8fafc",
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${jobTitle}`)}&url=${encodeURIComponent(url)}`),
    },
    {
      icon: null,
      svgPath: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
      label: "WhatsApp",
      color: "#16a34a",
      bg: "#f0fdf4",
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${jobTitle} — ${url}`)}`),
    },
  ]

  const itemSprings = useSprings(shareItems.length, shareItems.map((_, i) => ({
    from: { opacity: 0, x: -10 },
    to:   { opacity: 1, x: 0 },
    delay: i * 60,
    config: { tension: 280, friction: 22 },
  })))

  return (
    <animated.div ref={ref} style={spring}
      className="absolute bottom-full right-0 mb-2 z-50 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/80">
      <div className="border-b border-gray-50 px-4 py-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.jobDetail.shareTitle}</p>
        <button onClick={onClose} className="rounded-lg p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-2">
        {shareItems.map((item, i) => (
          <animated.button key={item.label} style={itemSprings[i]}
            onClick={item.action}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: item.bg }}>
              {item.done
                ? <Check className="h-4 w-4 text-green-600" />
                : item.icon
                  ? <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  : <svg className="h-4 w-4" viewBox="0 0 24 24" fill={item.color}><path d={item.svgPath} /></svg>
              }
            </div>
            <span className={item.done ? "text-green-600 font-semibold" : ""}>{item.label}</span>
          </animated.button>
        ))}
      </div>
    </animated.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = jobs.find(j => j.id === id)
  if (!job) notFound()

  const { t } = useLang()
  const [saved,       setSaved]       = useState(false)
  const [shareOpen,   setShareOpen]   = useState(false)
  const vs = visaColors[job.visaTypes[0] ?? "E-7"]
  const similar = jobs.filter(j => j.id !== id && j.industry === job.industry).slice(0, 3)

  // ── Hero trail ────────────────────────────────────────────────────────────
  const heroTrail = useTrail(4, {
    from: { opacity: 0, y: 20 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 220, friction: 22 },
  })

  // ── Main content spring ───────────────────────────────────────────────────
  const [mainRef, mainInView] = useInView({ once: true })
  const mainSpring = useSpring({
    from: { opacity: 0, y: 28 },
    to: mainInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    config: { tension: 200, friction: 22 },
  })

  // ── Sidebar spring ────────────────────────────────────────────────────────
  const [sideRef, sideInView] = useInView({ once: true })
  const sideSpring = useSpring({
    from: { opacity: 0, x: 24 },
    to: sideInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 },
    delay: 100,
    config: { tension: 200, friction: 22 },
  })

  // ── Apply button ──────────────────────────────────────────────────────────
  const [applyHover, setApplyHover] = useState(false)
  const applySpring = useSpring({
    scale:     applyHover ? 1.03 : 1,
    boxShadow: applyHover ? `0 10px 32px ${vs.from}55` : `0 2px 8px ${vs.from}22`,
    config: config.wobbly,
  })

  // ── Save button ───────────────────────────────────────────────────────────
  const [saveHover, setSaveHover] = useState(false)
  const saveSpring = useSpring({
    scale: saved ? 1.15 : saveHover ? 1.06 : 1,
    config: config.wobbly,
  })
  const heartFill = useSpring({
    opacity: saved ? 1 : 0,
    config: config.stiff,
  })

  // ── Share button ──────────────────────────────────────────────────────────
  const [shareHover, setShareHover] = useState(false)
  const shareSpring = useSpring({
    scale: shareHover ? 1.04 : 1,
    config: config.wobbly,
  })

  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripeSpring = useSpring({
    from: { width: "0%" },
    to:   { width: "100%" },
    config: { tension: 80, friction: 20 },
  })

  // ── Salary bar ────────────────────────────────────────────────────────────
  const [salaryRef, salaryInView] = useInView({ once: true })
  const salarySpring = useSpring({
    from: { scaleX: 0 },
    to: salaryInView ? { scaleX: 1 } : { scaleX: 0 },
    delay: 300,
    config: { tension: 80, friction: 22 },
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-950 pb-12 pt-8 text-white">
        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Glow orbs */}
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full blur-3xl opacity-20"
          style={{ background: vs.from }} />
        <div className="absolute -right-20 bottom-0 h-48 w-48 rounded-full blur-3xl opacity-15"
          style={{ background: vs.to }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

          {/* Back */}
          <animated.div style={{ opacity: heroTrail[0].opacity, transform: heroTrail[0].y.to(y => `translateY(${y}px)`) }}>
            <Link href="/jobs" className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-400 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> {t.jobDetail.backToJobs}
            </Link>
          </animated.div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">

            {/* Logo */}
            <animated.div
              style={{ opacity: heroTrail[1].opacity, transform: heroTrail[1].y.to(y => `translateY(${y}px)`) }}
              className="shrink-0"
            >
              <div style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})`, height: 72, width: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, boxShadow: `0 8px 32px ${vs.from}44` }}>
                <span className="text-lg font-extrabold text-white">{job.company.logo}</span>
              </div>
            </animated.div>

            {/* Title block */}
            <div className="min-w-0 flex-1">
              <animated.div style={{ opacity: heroTrail[2].opacity, transform: heroTrail[2].y.to(y => `translateY(${y}px)`) }}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{job.title}</h1>
                  {job.featured && (
                    <span className="rounded-full bg-yellow-400/15 px-3 py-0.5 text-xs font-bold text-yellow-300 ring-1 ring-yellow-400/25">
                      ✦ Featured
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                  <span className="font-medium text-gray-300">{job.company.name}</span>
                  {job.company.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[11px] font-semibold text-blue-400 ring-1 ring-blue-500/20">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </animated.div>

              {/* Meta chips */}
              <animated.div style={{ opacity: heroTrail[3].opacity, transform: heroTrail[3].y.to(y => `translateY(${y}px)`) }}
                className="mt-4 flex flex-wrap gap-2">
                {[
                  { icon: MapPin,     label: job.city },
                  { icon: Clock,      label: job.jobType },
                  { icon: Users,      label: `${job.applicants} ${t.jobDetail.applicants}` },
                  { icon: Calendar,   label: daysAgo(job.postedAt) },
                  { icon: Banknote,   label: `${formatSalary(job.salary.min, job.salary.max)} ${t.jobDetail.perMonth}` },
                ].map(m => (
                  <span key={m.label} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-gray-300 backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.07)" }}>
                    <m.icon className="h-3.5 w-3.5 shrink-0 text-gray-500" />{m.label}
                  </span>
                ))}
              </animated.div>

              {/* Animated stripe */}
              <animated.div style={{ ...stripeSpring, height: 3, marginTop: 16, borderRadius: 99, background: `linear-gradient(to right, ${vs.from}, ${vs.to})` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Main content ─────────────────────────────────────────────── */}
          <animated.div ref={mainRef} style={mainSpring} className="space-y-5 lg:col-span-2">

            {/* Visa + industry pill row */}
            <div className="flex flex-wrap items-center gap-2">
              {job.visaTypes.map(v => {
                const c = visaColors[v] ?? visaColors["E-7"]
                return (
                  <span key={v} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${c.bg} ${c.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />{v}
                  </span>
                )
              })}
              {job.topikLevel && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  TOPIK Level {job.topikLevel}+
                </span>
              )}
              <span className="ml-auto rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                {job.industry}
              </span>
            </div>

            {/* Description */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="font-bold text-gray-900">{t.jobDetail.description}</h2>
              </div>
              <div className="px-6 py-5">
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">{t.jobDetail.requirements}</h2>
                </div>
                <ul className="grid gap-2 px-6 py-5 sm:grid-cols-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: vs.from }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <Gift className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="font-bold text-gray-900">{t.jobDetail.benefits}</h2>
                </div>
                <ul className="grid gap-2 px-6 py-5 sm:grid-cols-2">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company info */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50">
                  <Building2 className="h-4 w-4 text-gray-600" />
                </div>
                <h2 className="font-bold text-gray-900">{t.jobDetail.aboutCompany}</h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})` }}>
                    {job.company.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">{job.company.name}</span>
                      {job.company.verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-xs text-gray-500">{job.company.location}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{job.company.about}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5">
                    <Users className="h-3.5 w-3.5" />{job.company.employees} {t.jobDetail.employees}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5">
                    <Calendar className="h-3.5 w-3.5" />{t.jobDetail.founded} {job.company.founded}
                  </span>
                  {job.company.website && (
                    <a href={`https://${job.company.website}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-blue-600 hover:bg-blue-100 transition-colors">
                      <Globe className="h-3.5 w-3.5" />{job.company.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

          </animated.div>

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <animated.div ref={sideRef} style={sideSpring} className="space-y-5">

            {/* Salary + CTA card */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
              {/* Gradient header */}
              <div className="px-5 py-5 text-white" style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})` }}>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{t.jobDetail.salary}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black">{formatSalary(job.salary.min, job.salary.max)}</span>
                  <span className="text-sm text-white/70">{t.jobDetail.perMonth}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-white/60">{t.jobDetail.salaryNote}</p>

                {/* Salary bar */}
                <div ref={salaryRef} className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <animated.div
                    style={{ scaleX: salarySpring.scaleX, transformOrigin: "left", height: "100%", background: "rgba(255,255,255,0.7)", borderRadius: 99 }}
                  />
                </div>
              </div>

              <div className="p-5">
                {/* Job meta */}
                <div className="mb-5 space-y-2.5">
                  {[
                    { label: t.jobDetail.jobType,   value: job.jobType },
                    { label: t.jobDetail.industry,  value: job.industry },
                    { label: t.jobDetail.location,  value: job.city },
                    { label: t.jobDetail.deadline,  value: new Date(job.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                    { label: t.jobDetail.posted,    value: daysAgo(job.postedAt) },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-gray-400">{r.label}</span>
                      <span className="font-semibold text-gray-800 text-right">{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Apply button */}
                <Link href={`/jobs/${job.id}/apply`}>
                  <animated.div
                    style={{
                      transform: applySpring.scale.to(s => `scale(${s})`),
                      boxShadow: applySpring.boxShadow,
                      background: `linear-gradient(to right, ${vs.from}, ${vs.to})`,
                    }}
                    onMouseEnter={() => setApplyHover(true)}
                    onMouseLeave={() => setApplyHover(false)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-extrabold text-white"
                  >
                    <Briefcase className="h-4 w-4" /> {t.jobDetail.applyNow}
                    <ArrowRight className="h-4 w-4" />
                  </animated.div>
                </Link>

                {/* Save + Share */}
                <div className="mt-3 flex gap-2">

                  {/* Save */}
                  <animated.button
                    style={{ transform: saveSpring.scale.to(s => `scale(${s})`) }}
                    onMouseEnter={() => setSaveHover(true)}
                    onMouseLeave={() => setSaveHover(false)}
                    onClick={() => setSaved(s => !s)}
                    className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      saved
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <span className="relative">
                      {/* Outline heart always visible */}
                      <Heart className="h-4 w-4" style={{ opacity: saved ? 0 : 1 }} />
                      {/* Filled heart springs in */}
                      <animated.span style={{ position: "absolute", inset: 0, opacity: heartFill.opacity }}>
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </animated.span>
                    </span>
                    {saved ? t.jobDetail.saved : t.jobDetail.saveJob}
                  </animated.button>

                  {/* Share */}
                  <div className="relative flex-1">
                    <animated.button
                      style={{ transform: shareSpring.scale.to(s => `scale(${s})`) }}
                      onMouseEnter={() => setShareHover(true)}
                      onMouseLeave={() => setShareHover(false)}
                      onClick={() => setShareOpen(o => !o)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                        shareOpen
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <Share2 className="h-4 w-4" /> {t.jobDetail.shareBtn}
                    </animated.button>
                    {shareOpen && (
                      <SharePopover jobTitle={job.title} onClose={() => setShareOpen(false)} />
                    )}
                  </div>
                </div>

                {/* Social proof */}
                <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-xs text-gray-500">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  <span><span className="font-bold text-gray-700">{job.applicants}</span> {t.jobDetail.peopleApplied}</span>
                </div>
              </div>
            </div>

            {/* Similar jobs */}
            {similar.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                    <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-700">{t.jobDetail.similarJobs}</h3>
                </div>
                <div className="divide-y divide-gray-50 p-2">
                  {similar.map((j, i) => <SimilarCard key={j.id} job={j} index={i} />)}
                </div>
                <div className="border-t border-gray-50 px-4 py-3">
                  <Link href="/jobs" className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:underline">
                    {t.jobDetail.viewAllJobs} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

          </animated.div>
        </div>
      </div>
    </div>
  )
}

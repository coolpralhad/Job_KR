"use client"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { MapPin, Clock, Users, Star, ArrowRight, Zap, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobs, daysAgo, type Job } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

// ── helpers ────────────────────────────────────────────────────────────────

function formatSalary(min: number, max: number): string {
  const isKorean = typeof navigator !== "undefined" && navigator.language.startsWith("ko")
  if (isKorean) {
    return `${(min / 10000).toFixed(0)}만 – ${(max / 10000).toFixed(0)}만원`
  }
  return `₩${(min / 1_000_000).toFixed(1)}M – ₩${(max / 1_000_000).toFixed(1)}M`
}

const visaStyle: Record<string, { bg: string; text: string; dot: string }> = {
  "E-7":  { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "E-9":  { bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500" },
  "H-2":  { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  "F-4":  { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  "F-6":  { bg: "bg-pink-100",   text: "text-pink-700",   dot: "bg-pink-500"   },
  "D-10": { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
}

// accent gradient per primary visa
const accentGradient: Record<string, string> = {
  "E-7":  "from-blue-500 to-indigo-500",
  "E-9":  "from-emerald-500 to-teal-500",
  "H-2":  "from-amber-400 to-orange-500",
  "F-4":  "from-purple-500 to-violet-500",
  "F-6":  "from-pink-500 to-rose-500",
  "D-10": "from-orange-500 to-red-400",
}

// ── Single card ─────────────────────────────────────────────────────────────

function FeaturedCard({ job, index }: { job: Job; index: number }) {
  const { t } = useLang()
  const primaryVisa = job.visaTypes[0] ?? "E-7"
  const gradient = accentGradient[primaryVisa] ?? "from-blue-500 to-indigo-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group"
    >
      <Link href={`/jobs/${job.id}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl">
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-[0_8px_40px_rgba(59,130,246,0.18)] group-focus-visible:shadow-[0_8px_40px_rgba(59,130,246,0.18)]">

          {/* Accent stripe */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

          {/* Card body */}
          <div className="flex flex-1 flex-col p-5">

            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg text-white shadow-sm`}>
                {job.company.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-900 transition-colors group-hover:text-blue-700">
                      {job.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                      <span className="truncate">{job.company.name}</span>
                      {job.company.verified && (
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-700 ring-1 ring-yellow-200">
                    {t.featured.featured}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3 shrink-0" /> {job.city}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                <Clock className="h-3 w-3 shrink-0" /> {job.jobType}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                <Users className="h-3 w-3 shrink-0" /> {job.applicants} {t.featured.applicants}
              </span>
            </div>

            {/* Visa + TOPIK tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.visaTypes.map((v) => {
                const s = visaStyle[v] ?? visaStyle["E-7"]
                return (
                  <span key={v} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {v}
                  </span>
                )
              })}
              {job.topikLevel && (
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  TOPIK {job.topikLevel}+
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-gray-100" />

            {/* Salary row */}
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-gray-900">
                {formatSalary(job.salary.min, job.salary.max)}
                <span className="ml-1 text-xs font-normal text-gray-400">
                  {typeof navigator !== "undefined" && navigator.language.startsWith("ko") ? "/월" : "/mo"}
                </span>
              </span>
              <span className="text-xs text-gray-400">{daysAgo(job.postedAt)}</span>
            </div>

            {/* CTA — dim until hovered */}
            <div className={`mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${gradient} py-2 text-sm font-semibold text-white opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-md group-focus-visible:opacity-100 group-focus-visible:shadow-md`}>
              {t.jobsPage.card.viewJob} <ArrowRight className="h-4 w-4" />
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────

const featuredJobs = jobs.filter((j) => j.featured)

export default function FeaturedJobsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useLang()

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white py-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
              Opportunities
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t.featured.title}
            </h2>
            <p className="mt-1.5 text-gray-500">
              {t.featured.subtitle}
            </p>
          </div>

          <Link
            href="/jobs"
            className="group hidden items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:border-blue-400 hover:shadow-md sm:flex"
          >
            {t.featured.viewAll.replace("→", "").trim()} ({jobs.length})
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job, i) => (
            <FeaturedCard key={job.id} job={job} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 text-center sm:hidden"
        >
          <Link href="/jobs">
            <Button className="gap-2 bg-blue-700 text-white hover:bg-blue-800">
              {t.featured.viewAll} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-blue-100 bg-white/80 px-6 py-4 text-xs text-gray-500 shadow-sm backdrop-blur-sm"
        >
          {[
            { icon: <BadgeCheck className="h-4 w-4 text-blue-500" />, label: t.jobsPage.trust.verified },
            { icon: <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />, label: t.jobsPage.trust.rating },
            { icon: <Zap className="h-4 w-4 text-green-500" />, label: t.jobsPage.trust.daily },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 font-medium">
              {item.icon} {item.label}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Briefcase, Building2, Users, CreditCard } from "lucide-react"

// ── Count-up ────────────────────────────────────────────────────────────────

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 80
    let step = 0
    const timer = setInterval(() => {
      step++
      // ease-out curve: fast start, slow finish
      const progress = 1 - Math.pow(1 - step / steps, 3)
      setCount(Math.floor(progress * target))
      if (step >= steps) {
        setCount(target)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ── Data ────────────────────────────────────────────────────────────────────

const stats = [
  {
    icon: Briefcase,
    target: 1200,
    suffix: "+",
    label: "Active Jobs",
    sub: "across Korea",
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/30",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-300",
    bar: "bg-blue-400",
  },
  {
    icon: Building2,
    target: 350,
    suffix: "+",
    label: "Verified Employers",
    sub: "hiring now",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/30",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-300",
    bar: "bg-emerald-400",
  },
  {
    icon: Users,
    target: 18000,
    suffix: "+",
    label: "Job Seekers",
    sub: "registered",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/30",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-300",
    bar: "bg-violet-400",
  },
  {
    icon: CreditCard,
    target: 6,
    suffix: "",
    label: "Visa Types",
    sub: "E-7 · E-9 · H-2 & more",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/30",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-300",
    bar: "bg-amber-400",
  },
]

// ── Component ───────────────────────────────────────────────────────────────

export default function AnimatedStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16"
    >
      {/* background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* subtle center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-blue-400"
        >
          Platform at a Glance
        </motion.p>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-shadow hover:shadow-xl ${s.glow}`}
              >
                {/* Top accent bar */}
                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${s.gradient}`} />

                {/* Icon */}
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <Icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>

                {/* Number */}
                <div className={`bg-gradient-to-r ${s.gradient} bg-clip-text text-4xl font-extrabold leading-none text-transparent`}>
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>

                {/* Label */}
                <p className="mt-2 text-sm font-semibold text-white">{s.label}</p>

                {/* Sub */}
                <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>

                {/* Animated bottom progress bar */}
                <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full rounded-full ${s.bar}`}
                    initial={{ width: "0%" }}
                    animate={inView ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 1.6, delay: i * 0.12 + 0.3, ease: "easeOut" }}
                  />
                </div>

                {/* Corner glow on hover */}
                <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />
              </motion.div>
            )
          })}
        </div>

        {/* Divider line with label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <span className="text-xs text-slate-500">Trusted by workers from 40+ countries</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </motion.div>

      </div>
    </section>
  )
}

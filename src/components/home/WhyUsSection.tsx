"use client"

import React from "react"
import { useSpring, useTrail, useInView, animated, config } from "@react-spring/web"
import { ShieldCheck, Zap, Globe2, HeadphonesIcon } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Employers Only",
    desc: "Every company is document-verified before posting. No scams, no ghost jobs.",
    stat: "100%",
    statLabel: "verified",
    from: "#2563eb", to: "#6366f1",
    num: 1,
  },
  {
    icon: Globe2,
    title: "Visa-Matched Results",
    desc: "Filter by your exact visa type. Only see jobs you're actually eligible for.",
    stat: "6",
    statLabel: "visa types",
    from: "#059669", to: "#0d9488",
    num: 2,
  },
  {
    icon: Zap,
    title: "AI-Powered Matching",
    desc: "Our AI scores your profile against each job and explains your fit in plain language.",
    stat: "98%",
    statLabel: "match accuracy",
    from: "#f59e0b", to: "#ea580c",
    num: 3,
  },
  {
    icon: HeadphonesIcon,
    title: "Multilingual Support",
    desc: "Platform supports English, Korean, and Nepali — apply without the language barrier.",
    stat: "3",
    statLabel: "languages",
    from: "#9333ea", to: "#ec4899",
    num: 4,
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const Icon = feature.icon
  const { t } = useLang()
  const tf = t.whyUs.features[index]
  const [ref, inView] = useInView({ once: true, rootMargin: "-50px 0px" })

  const entrance = useSpring({
    from: { opacity: 0, y: 28 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    delay: index * 100,
    config: { tension: 190, friction: 22 },
  })

  const [hovered, setHovered] = React.useState(false)

  const hover = useSpring({
    y: hovered ? -5 : 0,
    config: config.wobbly,
  })

  const iconScale = useSpring({
    scale:  hovered ? 1.1 : 1,
    config: config.wobbly,
  })

  return (
    <animated.div
      ref={ref}
      style={{
        opacity:   entrance.opacity,
        transform: entrance.y.to(y => `translateY(${y}px)`),
      }}
    >
      <animated.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform:  hover.y.to(y => `translateY(${y}px)`),
          boxShadow:  hovered ? `0 16px 40px ${feature.from}28` : "0 2px 8px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.35s ease",
        }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${feature.from}, ${feature.to})` }} />

        <div className="flex flex-1 flex-col gap-5 p-6">
          {/* Number + icon row */}
          <div className="flex items-start justify-between">
            <animated.div
              style={{ transform: iconScale.scale.to(s => `scale(${s})`), background: `linear-gradient(135deg, ${feature.from}, ${feature.to})` }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
            >
              <Icon className="h-6 w-6 text-white" />
            </animated.div>
            <span className="text-4xl font-black text-gray-100 select-none leading-none">
              0{feature.num}
            </span>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">{tf?.title ?? feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{tf?.desc ?? feature.desc}</p>
          </div>

          {/* Stat chip */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
            <span className="text-xl font-extrabold leading-none"
              style={{ background: `linear-gradient(135deg, ${feature.from}, ${feature.to})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {feature.stat}
            </span>
            <span className="text-xs text-gray-400">{feature.statLabel}</span>
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}

export default function WhyUsSection() {
  const [ref, inView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const { t } = useLang()

  const trail = useTrail(3, {
    from: { opacity: 0, y: 18 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    config: { tension: 210, friction: 22 },
  })

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20">

      {/* soft gradient backdrop */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, #eff6ff 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div ref={ref} className="mb-12 text-center">
          <animated.p style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}
            className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
            {t.whyUs.eyebrow}
          </animated.p>
          <animated.h2 style={{ opacity: trail[1].opacity, transform: trail[1].y.to(y => `translateY(${y}px)`) }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t.whyUs.title}
          </animated.h2>
          <animated.p style={{ opacity: trail[2].opacity, transform: trail[2].y.to(y => `translateY(${y}px)`) }}
            className="mx-auto mt-2 max-w-xl text-gray-500">
            {t.whyUs.subtitle}
          </animated.p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}

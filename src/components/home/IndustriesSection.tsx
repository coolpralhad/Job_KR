"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useSpring, useTrail, useInView, animated, config } from "@react-spring/web"
import {
  Factory, Monitor, Wheat, HardHat,
  Hotel, HeartPulse, GraduationCap, Truck,
  ArrowUpRight,
} from "lucide-react"
import { jobs, industries } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

const industryData = [
  {
    name: "Manufacturing",
    icon: Factory,
    img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=85",
    imgAlt: "Workers on a factory production line in South Korea",
    from: "#2563eb", to: "#06b6d4",
    span: "lg:col-span-2",   // wide card
  },
  {
    name: "IT & Software",
    icon: Monitor,
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=85",
    imgAlt: "Developer working on code on laptop screens",
    from: "#7c3aed", to: "#6366f1",
    span: "",
  },
  {
    name: "Agriculture",
    icon: Wheat,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=85",
    imgAlt: "Green farm fields at sunrise in rural Korea",
    from: "#059669", to: "#16a34a",
    span: "",
  },
  {
    name: "Construction",
    icon: HardHat,
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&q=85",
    imgAlt: "Construction workers on a building site wearing hard hats",
    from: "#ea580c", to: "#d97706",
    span: "",
  },
  {
    name: "Hospitality",
    icon: Hotel,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85",
    imgAlt: "Elegant restaurant interior with warm lighting",
    from: "#db2777", to: "#e11d48",
    span: "",
  },
  {
    name: "Healthcare",
    icon: HeartPulse,
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&q=85",
    imgAlt: "Medical professional in a hospital corridor",
    from: "#dc2626", to: "#e11d48",
    span: "",
  },
  {
    name: "Education",
    icon: GraduationCap,
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&q=85",
    imgAlt: "Teacher with students in a bright classroom",
    from: "#0d9488", to: "#0891b2",
    span: "",
  },
  {
    name: "Logistics",
    icon: Truck,
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=85",
    imgAlt: "Warehouse and logistics distribution centre with workers",
    from: "#d97706", to: "#ea580c",
    span: "lg:col-span-2",   // wide card
  },
]

const jobCount = industries.reduce<Record<string, number>>((acc, ind) => {
  acc[ind] = jobs.filter((j) => j.industry === ind).length
  return acc
}, {})

// ── Single card ───────────────────────────────────────────────────────────────

function IndustryCard({ item, index, wide }: {
  item: typeof industryData[number]; index: number; wide: boolean
}) {
  const Icon = item.icon
  const count = jobCount[item.name] ?? 0
  const [hovered, setHovered] = useState(false)

  const [ref, inView] = useInView({ once: true, rootMargin: "-60px 0px" })

  const entrance = useSpring({
    from: { opacity: 0, y: 28, scale: 0.97 },
    to: inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 },
    delay: index * 80,
    config: { tension: 190, friction: 22 },
  })

  const hover = useSpring({
    scale: hovered ? 1.03 : 1,
    config: config.wobbly,
  })

  const overlay = useSpring({
    opacity: hovered ? 0.55 : 0,
    config: { tension: 200, friction: 26 },
  })

  const arrow = useSpring({
    opacity:   hovered ? 1 : 0,
    transform: hovered ? "translate(0px,0px)" : "translate(-6px,6px)",
    config: config.stiff,
  })

  const textSlide = useSpring({
    y: hovered ? -4 : 0,
    config: { tension: 260, friction: 22 },
  })

  return (
    <animated.div
      ref={ref}
      style={{ ...entrance, transform: entrance.y.to(y => `translateY(${y}px) scale(${1})`) }}
      className={item.span}
    >
      <Link href={`/jobs?industry=${encodeURIComponent(item.name)}`} tabIndex={-1}>
        <animated.div
          style={{ transform: hover.scale.to(s => `scale(${s})`) }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`group relative overflow-hidden rounded-2xl ${wide ? "aspect-[16/7]" : "aspect-[4/5]"} cursor-pointer shadow-md`}
        >
          {/* Photo */}
          <Image
            src={item.img}
            alt={item.imgAlt}
            fill
            sizes={wide ? "(max-width:1024px) 100vw, 50vw" : "(max-width:640px) 50vw, 25vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Always-on dark gradient – bottom heavy, light at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Colour wash on hover */}
          <animated.div
            style={{ opacity: overlay.opacity, background: `linear-gradient(135deg, ${item.from}99, ${item.to}66)` }}
            className="absolute inset-0"
          />

          {/* Top-right arrow */}
          <animated.div
            style={arrow}
            className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30"
          >
            <ArrowUpRight className="h-4 w-4 text-white" />
          </animated.div>

          {/* Bottom panel */}
          <animated.div
            style={{ transform: textSlide.y.to(y => `translateY(${y}px)`) }}
            className="absolute inset-x-0 bottom-0 p-4 sm:p-5"
          >
            {/* Icon pill */}
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm ring-1 ring-white/20"
              style={{ background: `linear-gradient(135deg, ${item.from}cc, ${item.to}cc)` }}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.name}
            </div>

            {/* Count + label row */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className={`font-extrabold leading-none text-white drop-shadow ${wide ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                  {count}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-white/70">open positions</p>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm ring-1 ring-white/20">
                View all →
              </span>
            </div>
          </animated.div>

        </animated.div>
      </Link>
    </animated.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function IndustriesSection() {
  const [headerRef, headerInView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const { t } = useLang()

  const headerTrail = useTrail(3, {
    from: { opacity: 0, y: 20 },
    to: headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    config: { tension: 200, friction: 22 },
  })

  const ctaSpring = useSpring({
    from: { opacity: 0, y: 16 },
    to: headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    delay: 900,
    config: { tension: 180, friction: 22 },
  })

  return (
    <section className="relative overflow-hidden bg-gray-950 py-20">

      {/* Faint dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-blue-600 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 rounded-full bg-violet-600 opacity-10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="mb-10 flex flex-col items-center gap-1 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <animated.div style={{ opacity: headerTrail[0].opacity, transform: headerTrail[0].y.to(y => `translateY(${y}px)`) }}>
              <span className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/60">
                Explore
              </span>
            </animated.div>
            <animated.div style={{ opacity: headerTrail[1].opacity, transform: headerTrail[1].y.to(y => `translateY(${y}px)`) }}>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t.industries.title}</h2>
            </animated.div>
            <animated.div style={{ opacity: headerTrail[2].opacity, transform: headerTrail[2].y.to(y => `translateY(${y}px)`) }}>
              <p className="mt-1 text-gray-400">{t.industries.subtitle}</p>
            </animated.div>
          </div>
          <animated.div style={{ opacity: headerTrail[2].opacity }}>
            <Link href="/jobs"
              className="hidden items-center gap-1 text-sm font-semibold text-white/60 transition-colors hover:text-white sm:flex">
              {t.industries.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </animated.div>
        </div>

        {/* Bento grid — Manufacturing and Logistics are wide (col-span-2) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {industryData.map((item, i) => (
            <IndustryCard key={item.name} item={item} index={i} wide={!!item.span} />
          ))}
        </div>

        {/* Bottom CTA */}
        <animated.div style={ctaSpring} className="mt-10 text-center">
          <Link href="/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20">
            Browse all {jobs.length} open positions <ArrowUpRight className="h-4 w-4" />
          </Link>
        </animated.div>

      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { useSpring, useTrail, useSprings, useInView, animated, config } from "@react-spring/web"
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

const testimonials = [
  {
    name:    "Ramesh Thapa",
    role:    "Factory Worker",
    visa:    "E-9 Visa",
    flag:    "🇳🇵",
    country: "Nepal",
    rating:  5,
    text:    "Found my job in Incheon within 2 weeks. The visa filter saved me so much time — no more applying to jobs I'm not eligible for.",
    company: "Incheon Manufacturing Co.",
    from: "#2563eb", to: "#6366f1",
  },
  {
    name:    "Maria Santos",
    role:    "IT Engineer",
    visa:    "E-7 Visa",
    flag:    "🇵🇭",
    country: "Philippines",
    rating:  5,
    text:    "JOB-KR showed me employers who actually welcome international applicants. Got hired at a Seoul startup with full visa sponsorship.",
    company: "Seoul Tech Startup",
    from: "#7c3aed", to: "#ec4899",
  },
  {
    name:    "Nguyen Van Minh",
    role:    "Logistics Staff",
    visa:    "H-2 Visa",
    flag:    "🇻🇳",
    country: "Vietnam",
    rating:  5,
    text:    "The TOPIK level filter helped me find jobs that matched my Korean level. The AI explanation feature made tricky job descriptions easy.",
    company: "Busan Logistics Hub",
    from: "#059669", to: "#0d9488",
  },
  {
    name:    "Priya Sharma",
    role:    "ESL Teacher",
    visa:    "E-7 Visa",
    flag:    "🇮🇳",
    country: "India",
    rating:  5,
    text:    "Applied to 3 schools and got 2 interviews within a week. The verified employer badge gave me confidence the listings were legitimate.",
    company: "Gangnam Language School",
    from: "#d97706", to: "#f59e0b",
  },
  {
    name:    "Carlos Mendez",
    role:    "Construction Worker",
    visa:    "E-9 Visa",
    flag:    "🇲🇽",
    country: "Mexico",
    rating:  4,
    text:    "I was nervous about the application in English but the platform walked me through every step. My Korean is basic but I found great work.",
    company: "Seoul Construction Group",
    from: "#ea580c", to: "#d97706",
  },
]

function StarRow({ count }: { count: number }) {
  const springs = useSprings(count, [...Array(count)].map((_, i) => ({
    from: { scale: 0, rotate: -20 },
    to:   { scale: 1, rotate: 0 },
    delay: 300 + i * 60,
    config: config.wobbly,
  })))
  return (
    <div className="flex gap-1">
      {springs.map((s, i) => (
        <animated.div key={i} style={{ transform: s.scale.to(sc => `scale(${sc}) rotate(${0}deg)`) }}>
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </animated.div>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, index, active }: {
  testimonial: typeof testimonials[number]; index: number; active: boolean
}) {
  const [ref, inView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const { t } = useLang()

  const spring = useSpring({
    from: { opacity: 0, y: 28, scale: 0.95 },
    to: inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.95 },
    delay: index * 100,
    config: { tension: 190, friction: 22 },
  })

  const [hovered, setHovered] = useState(false)
  const hover = useSpring({
    y: hovered ? -6 : 0,
    config: config.wobbly,
  })

  return (
    <animated.div
      ref={ref}
      style={{ opacity: spring.opacity, transform: spring.y.to(y => `translateY(${y}px)`) }}
    >
      <animated.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform:  hover.y.to(y => `translateY(${y}px)`),
          boxShadow:  hovered ? `0 20px 48px ${testimonial.from}28` : "0 2px 12px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.35s ease",
        }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
      >
        {/* Top accent */}
        <div className="h-1" style={{ background: `linear-gradient(to right, ${testimonial.from}, ${testimonial.to})` }} />

        <div className="flex flex-1 flex-col gap-4 p-6">
          {/* Stars */}
          <StarRow count={testimonial.rating} />

          {/* Quote */}
          <div className="relative flex-1">
            <Quote className="absolute -left-1 -top-1 h-8 w-8 opacity-10" style={{ color: testimonial.from }} />
            <p className="relative z-10 text-sm leading-relaxed text-gray-600 pl-1">&ldquo;{testimonial.text}&rdquo;</p>
          </div>

          {/* Company badge */}
          <div className="rounded-xl px-3 py-2 text-xs font-medium"
            style={{ background: `${testimonial.from}10`, color: testimonial.from }}>
            {t.testimonials.hiredAt} {testimonial.company}
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ring-2 ring-offset-1"
              style={{ background: `linear-gradient(135deg, ${testimonial.from}22, ${testimonial.to}22)` }}>
              {testimonial.flag}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
              <p className="text-xs text-gray-400">{testimonial.role} · <span className="font-medium" style={{ color: testimonial.from }}>{testimonial.visa}</span></p>
            </div>
            <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-green-500" />
          </div>
        </div>
      </animated.div>
    </animated.div>
  )
}

export default function TestimonialsSection() {
  const [page, setPage] = useState(0)
  const { t } = useLang()
  const perPage = 3
  const totalPages = Math.ceil(testimonials.length / perPage)
  const visible = testimonials.slice(page * perPage, page * perPage + perPage)

  const [headerRef, headerInView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const trail = useTrail(3, {
    from: { opacity: 0, y: 18 },
    to: headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    config: { tension: 210, friction: 22 },
  })

  // Stat counter
  const [statRef, statInView] = useInView({ once: true })
  const statSpring = useSpring({
    from: { val: 0 },
    to:   { val: statInView ? 18000 : 0 },
    config: { ...config.molasses, duration: 1200 },
  })

  const pageDot = useSpring({
    x: page * 20,
    config: config.stiff,
  })

  return (
    <section className="relative overflow-hidden bg-white py-20">

      {/* Top wave from previous dark section */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, #f9fafb, white)" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header row */}
        <div ref={headerRef} className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <animated.p style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}
              className="mb-1 text-sm font-bold uppercase tracking-widest text-blue-600">
              {t.testimonials.title}
            </animated.p>
            <animated.h2 style={{ opacity: trail[1].opacity, transform: trail[1].y.to(y => `translateY(${y}px)`) }}
              className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t.testimonials.subtitle}
            </animated.h2>
            <animated.p style={{ opacity: trail[2].opacity, transform: trail[2].y.to(y => `translateY(${y}px)`) }}
              className="mt-1 text-gray-500">
              {t.testimonials.subtitle}
            </animated.p>
          </div>

          {/* Live stat */}
          <animated.div ref={statRef} style={{ opacity: trail[2].opacity }}
            className="shrink-0 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 text-center">
            <p className="text-2xl font-extrabold text-blue-700">
              <animated.span>{statSpring.val.to(v => `${Math.floor(v / 1000)}k+`)}</animated.span>
            </p>
            <p className="text-xs text-blue-500">{t.testimonials.workersPlaced}</p>
          </animated.div>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((testimonial, i) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={i} active={i === 0} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="relative flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-6 bg-blue-600" : "w-2 bg-gray-200 hover:bg-gray-400"}`} />
              ))}
            </div>

            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

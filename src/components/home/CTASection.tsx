"use client"

import Link from "next/link"
import { useState } from "react"
import { useSpring, useTrail, useSprings, useInView, animated, config } from "@react-spring/web"
import { ArrowRight, Zap, Building2, Users } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

// ── Floating orbs ─────────────────────────────────────────────────────────────

function Orbs() {
  const springs = useSprings(4, [
    { from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, config: { tension: 45, friction: 16 } },
    { from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, delay: 150, config: { tension: 45, friction: 16 } },
    { from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, delay: 280, config: { tension: 45, friction: 16 } },
    { from: { opacity: 0, scale: 0.4 }, to: { opacity: 1, scale: 1 }, delay: 400, config: { tension: 45, friction: 16 } },
  ])
  const orbs = [
    { color: "#facc15", size: 320, left: -120, top: -80 },
    { color: "#3b82f6", size: 240, right: -80, top: -40 },
    { color: "#a855f7", size: 200, left: "40%", bottom: -60 },
    { color: "#f97316", size: 160, right: "15%", top: "30%" },
  ]
  return (
    <>
      {orbs.map((o, i) => (
        <animated.div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: o.size, height: o.size,
          background: o.color,
          opacity: springs[i].opacity.to(v => v * 0.15),
          transform: springs[i].scale.to(s => `scale(${s})`),
          filter: "blur(70px)", pointerEvents: "none",
          left: (o as any).left, top: (o as any).top,
          right: (o as any).right, bottom: (o as any).bottom,
        }} />
      ))}
    </>
  )
}

// ── Animated count ────────────────────────────────────────────────────────────

function AnimCount({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [ref, inView] = useInView({ once: true })
  const s = useSpring({ from: { v: 0 }, to: { v: inView ? end : 0 }, config: { ...config.molasses, duration: 1100 } })
  return <animated.span ref={ref}>{s.v.to(v => `${Math.floor(v).toLocaleString()}${suffix}`)}</animated.span>
}

// ── CTA section ───────────────────────────────────────────────────────────────

export default function CtaSection() {
  const [ref, inView] = useInView({ once: true, rootMargin: "-40px 0px" })
  const { t } = useLang()
  const trail = useTrail(5, {
    from: { opacity: 0, y: 22 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    config: { tension: 200, friction: 22 },
  })

  const [btn1Hover, setBtn1Hover] = useState(false)
  const [btn2Hover, setBtn2Hover] = useState(false)

  const btn1 = useSpring({
    scale: btn1Hover ? 1.05 : 1,
    boxShadow: btn1Hover ? "0 12px 36px rgba(250,204,21,0.45)" : "0 4px 16px rgba(250,204,21,0.2)",
    config: config.wobbly,
  })
  const btn2 = useSpring({
    scale: btn2Hover ? 1.05 : 1,
    boxShadow: btn2Hover ? "0 12px 36px rgba(255,255,255,0.18)" : "0 0px 0px rgba(255,255,255,0)",
    config: config.wobbly,
  })

  return (
    <>
      {/* ── Main CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-950 py-24 text-white">

        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <Orbs />

        <div ref={ref} className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">

          {/* Badge */}
          <animated.div style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-sm font-semibold text-yellow-300">
              <Zap className="h-4 w-4" /> {t.cta.freeBadge}
            </span>
          </animated.div>

          {/* Headline */}
          <animated.h2 style={{ opacity: trail[1].opacity, transform: trail[1].y.to(y => `translateY(${y}px)`) }}
            className="text-4xl font-black leading-tight sm:text-5xl">
            {t.cta.title}
          </animated.h2>

          {/* Sub */}
          <animated.p style={{ opacity: trail[2].opacity, transform: trail[2].y.to(y => `translateY(${y}px)`) }}
            className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            {t.cta.subtitle}
          </animated.p>

          {/* Stats row */}
          <animated.div style={{ opacity: trail[3].opacity, transform: trail[3].y.to(y => `translateY(${y}px)`) }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            {[
              { icon: Users, label: t.cta.statSeekers, end: 18000, suffix: "+" },
              { icon: Building2, label: t.cta.statEmployers, end: 450, suffix: "+" },
              { icon: Zap, label: t.cta.statMatched, end: 2400, suffix: "+" },
            ].map(({ icon: Icon, label, end, suffix }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <Icon className="h-4 w-4 text-yellow-400" />
                <span className="font-extrabold text-white"><AnimCount end={end} suffix={suffix} /></span>
                <span className="text-gray-500">{label}</span>
              </div>
            ))}
          </animated.div>

          {/* Buttons */}
          <animated.div style={{ opacity: trail[4].opacity, transform: trail[4].y.to(y => `translateY(${y}px)`) }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register?role=seeker">
              <animated.div
                onMouseEnter={() => setBtn1Hover(true)}
                onMouseLeave={() => setBtn1Hover(false)}
                style={{ transform: btn1.scale.to(s => `scale(${s})`), boxShadow: btn1.boxShadow }}
                className="flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-3.5 text-sm font-extrabold text-gray-900"
              >
                {t.cta.btn1} <ArrowRight className="h-4 w-4" />
              </animated.div>
            </Link>
            <Link href="/jobs">
              <animated.div
                onMouseEnter={() => setBtn2Hover(true)}
                onMouseLeave={() => setBtn2Hover(false)}
                style={{ transform: btn2.scale.to(s => `scale(${s})`), boxShadow: btn2.boxShadow }}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm"
              >
                {t.cta.btn2}
              </animated.div>
            </Link>
          </animated.div>

          <p className="mt-5 text-xs text-gray-600">{t.cta.disclaimer}</p>
        </div>
      </section>

      {/* ── For Employers strip ───────────────────────────────────────────── */}
      <EmployersStrip />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer />
    </>
  )
}

// ── Employers strip ───────────────────────────────────────────────────────────

function EmployersStrip() {
  const [ref, inView] = useInView({ once: true, rootMargin: "-20px 0px" })
  const { t } = useLang()
  const spring = useSpring({
    from: { opacity: 0, y: 16 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    config: { tension: 200, friction: 22 },
  })

  const [btnHover, setBtnHover] = useState(false)
  const btn = useSpring({ scale: btnHover ? 1.04 : 1, config: config.wobbly })

  return (
    <div className="border-y border-gray-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50">
      <animated.div ref={ref} style={spring}
        className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900">{t.cta.employers}</h3>
            <p className="mt-0.5 text-sm text-gray-500">{t.cta.subtitle}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/employers"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
            {t.cta.learnMore}
          </Link>
          <Link href="/auth/register?role=employer">
            <animated.div
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{ transform: btn.scale.to(s => `scale(${s})`) }}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm hover:shadow-md transition-shadow"
            >
              {t.cta.postJob} <ArrowRight className="h-4 w-4" />
            </animated.div>
          </Link>
        </div>
      </animated.div>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const [ref, inView] = useInView({ once: true, rootMargin: "-20px 0px" })
  const { t } = useLang()
  const spring = useSpring({
    from: { opacity: 0, y: 20 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    config: { tension: 180, friction: 24 },
  })

  const seekerLinks = [
    { href: "/jobs",          label: t.footer.seeker.browseJobs },
    { href: "/companies",     label: t.footer.seeker.companies },
    { href: "/visa-guide",    label: t.footer.seeker.visaGuide },
    { href: "/auth/register", label: t.footer.seeker.register },
    { href: "/faq",           label: t.footer.seeker.faq },
  ]
  const employerLinks = [
    { href: "/employers",                    label: t.footer.employer.postJob },
    { href: "/employers/candidates",         label: t.footer.employer.findCandidates },
    { href: "/auth/register?role=employer",  label: t.footer.employer.signUp },
    { href: "/privacy",                      label: t.footer.employer.privacy },
  ]

  return (
    <footer className="bg-gray-950 pt-14 pb-8">
      <animated.div ref={ref} style={spring} className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="grid gap-10 sm:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <img src="/okkorea_icon.svg" alt="OK Korea" className="h-10 w-10" />
              <img src="/okkorea_logo.svg" alt="오케이코리아" className="h-9 w-auto brightness-0 invert" />
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-blue-400">{t.footer.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              {t.footer.description}
            </p>
            {/* Visa badges */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {["E-7", "E-9", "H-2", "F-4", "F-6", "D-10"].map(v => (
                <span key={v} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-300">{v}</span>
              ))}
            </div>

            {/* Company info */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Company Info</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <p className="text-xs text-gray-300">
                  <span className="text-gray-500">CEO</span> &nbsp;Kim Ho-yeon
                </p>
                <p className="text-xs text-gray-300">
                  <span className="text-gray-500">Reg.</span> &nbsp;218-05-72997
                </p>
              </div>
              <p className="text-xs text-gray-300">
                <span className="text-gray-500">Head Office</span> &nbsp;Room 4-38, 4F, 367-2 Suseong-ro, Suseong-gu, Daegu
              </p>
              <p className="text-xs text-gray-300">
                <span className="text-gray-500">Training</span> &nbsp;Rooms 220–221, Bldg B, Taewang Alpha City Suseong, Suseong-gu, Daegu
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-white/10">
                <a href="tel:070-7012-2881" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  📞 070-7012-2881
                </a>
                <a href="mailto:changhyeok@naver.com" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  ✉ changhyeok@naver.com
                </a>
              </div>
            </div>
          </div>

          {/* Seekers */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">{t.footer.forSeekers}</p>
            <ul className="space-y-2.5">
              {seekerLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="h-px w-3 shrink-0 bg-gray-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">{t.footer.forEmployers}</p>
            <ul className="space-y-2.5">
              {employerLinks.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
                    <span className="h-px w-3 shrink-0 bg-gray-600" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-2 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} 오케이코리아 (OK Korea). {t.footer.copyright}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">{t.footer.terms}</Link>
            <Link href="/faq" className="hover:text-gray-300 transition-colors">{t.footer.seeker.faq}</Link>
            <span className="text-gray-600">{t.footer.location}</span>
          </div>
        </div>

      </animated.div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSpring, useSprings, useTrail, animated, config } from "@react-spring/web"
import { createClient } from "@/lib/supabase/client"
import {
  Menu, X, Globe, ChevronDown, Briefcase, User,
  LayoutDashboard, LogOut, ShieldCheck, Settings,
  PlusCircle, Sparkles, Bell,
  ArrowRight, Zap,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLang } from "@/lib/i18n/context"
import LanguageSwitcher from "@/components/LanguageSwitcher"

type Props = {
  user: { id: string; email: string } | null
  role: "candidate" | "employer" | "admin" | null
}

const navLinks = [
  { href: "/jobs",       key: "jobs",       badge: null },
  { href: "/companies",  key: "companies",  badge: null },
  { href: "/visa-guide", key: "visaGuide",  badge: "New" },
  { href: "/employers",  key: "employers",  badge: null },
] as const

function dashboardHref(role: string | null) {
  if (role === "employer") return "/employer/dashboard"
  if (role === "admin")    return "/admin"
  return "/dashboard"
}

// ── Pulsing logo dot ──────────────────────────────────────────────────────────
function PulseDot() {
  const [flip, setFlip] = useState(false)
  const s = useSpring({
    scale: flip ? 1.35 : 1,
    config: { tension: 280, friction: 12 },
    onRest: () => setFlip(f => !f),
  })
  return (
    <animated.div
      style={{ transform: s.scale.to(sc => `scale(${sc})`) }}
      className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-yellow-400 ring-2 ring-white"
    >
      <Sparkles className="h-1.5 w-1.5 text-yellow-800" />
    </animated.div>
  )
}

export default function NavbarClient({ user, role }: Props) {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()
  const { t }     = useLang()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [dismissed,    setDismissed]    = useState(false)
  const [hoveredLink,  setHoveredLink]  = useState<number | null>(null)

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // ── Spring: navbar slide-in ─────────────────────────────────────────────────
  const navbarEntrance = useSpring({
    from: { opacity: 0, y: -72 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 220, friction: 26 },
  })

  // ── Spring: scroll shadow ───────────────────────────────────────────────────
  const navbarScroll = useSpring({
    boxShadow: scrolled
      ? "0 4px 28px rgba(0,0,0,0.09)"
      : "0 1px 4px rgba(0,0,0,0.04)",
    config: { tension: 180, friction: 28 },
  })

  // ── Spring: announce bar dismiss ───────────────────────────────────────────
  const announceSpring = useSpring({
    height:  dismissed ? 0   : 38,
    opacity: dismissed ? 0   : 1,
    config: config.stiff,
  })

  // ── Springs: nav link active/hover underline ───────────────────────────────
  const linkSprings = useSprings(navLinks.length, navLinks.map((link, i) => {
    const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
    const isHover  = hoveredLink === i
    return {
      scaleX:      isActive ? 1 : isHover ? 0.6 : 0,
      textColor:   isActive ? "#1d4ed8" : isHover ? "#1e293b" : "#6b7280",
      background:  isActive ? "#eff6ff" : isHover ? "#f8fafc" : "rgba(0,0,0,0)",
      config: config.stiff,
    }
  }))

  // ── Spring: mobile drawer ─────────────────────────────────────────────────
  const drawerSpring = useSpring({
    x:       mobileOpen ? 0   : 320,
    opacity: mobileOpen ? 1   : 0.4,
    config:  { tension: 320, friction: 30 },
  })
  const overlaySpring = useSpring({
    opacity:       mobileOpen ? 1 : 0,
    pointerEvents: (mobileOpen ? "all" : "none") as any,
    config: config.stiff,
  })

  // ── Spring: mobile nav link trail ─────────────────────────────────────────
  const mobileTrail = useTrail(navLinks.length + 1, {
    from: { opacity: 0, x: 18 },
    to:   mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 },
    config: { tension: 260, friction: 24 },
    reset: true,
  })

  // ── Spring: hamburger icon rotation ───────────────────────────────────────
  const hamburgerSpring = useSpring({
    rotate: mobileOpen ? 90 : 0,
    config: config.stiff,
  })

  // ── Spring: CTA button hover ──────────────────────────────────────────────
  const [ctaHover, setCtaHover] = useState(false)
  const ctaSpring = useSpring({
    scale: ctaHover ? 1.05 : 1,
    boxShadow: ctaHover ? "0 6px 20px rgba(79,70,229,0.35)" : "0 2px 8px rgba(79,70,229,0.15)",
    config: config.wobbly,
  })

  // ── Auth link sets ─────────────────────────────────────────────────────────
  const candidateLinks = [
    { href: "/dashboard",    label: t.nav.dashboard,       icon: LayoutDashboard },
    { href: "/applications", label: t.nav.myApplications,  icon: Briefcase },
    { href: "/saved-jobs",   label: t.savedJobs.title,      icon: Briefcase },
    { href: "/alerts",       label: t.alerts.title,         icon: Bell },
  ]
  const employerLinks = [
    { href: "/employer/dashboard",  label: "Dashboard",       icon: LayoutDashboard },
    { href: "/employer/jobs",       label: "My Jobs",         icon: Briefcase },
    { href: "/employer/candidates", label: "Find Candidates", icon: User },
    { href: "/employer/pipeline",   label: "Pipeline",        icon: Briefcase },
  ]
  const adminLinks = [
    { href: "/admin",              label: "Admin Dashboard", icon: ShieldCheck },
    { href: "/admin/verification", label: "Verifications",   icon: ShieldCheck },
    { href: "/admin/payments",     label: "Payments",        icon: ShieldCheck },
  ]
  const authLinks = role === "employer" ? employerLinks : role === "admin" ? adminLinks : candidateLinks

  return (
    <animated.header
      style={{ ...navbarEntrance, transform: navbarEntrance.y.to(y => `translateY(${y}px)`) }}
      className="sticky top-0 z-50 w-full"
    >
      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <animated.div style={announceSpring} className="overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 px-4 text-white" style={{ height: 38 }}>
          <div className="flex flex-1 items-center justify-center gap-2 text-xs font-medium">
            <Zap className="h-3.5 w-3.5 text-yellow-300 shrink-0" />
            <span>{t.nav.announcement}</span>
          </div>
          <button onClick={() => setDismissed(true)}
            className="shrink-0 rounded-lg p-1 text-white/70 hover:text-white transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </animated.div>

      {/* ── Gradient accent line ─────────────────────────────────────────── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <animated.div
        style={navbarScroll}
        className="border-b border-gray-100 bg-white/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

          {/* ── Logo ───────────────────────────────────────────────────── */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <img src="/okkorea_icon.svg" alt="OK Korea" className="h-9 w-9" />
              <PulseDot />
            </div>
            <img src="/okkorea_logo.svg" alt="오케이코리아" className="h-8 w-auto" />
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────────── */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link, i) => (
              <Link key={link.href} href={link.href}
                onMouseEnter={() => setHoveredLink(i)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium outline-none"
                style={{ color: linkSprings[i].textColor as any }}
              >
                {/* Hover/active bg */}
                <animated.span
                  style={{ background: linkSprings[i].background }}
                  className="absolute inset-0 rounded-xl"
                />
                <span className="relative z-10">{(t.nav as any)[link.key] ?? link.key}</span>
                {link.badge && (
                  <span className="relative z-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
                {/* Active underline */}
                <animated.span
                  style={{ scaleX: linkSprings[i].scaleX, transformOrigin: "left" }}
                  className="absolute bottom-1.5 left-3.5 right-3.5 h-0.5 rounded-full bg-blue-600"
                />
              </Link>
            ))}
          </nav>

          {/* ── Right side ────────────────────────────────────────────── */}
          <div className="hidden items-center gap-2 md:flex">

            {/* Language picker */}
            <LanguageSwitcher variant="light" />

            <div className="h-5 w-px bg-gray-200" />

            {/* Post a Job */}
            <Link href={role === "employer" ? "/employer/jobs/create" : "/employers"}>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-100 hover:shadow-sm">
                <PlusCircle className="h-3.5 w-3.5" /> {t.nav.postJob}
              </button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate text-xs">{user.email}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                    <p className="text-xs font-semibold capitalize text-gray-700">{role ?? "user"}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {authLinks.map(link => (
                    <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}
                      className="flex cursor-pointer items-center gap-2">
                      <link.icon className="h-4 w-4 text-gray-400" /> {link.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/account/settings")}
                    className="flex cursor-pointer items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-400" /> {t.nav.settings}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}
                    className="flex cursor-pointer items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" /> {t.nav.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <button className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                    {t.nav.login}
                  </button>
                </Link>
                <Link href="/auth/register">
                  <animated.button
                    onMouseEnter={() => setCtaHover(true)}
                    onMouseLeave={() => setCtaHover(false)}
                    style={{ transform: ctaSpring.scale.to(s => `scale(${s})`), boxShadow: ctaSpring.boxShadow }}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-sm font-semibold text-white"
                  >
                    {t.nav.getStarted}
                  </animated.button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100"
          >
            <animated.div style={{ transform: hamburgerSpring.rotate.to(r => `rotate(${r}deg)`) }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </animated.div>
          </button>
        </div>
      </animated.div>

      {/* ── Mobile overlay ───────────────────────────────────────────────── */}
      <animated.div
        onClick={() => setMobileOpen(false)}
        style={overlaySpring}
        className="fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-sm md:hidden"
      />

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <animated.div
        style={{ transform: drawerSpring.x.to(x => `translateX(${x}px)`), opacity: drawerSpring.opacity }}
        className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl md:hidden"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <img src="/okkorea_icon.svg" alt="OK Korea" className="h-9 w-9" />
            <img src="/okkorea_logo.svg" alt="오케이코리아" className="h-8 w-auto" />
          </div>
          <button onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer nav links */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pt-4">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <animated.div key={link.href}
                style={{ opacity: mobileTrail[i].opacity, transform: mobileTrail[i].x.to(x => `translateX(${x}px)`) }}>
                <Link href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span className="flex items-center gap-2">
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                    {(t.nav as any)[link.key] ?? link.key}
                  </span>
                  {link.badge && (
                    <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">{link.badge}</span>
                  )}
                </Link>
              </animated.div>
            )
          })}

          {/* Post a Job */}
          <animated.div style={{ opacity: mobileTrail[navLinks.length].opacity, transform: mobileTrail[navLinks.length].x.to(x => `translateX(${x}px)`) }}>
            <Link href={role === "employer" ? "/employer/jobs/create" : "/employers"}
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100">
              <PlusCircle className="h-4 w-4" /> {t.nav.postJob}
            </Link>
          </animated.div>
        </div>

        {/* Drawer bottom */}
        <div className="border-t border-gray-100 px-3 pb-6 pt-4">
          {user ? (
            <div className="flex flex-col gap-1">
              <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs capitalize text-gray-400">{role ?? "user"}</p>
                </div>
              </div>
              {authLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <link.icon className="h-4 w-4 text-gray-400" /> {link.label}
                </Link>
              ))}
              <button onClick={signOut}
                className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> {t.nav.signOut}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Language switcher */}
              <div className="mb-1">
                <LanguageSwitcher variant="light" />
              </div>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50">
                {t.nav.login}
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-center text-sm font-bold text-white shadow-sm">
                {t.nav.getStartedFree}
              </Link>
            </div>
          )}
        </div>
      </animated.div>
    </animated.header>
  )
}

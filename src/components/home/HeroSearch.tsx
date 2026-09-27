"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSpring, useTrail, animated, config } from "@react-spring/web"
import { Search, MapPin, ArrowRight } from "lucide-react"
import { cities } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

const popular = ["E-9 Factory", "E-7 IT", "Seoul Tech", "Farming", "Logistics"]

export default function HeroSearch() {
  const router = useRouter()
  const { t }  = useLang()
  const h      = t.hero
  const [query,    setQuery]    = useState("")
  const [city,     setCity]     = useState("")
  const [focused,  setFocused]  = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (city)  params.set("city", city)
    router.push(`/jobs${params.toString() ? "?" + params.toString() : ""}`)
  }

  // ── Form glass wrapper spring ───────────────────────────────────────────────
  const wrapperSpring = useSpring({
    boxShadow: focused
      ? "0 0 0 2px rgba(250,204,21,0.6), 0 20px 48px rgba(0,0,0,0.28)"
      : "0 8px 32px rgba(0,0,0,0.22)",
    config: config.stiff,
  })

  // ── Search button spring ────────────────────────────────────────────────────
  const btnSpring = useSpring({
    scale:     btnHover ? 1.04 : 1,
    boxShadow: btnHover ? "0 8px 24px rgba(250,204,21,0.5)" : "0 2px 8px rgba(250,204,21,0.2)",
    config: config.wobbly,
  })

  // ── Popular tags trail ──────────────────────────────────────────────────────
  const tagTrail = useTrail(popular.length, {
    from: { opacity: 0, x: 12 },
    to:   { opacity: 1, x: 0 },
    delay: 600,
    config: { tension: 260, friction: 22 },
  })

  return (
    <div className="mt-8">

      {/* Glass search form */}
      <animated.form
        onSubmit={handleSearch}
        style={{ ...wrapperSpring, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)" }}
        className="mx-auto flex max-w-2xl overflow-hidden rounded-2xl"
      >
        <div className="flex flex-1 flex-col sm:flex-row overflow-hidden rounded-2xl w-full">

          {/* Keyword input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={h.searchPlaceholder}
              className="h-14 w-full bg-transparent pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px self-center bg-white/15 sm:block" />

          {/* City select */}
          <div className="relative sm:w-44">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 z-10" />
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="h-14 w-full appearance-none bg-transparent pl-10 pr-6 text-sm text-white focus:outline-none"
              style={{ color: city ? "white" : "rgba(255,255,255,0.4)" }}
            >
              <option value="" style={{ color: "#111" }}>{h.allCities}</option>
              {cities.filter(c => c !== "All Cities").map(c => (
                <option key={c} value={c} style={{ color: "#111" }}>{c}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">▾</span>
          </div>

          {/* Submit button */}
          <div className="p-2">
            <animated.button
              type="submit"
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{ transform: btnSpring.scale.to(s => `scale(${s})`), boxShadow: btnSpring.boxShadow }}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 text-sm font-extrabold text-gray-900 sm:h-full sm:w-auto transition-colors hover:bg-yellow-300"
            >
              {h.searchBtn} <ArrowRight className="h-4 w-4" />
            </animated.button>
          </div>
        </div>
      </animated.form>

      {/* Popular tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="pt-0.5 text-xs text-white/40">{h.popular}</span>
        {popular.map((tag, i) => (
          <animated.button
            key={tag}
            type="button"
            style={{ opacity: tagTrail[i].opacity, transform: tagTrail[i].x.to(x => `translateX(${x}px)`) }}
            onClick={() => router.push(`/jobs?q=${encodeURIComponent(tag)}`)}
            className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/20 hover:text-white"
          >
            {tag}
          </animated.button>
        ))}
      </div>
    </div>
  )
}

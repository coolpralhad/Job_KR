"use client"

import { useTrail, animated } from "@react-spring/web"
import HeroSearch from "./HeroSearch"
import { useLang } from "@/lib/i18n/context"

export default function HeroCopy() {
  const { t } = useLang()
  const h = t.hero

  const trail = useTrail(5, {
    from: { opacity: 0, y: 24 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 200, friction: 26 },
  })

  return (
    <div className="flex-1 text-center lg:text-left">

      {/* Badge */}
      <animated.div style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <span>🇰🇷</span>
          <span>{h.badge}</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
        </div>
      </animated.div>

      {/* Headline */}
      <animated.div style={{ opacity: trail[1].opacity, transform: trail[1].y.to(y => `translateY(${y}px)`) }}>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
          {h.headline1}
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {h.headline2}
          </span>
        </h1>
      </animated.div>

      {/* Sub */}
      <animated.div style={{ opacity: trail[2].opacity, transform: trail[2].y.to(y => `translateY(${y}px)`) }}>
        <p className="mx-auto mt-5 max-w-xl text-base text-blue-200 sm:text-lg lg:mx-0">
          {h.sub}
        </p>
      </animated.div>

      {/* Search */}
      <animated.div style={{ opacity: trail[3].opacity, transform: trail[3].y.to(y => `translateY(${y}px)`) }}>
        <HeroSearch />
      </animated.div>

      {/* Trust row */}
      <animated.div style={{ opacity: trail[4].opacity, transform: trail[4].y.to(y => `translateY(${y}px)`) }}>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-blue-300 lg:justify-start">
          {[h.trust1, h.trust2, h.trust3].map(t => <span key={t}>{t}</span>)}
        </div>
      </animated.div>

    </div>
  )
}

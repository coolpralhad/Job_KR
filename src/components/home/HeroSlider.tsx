"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { useSpring, useTransition, animated, config } from "@react-spring/web"
import { Pause, Play } from "lucide-react"

const slides = [
  {
    id: 0,
    src:  "https://images.unsplash.com/photo-1742734703252-25ef2a605d33?w=1920&q=80",
    alt:  "Bukchon Hanok Village narrow street, Seoul — traditional Korean architecture",
  },
  {
    id: 1,
    src:  "https://images.unsplash.com/photo-1741311653793-f8581cff30a8?w=1920&q=80",
    alt:  "N Seoul Tower — iconic landmark on Namsan hill overlooking South Korea's capital",
  },
  {
    id: 2,
    src:  "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1920&q=80",
    alt:  "Modern Seoul cityscape with the Han River at night",
  },
]

const INTERVAL_MS = 5500

export default function HeroSlider() {
  const [current, setCurrent]   = useState(0)
  const [paused,  setPaused]    = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
    setProgress(0)
  }, [])

  const startTimers = useCallback(() => {
    if (intervalRef.current)  clearInterval(intervalRef.current)
    if (progressRef.current)  clearInterval(progressRef.current)
    setProgress(0)
    intervalRef.current  = setInterval(next, INTERVAL_MS)
    // Tick progress every 50ms
    progressRef.current  = setInterval(() => {
      setProgress(p => Math.min(p + (50 / INTERVAL_MS) * 100, 100))
    }, 50)
  }, [next])

  useEffect(() => {
    if (!paused) startTimers()
    else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [paused, startTimers])

  const goTo = (i: number) => { setCurrent(i); if (!paused) startTimers() }

  // ── Crossfade transition ────────────────────────────────────────────────────
  const transitions = useTransition(current, {
    key:  current,
    from: { opacity: 0, scale: 1.06 },
    enter:{ opacity: 1, scale: 1    },
    leave:{ opacity: 0, scale: 1.02 },
    config: { tension: 60, friction: 22 },
  })

  // ── Progress bar spring ─────────────────────────────────────────────────────
  const progressSpring = useSpring({
    width: `${progress}%`,
    config: { tension: 120, friction: 40 },
  })

  // ── Dot springs ─────────────────────────────────────────────────────────────
  const dotSprings = slides.map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring({
      width:   i === current ? 28 : 6,
      opacity: i === current ? 1  : 0.45,
      config:  config.stiff,
    })
  )

  return (
    <>
      {/* Slides */}
      {transitions((style, i) => (
        <animated.div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            opacity: style.opacity,
            transform: style.scale.to(s => `scale(${s})`),
          }}
        >
          <Image
            src={slides[i].src}
            alt={slides[i].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </animated.div>
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-900/75 via-blue-950/65 to-slate-900/90" aria-hidden="true" />

      {/* Controls: progress bar + dots + pause */}
      <div className="absolute bottom-16 left-1/2 z-20 flex w-full max-w-xs -translate-x-1/2 flex-col items-center gap-3"
        role="group" aria-label="Slideshow controls">

        {/* Progress bar */}
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/20">
          <animated.div style={progressSpring} className="h-full rounded-full bg-yellow-400" />
        </div>

        {/* Dots + pause */}
        <div className="flex items-center gap-2.5">
          {slides.map((s, i) => (
            <animated.button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              style={{
                width:   dotSprings[i].width.to(w => `${w}px`),
                opacity: dotSprings[i].opacity,
                height:  "6px",
                borderRadius: "9999px",
                background: i === current ? "#facc15" : "rgba(255,255,255,0.6)",
                border: "none", cursor: "pointer", padding: 0,
              }}
            />
          ))}

          <button
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
          >
            {paused ? <Play className="h-3 w-3 fill-white" /> : <Pause className="h-3 w-3 fill-white" />}
          </button>
        </div>
      </div>
    </>
  )
}

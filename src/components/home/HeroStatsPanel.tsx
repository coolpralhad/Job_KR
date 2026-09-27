"use client"

import { useSpring, useTrail, useInView, animated, config } from "@react-spring/web"
import { useLang } from "@/lib/i18n/context"

const statTargets = [
  { target: 1200,  suffix: "+", from: "#3b82f6", to: "#6366f1" },
  { target: 350,   suffix: "+", from: "#10b981", to: "#0d9488" },
  { target: 18000, suffix: "+", from: "#8b5cf6", to: "#ec4899" },
  { target: 6,     suffix: "",  from: "#f59e0b", to: "#f97316" },
]

function StatItem({ target, suffix, from, to, label, sub, index, inView }: {
  target: number; suffix: string; from: string; to: string
  label: string; sub: string; index: number; inView: boolean
}) {
  const countSpring = useSpring({
    from: { val: 0 },
    to:   { val: inView ? target : 0 },
    delay: 300 + index * 120,
    config: { ...config.molasses, duration: 1000 },
  })

  const barSpring = useSpring({
    from: { scaleX: 0 },
    to:   { scaleX: inView ? 1 : 0 },
    delay: 400 + index * 120,
    config: { tension: 80, friction: 22 },
  })

  return (
    <div>
      <p className="text-3xl font-extrabold leading-none text-white drop-shadow-lg">
        <animated.span>{countSpring.val.to(v => Math.floor(v).toLocaleString())}</animated.span>
        {suffix}
      </p>
      <div className="my-2 h-0.5 w-10 overflow-hidden rounded-full bg-white/20">
        <animated.div
          style={{
            scaleX: barSpring.scaleX,
            transformOrigin: "left",
            height: "100%",
            borderRadius: "9999px",
            background: `linear-gradient(to right, ${from}, ${to})`,
          }}
        />
      </div>
      <p className="text-sm font-semibold leading-tight text-white drop-shadow">{label}</p>
      <p className="mt-0.5 text-xs font-medium text-white/70">{sub}</p>
    </div>
  )
}

export default function HeroStatsPanel() {
  const [ref, inView] = useInView({ once: true, rootMargin: "-30px 0px" })
  const { t } = useLang()
  const s = t.stats

  const trail = useTrail(2, {
    from: { opacity: 0, y: 12 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    delay: 200,
    config: { tension: 200, friction: 24 },
  })

  return (
    <div ref={ref} className="w-full lg:w-auto">

      {/* Glass card */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/8 shadow-xl backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.07)" }}>

        {/* Card header */}
        <div className="border-b border-white/10 px-5 py-3.5">
          <animated.div style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}
            className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{s.header}</p>
          </animated.div>
        </div>

        {/* 2×2 stats grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 p-5">
          {statTargets.map((st, i) => (
            <StatItem key={i} {...st} label={s.items[i].label} sub={s.items[i].sub} index={i} inView={inView} />
          ))}
        </div>

        {/* Footer */}
        <animated.div style={{ opacity: trail[1].opacity }}
          className="border-t border-white/10 px-5 py-3">
          <p className="text-[11px] font-medium text-yellow-300">{s.trusted}</p>
        </animated.div>
      </div>

    </div>
  )
}

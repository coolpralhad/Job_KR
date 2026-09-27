"use client"

import { useState, useRef, useEffect } from "react"
import { useSpring, animated, config } from "@react-spring/web"
import { Languages, Check, ChevronDown } from "lucide-react"
import { useLang } from "@/lib/i18n/context"
import { LANG_LABELS, type Lang } from "@/lib/i18n/translations"

const LANGS: Lang[] = ["en", "ko", "ne"]

const FLAGS: Record<Lang, string> = { en: "🇺🇸", ko: "🇰🇷", ne: "🇳🇵" }

export default function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const dropSpring = useSpring({
    opacity: open ? 1 : 0,
    y:       open ? 0 : -6,
    config:  config.stiff,
  })

  const isDark = variant === "dark"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          isDark
            ? "border border-white/15 bg-white/8 text-white hover:bg-white/15"
            : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
        style={{ background: isDark ? "rgba(255,255,255,0.07)" : undefined }}
      >
        <span>{FLAGS[lang]}</span>
        <span className="hidden sm:inline">{LANG_LABELS[lang]}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <animated.div
        style={{
          opacity:       dropSpring.opacity,
          pointerEvents: open ? "auto" : "none",
          transform:     dropSpring.y.to(y => `translateY(${y}px)`),
        }}
        className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/80"
      >
        {LANGS.map(l => (
          <button
            key={l}
            onClick={() => { setLang(l); setOpen(false) }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
          >
            <span>{FLAGS[l]}</span>
            <span className={`flex-1 text-left font-medium ${l === lang ? "text-blue-600" : "text-gray-700"}`}>
              {LANG_LABELS[l]}
            </span>
            {l === lang && <Check className="h-3.5 w-3.5 text-blue-500" />}
          </button>
        ))}
      </animated.div>
    </div>
  )
}

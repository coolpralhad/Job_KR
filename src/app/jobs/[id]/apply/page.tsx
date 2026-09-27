"use client"

import { use, useState, useRef } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { useSpring, useTrail, useInView, animated, config } from "@react-spring/web"
import {
  ArrowLeft, CheckCircle2, Upload, X, FileText,
  User, Mail, Phone, MapPin, Globe, ChevronRight,
  Briefcase, GraduationCap, FileCheck, Sparkles,
  Building2, Clock, DollarSign,
} from "lucide-react"
import { jobs, formatSalary } from "@/lib/mock-data"
import { useLang } from "@/lib/i18n/context"

// ── Visa colour map ────────────────────────────────────────────────────────────

const visaColors: Record<string, { bg: string; text: string; from: string; to: string }> = {
  "E-7": { bg: "#eff6ff", text: "#1d4ed8", from: "#2563eb", to: "#6366f1" },
  "E-9": { bg: "#f0fdf4", text: "#15803d", from: "#16a34a", to: "#0d9488" },
  "H-2": { bg: "#fff7ed", text: "#c2410c", from: "#ea580c", to: "#d97706" },
  "F-4": { bg: "#fdf4ff", text: "#7e22ce", from: "#9333ea", to: "#ec4899" },
  "F-6": { bg: "#fef2f2", text: "#b91c1c", from: "#dc2626", to: "#e11d48" },
  "D-10": { bg: "#f0f9ff", text: "#0369a1", from: "#0ea5e9", to: "#2563eb" },
}

// ── EPS countries ─────────────────────────────────────────────────────────────

const EPS_COUNTRIES = [
  "Nepal", "Vietnam", "Philippines", "Thailand", "Indonesia",
  "Sri Lanka", "Mongolia", "Uzbekistan", "Pakistan", "Cambodia",
  "China", "Bangladesh", "Kyrgyzstan", "Myanmar", "East Timor (Timor-Leste)", "Laos",
]

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = ["Personal Info", "Experience", "Documents", "Review"]

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { t } = useLang()
  const spring = useSpring({
    width: `${((current + 1) / total) * 100}%`,
    config: config.stiff,
  })
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-gray-500">
        <span>Step {current + 1} {t.apply.stepOf} {total}</span>
        <span className="text-gray-400">{t.apply.steps[current]}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <animated.div style={spring} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
      </div>
      <div className="mt-3 flex gap-2">
        {STEPS.map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300
              ${i < current ? "bg-green-500 text-white" : i === current ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-400"}`}>
              {i < current ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`hidden text-[10px] font-medium sm:block ${i === current ? "text-blue-700" : "text-gray-400"}`}>{t.apply.steps[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 0: Personal Info ─────────────────────────────────────────────────────

function PersonalInfoStep({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const { t } = useLang()
  const trail = useTrail(6, {
    from: { opacity: 0, x: 18 }, to: { opacity: 1, x: 0 },
    config: { tension: 220, friction: 22 },
  })
  // trail[0]=fullName, [1]=email, [2]=nationality, [3]=visa, [4]=phone, [5]=city
  return (
    <div className="grid gap-4 sm:grid-cols-2">

      {/* Full Name */}
      <animated.div style={{ opacity: trail[0].opacity, transform: trail[0].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.personal.fullName} <span className="text-red-500">*</span></label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder={t.apply.personal.passportPlaceholder} value={data.fullName ?? ""}
            onChange={e => onChange({ ...data, fullName: e.target.value })}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </animated.div>

      {/* Email */}
      <animated.div style={{ opacity: trail[1].opacity, transform: trail[1].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.personal.email} <span className="text-red-500">*</span></label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="email" placeholder={t.apply.personal.emailExamplePlaceholder} value={data.email ?? ""}
            onChange={e => onChange({ ...data, email: e.target.value })}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </animated.div>

      {/* Nationality */}
      <animated.div style={{ opacity: trail[2].opacity, transform: trail[2].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.personal.nationality}</label>
        <div className="relative">
          <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select value={data.nationality ?? ""} onChange={e => onChange({ ...data, nationality: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-8 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">{t.apply.personal.selectNationality}</option>
            {EPS_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
        </div>
      </animated.div>

      {/* Current Visa Type */}
      <animated.div style={{ opacity: trail[3].opacity, transform: trail[3].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.personal.visaType}</label>
        <div className="relative">
          <FileCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select value={data.visa ?? ""} onChange={e => onChange({ ...data, visa: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-8 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">{t.apply.personal.selectVisa}</option>
            <option value="None">{t.apply.personal.noVisa}</option>
            <optgroup label={t.apply.personal.workVisas}>
              <option value="E-7">E-7 · Specially Designated Activities</option>
              <option value="E-9">E-9 · Non-professional Employment</option>
              <option value="E-1">E-1 · Professor</option>
              <option value="E-2">E-2 · Foreign Language Instructor</option>
              <option value="E-3">E-3 · Research</option>
              <option value="E-4">E-4 · Technology Transfer</option>
              <option value="E-5">E-5 · Professional Employment</option>
              <option value="E-6">E-6 · Arts &amp; Entertainment</option>
            </optgroup>
            <optgroup label={t.apply.personal.seasonal}>
              <option value="H-2">H-2 · Working Holiday (Overseas Korean)</option>
            </optgroup>
            <optgroup label={t.apply.personal.residence}>
              <option value="F-2">F-2 · Resident</option>
              <option value="F-4">F-4 · Overseas Korean</option>
              <option value="F-5">F-5 · Permanent Resident</option>
              <option value="F-6">F-6 · Marriage Migrant</option>
            </optgroup>
            <optgroup label={t.apply.personal.student}>
              <option value="D-2">D-2 · Student</option>
              <option value="D-4">D-4 · General Training</option>
              <option value="D-10">D-10 · Job Seeker</option>
            </optgroup>
            <optgroup label={t.apply.personal.other}>
              <option value="C-3">C-3 · Short-term Visit</option>
              <option value="G-1">G-1 · Other</option>
            </optgroup>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
        </div>
      </animated.div>

      {/* Phone */}
      <animated.div style={{ opacity: trail[4].opacity, transform: trail[4].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.personal.phone}</label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="tel" placeholder="+82 10 0000 0000" value={data.phone ?? ""}
            onChange={e => onChange({ ...data, phone: e.target.value })}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </animated.div>

      {/* Current City */}
      <animated.div style={{ opacity: trail[5].opacity, transform: trail[5].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.personal.city}</label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="e.g. Seoul" value={data.city ?? ""}
            onChange={e => onChange({ ...data, city: e.target.value })}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </animated.div>

    </div>
  )
}

// ── Step 1: Experience ────────────────────────────────────────────────────────

function ExperienceStep({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const { t } = useLang()
  const trail = useTrail(4, {
    from: { opacity: 0, x: 18 }, to: { opacity: 1, x: 0 },
    config: { tension: 220, friction: 22 },
  })
  return (
    <div className="flex flex-col gap-5">
      <animated.div style={{ opacity: trail[0].opacity, transform: trail[0].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.experience.years}</label>
        <div className="relative">
          <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="number" min={0} max={40} placeholder="e.g. 5"
            value={data.years ?? ""}
            onChange={e => onChange({ ...data, years: e.target.value })}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </animated.div>

      <animated.div style={{ opacity: trail[1].opacity, transform: trail[1].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.experience.educationLevel}</label>
        <div className="relative">
          <GraduationCap className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select value={data.education ?? ""}
            onChange={e => onChange({ ...data, education: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">{t.apply.experience.selectEducation}</option>
            {[
              { val: "High School",       label: t.apply.experience.eduHighSchool },
              { val: "Associate Degree",  label: t.apply.experience.eduAssociate },
              { val: "Bachelor's Degree", label: t.apply.experience.eduBachelor },
              { val: "Master's Degree",   label: t.apply.experience.eduMaster },
              { val: "PhD",               label: t.apply.experience.eduPhD },
            ].map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
          </select>
        </div>
      </animated.div>

      <animated.div style={{ opacity: trail[2].opacity, transform: trail[2].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">TOPIK Level (if any)</label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select value={data.topik ?? ""}
            onChange={e => onChange({ ...data, topik: e.target.value })}
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">{t.apply.experience.noTopik}</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{t.apply.experience.topikOptionPrefix}{n}</option>)}
          </select>
        </div>
      </animated.div>

      <animated.div style={{ opacity: trail[3].opacity, transform: trail[3].x.to(x => `translateX(${x}px)`) }}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-600">{t.apply.experience.coverLetter} <span className="font-normal text-gray-400">{t.apply.experience.coverOptional}</span></label>
        <textarea rows={5} placeholder={t.apply.experience.coverPlaceholder}
          value={data.cover ?? ""}
          onChange={e => onChange({ ...data, cover: e.target.value })}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </animated.div>
    </div>
  )
}

// ── File Drop Zone ─────────────────────────────────────────────────────────────

function FileDropZone({ label, accept, file, onFile, hint }: {
  label: string; accept: string; file: File | null
  onFile: (f: File | null) => void; hint?: string
}) {
  const [dragging, setDragging] = useState(false)
  const { t } = useLang()
  const inputRef = useRef<HTMLInputElement>(null)

  const spring = useSpring({
    borderColor: dragging ? "#3b82f6" : file ? "#16a34a" : "#e5e7eb",
    background:  dragging ? "#eff6ff" : file ? "#f0fdf4" : "#f9fafb",
    scale:       dragging ? 1.02 : 1,
    config: config.wobbly,
  })

  return (
    <animated.div
      style={spring}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer overflow-hidden rounded-xl border-2 border-dashed px-5 py-6 transition-colors"
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      <div className="flex flex-col items-center gap-2 text-center">
        {file ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-green-700">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB · {t.apply.documents.clickToReplace}</p>
            <button onClick={e => { e.stopPropagation(); onFile(null) }}
              className="mt-1 flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
              <X className="h-3 w-3" /> {t.apply.documents.remove}
            </button>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Upload className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">{label}</p>
            <p className="text-xs text-gray-400">{t.apply.documents.dragDrop}</p>
            {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
          </>
        )}
      </div>
    </animated.div>
  )
}

// ── Step 2: Documents ──────────────────────────────────────────────────────────

function DocumentsStep({ files, onChange }: { files: any; onChange: (d: any) => void }) {
  const { t } = useLang()
  const trail = useTrail(3, {
    from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0 },
    config: { tension: 220, friction: 22 },
  })
  return (
    <div className="flex flex-col gap-5">
      <animated.div style={{ opacity: trail[0].opacity, transform: trail[0].y.to(y => `translateY(${y}px)`) }}>
        <p className="mb-1.5 text-xs font-semibold text-gray-600">{t.apply.documents.resume} <span className="text-red-500">*</span></p>
        <FileDropZone label={t.apply.documents.uploadResume} accept=".pdf,.doc,.docx"
          file={files.resume} onFile={f => onChange({ ...files, resume: f })}
          hint={t.apply.documents.resumeHint} />
      </animated.div>
      <animated.div style={{ opacity: trail[1].opacity, transform: trail[1].y.to(y => `translateY(${y}px)`) }}>
        <p className="mb-1.5 text-xs font-semibold text-gray-600">{t.apply.documents.portfolio} <span className="font-normal text-gray-400">{t.apply.documents.portfolioOptional}</span></p>
        <FileDropZone label={t.apply.documents.uploadPortfolio} accept=".pdf,.zip,.pptx"
          file={files.portfolio} onFile={f => onChange({ ...files, portfolio: f })}
          hint={t.apply.documents.portfolioHint} />
      </animated.div>
      <animated.div style={{ opacity: trail[2].opacity, transform: trail[2].y.to(y => `translateY(${y}px)`) }}>
        <p className="mb-1.5 text-xs font-semibold text-gray-600">{t.apply.documents.visa} <span className="font-normal text-gray-400">{t.apply.documents.visaOptional}</span></p>
        <FileDropZone label={t.apply.documents.uploadVisa} accept=".pdf,.jpg,.jpeg,.png"
          file={files.id} onFile={f => onChange({ ...files, id: f })}
          hint={t.apply.documents.visaHint} />
      </animated.div>
    </div>
  )
}

// ── Step 3: Review ─────────────────────────────────────────────────────────────

function ReviewStep({ personal, experience, files, job }: any) {
  const { t } = useLang()
  const [ref, inView] = useInView({ once: true })
  const trail = useTrail(4, {
    from: { opacity: 0, y: 14 },
    to: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    config: { tension: 220, friction: 22 },
  })
  const sections = [
    {
      title: t.apply.review.personalInfo,
      icon: User,
      rows: [
        { label: t.apply.review.fullName,    val: personal.fullName },
        { label: t.apply.review.email,       val: personal.email },
        { label: t.apply.review.phone,       val: personal.phone },
        { label: t.apply.review.nationality, val: personal.nationality },
        { label: t.apply.review.city,        val: personal.city },
        { label: t.apply.review.currentVisa, val: personal.visa },
      ],
    },
    {
      title: t.apply.review.experience,
      icon: Briefcase,
      rows: [
        { label: t.apply.review.yearsExp,    val: experience.years ? `${experience.years} ${t.apply.review.years}` : "—" },
        { label: t.apply.review.education,   val: experience.education || "—" },
        { label: t.apply.review.topikLevel,  val: experience.topik ? `Level ${experience.topik}` : t.apply.review.none },
        { label: t.apply.review.coverLetter, val: experience.cover ? t.apply.review.provided : t.apply.review.notProvided },
      ],
    },
    {
      title: t.apply.review.documents,
      icon: FileText,
      rows: [
        { label: t.apply.review.resume,       val: files.resume?.name ?? t.apply.review.notUploaded },
        { label: t.apply.documents.portfolio, val: files.portfolio?.name ?? t.apply.review.notProvided },
        { label: t.apply.review.visaId,  val: files.id?.name ?? t.apply.review.notProvided },
      ],
    },
    {
      title: t.apply.applyingTo,
      icon: Building2,
      rows: [
        { label: t.apply.review.role,    val: job.title },
        { label: t.apply.review.company, val: job.company.name },
        { label: t.apply.review.city,    val: job.city },
        { label: t.apply.review.salary,  val: `${formatSalary(job.salary.min, job.salary.max)} / mo` },
      ],
    },
  ]
  return (
    <div ref={ref} className="flex flex-col gap-4">
      {sections.map(({ title, icon: Icon, rows }, i) => (
        <animated.div key={title} style={{ opacity: trail[i].opacity, transform: trail[i].y.to(y => `translateY(${y}px)`) }}
          className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
            <Icon className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-gray-600">{title}</span>
          </div>
          <div className="divide-y divide-gray-100 px-4">
            {rows.map(({ label, val }) => (
              <div key={label} className="flex items-start justify-between gap-4 py-2.5">
                <span className="shrink-0 text-xs text-gray-400">{label}</span>
                <span className="text-right text-xs font-medium text-gray-800">{val || "—"}</span>
              </div>
            ))}
          </div>
        </animated.div>
      ))}
    </div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ job }: { job: any }) {
  const { t } = useLang()
  const vs = visaColors[job.visaTypes[0]] ?? visaColors["E-7"]

  const circle = useSpring({
    from: { scale: 0, opacity: 0 },
    to:   { scale: 1, opacity: 1 },
    config: config.wobbly,
    delay: 100,
  })
  const content = useSpring({
    from: { opacity: 0, y: 24 },
    to:   { opacity: 1, y: 0 },
    delay: 420,
    config: { tension: 200, friction: 22 },
  })

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <animated.div style={{ ...circle, transform: circle.scale.to(s => `scale(${s})`) }}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-xl"
          style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})` }}>
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
      </animated.div>

      <animated.div style={{ opacity: content.opacity, transform: content.y.to(y => `translateY(${y}px)`) }}
        className="flex flex-col items-center gap-3">
        <h2 className="text-xl font-extrabold text-gray-900">{t.apply.submitted.title}</h2>
        <p className="max-w-xs text-sm text-gray-500">
          {t.apply.submitted.message}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-300" /> {t.apply.submitted.responseTime}</span>
          <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-gray-300" /> {t.apply.submitted.emailSent}</span>
          <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-gray-300" /> {t.apply.submitted.noFee}</span>
        </div>

        <div className="mt-4 flex gap-3">
          <Link href={`/jobs/${job.id}`}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            {t.apply.submitted.backToJob}
          </Link>
          <Link href="/jobs"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            style={{ background: `linear-gradient(to right, ${vs.from}, ${vs.to})` }}>
            {t.apply.submitted.browseMore}
          </Link>
        </div>
      </animated.div>
    </div>
  )
}

// ── Step slide wrapper (keyed so spring fires only on step change) ────────────

function StepSlide({ children }: { children: React.ReactNode }) {
  const slide = useSpring({
    from: { opacity: 0, x: 20 },
    to:   { opacity: 1, x: 0 },
    config: config.stiff,
  })
  return (
    <animated.div style={{ opacity: slide.opacity, transform: slide.x.to(x => `translateX(${x}px)`) }}>
      {children}
    </animated.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params)
  const job     = jobs.find(j => j.id === id)
  if (!job) notFound()

  const { t } = useLang()
  const vs = visaColors[job.visaTypes[0]] ?? visaColors["E-7"]

  const [step,       setStep]       = useState(0)
  const [submitted,  setSubmitted]  = useState(false)
  const [personal,   setPersonal]   = useState<any>({})
  const [experience, setExperience] = useState<any>({})
  const [files,      setFiles]      = useState<any>({ resume: null, portfolio: null, id: null })

  // Card entrance
  const card = useSpring({
    from: { opacity: 0, y: 32 },
    to:   { opacity: 1, y: 0 },
    config: { tension: 180, friction: 22 },
  })

  // Next button spring
  const [btnHover, setBtnHover] = useState(false)
  const btnSpring = useSpring({
    scale: btnHover ? 1.03 : 1,
    boxShadow: btnHover
      ? `0 8px 28px ${vs.from}44`
      : `0 2px 8px ${vs.from}22`,
    config: config.wobbly,
  })

  const canAdvance = () => {
    if (step === 0) return !!(personal.fullName && personal.email)
    if (step === 2) return !!files.resume
    return true
  }

  const advance = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top accent strip */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${vs.from}, ${vs.to})` }} />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">

        {/* Job summary pill */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white"
            style={{ background: `linear-gradient(135deg, ${vs.from}, ${vs.to})` }}>
            {job.company.logo}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900">{job.title}</p>
            <p className="truncate text-xs text-gray-500">{job.company.name} · {job.city}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {job.visaTypes.map(v => (
              <span key={v} className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{ background: visaColors[v]?.bg, color: visaColors[v]?.text }}>
                {v}
              </span>
            ))}
            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
              <Clock className="h-3 w-3" /> {t.jobDetail.deadline} {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>

        {/* Form card */}
        <animated.div style={{ ...card, transform: card.y.to(y => `translateY(${y}px)`) }}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 pb-6 pt-6">

            {submitted ? (
              <SuccessScreen job={job} />
            ) : (
              <>
                <StepIndicator current={step} total={STEPS.length} />

                <StepSlide key={step}>
                  <h2 className="mb-5 text-base font-extrabold text-gray-900">{t.apply.steps[step]}</h2>

                  {step === 0 && <PersonalInfoStep  data={personal}   onChange={setPersonal} />}
                  {step === 1 && <ExperienceStep    data={experience}  onChange={setExperience} />}
                  {step === 2 && <DocumentsStep     files={files}     onChange={setFiles} />}
                  {step === 3 && <ReviewStep        personal={personal} experience={experience} files={files} job={job} />}
                </StepSlide>

                {/* Footer */}
                <div className="mt-7 flex items-center justify-between gap-4">
                  {step > 0 ? (
                    <button onClick={() => setStep(s => s - 1)}
                      className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                      <ArrowLeft className="h-4 w-4" /> {t.apply.back}
                    </button>
                  ) : <div />}

                  <animated.button
                    onClick={advance}
                    disabled={!canAdvance()}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    style={{
                      ...btnSpring,
                      background: canAdvance()
                        ? `linear-gradient(to right, ${vs.from}, ${vs.to})`
                        : "#e5e7eb",
                      color: canAdvance() ? "#fff" : "#9ca3af",
                      transform: btnSpring.scale.to(s => `scale(${s})`),
                    }}
                    className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed"
                  >
                    {step === STEPS.length - 1 ? (
                      <><Sparkles className="h-4 w-4" /> {t.apply.submit}</>
                    ) : (
                      <>{t.apply.next} <ChevronRight className="h-4 w-4" /></>
                    )}
                  </animated.button>
                </div>

                {/* Required field hint */}
                {step === 0 && (
                  <p className="mt-3 text-center text-[11px] text-gray-400">
                    {t.apply.requiredHint}
                  </p>
                )}
              </>
            )}

          </div>
        </animated.div>

        {/* Trust note */}
        {!submitted && (
          <p className="mt-4 text-center text-[11px] text-gray-400">
            <FileCheck className="mr-1 inline h-3.5 w-3.5" />
            {t.apply.privacyNote}
          </p>
        )}
      </div>
    </div>
  )
}

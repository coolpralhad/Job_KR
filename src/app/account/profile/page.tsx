"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X, CheckCircle2 } from "lucide-react"

const VISA_OPTIONS = [
  "E-7 – Specialist Employment", "E-9 – Non-professional Employment",
  "H-2 – Work & Visit", "F-4 – Overseas Korean", "F-6 – Marriage Migrant",
  "D-10 – Job Seeker", "F-2 – Resident", "F-5 – Permanent Resident",
  "Other",
]

const TOPIK_OPTIONS = ["None", "1", "2", "3", "4", "5", "6"]

const INDUSTRY_OPTIONS = [
  "Technology", "Manufacturing", "Construction", "Healthcare",
  "Education", "Finance", "Hospitality", "Retail", "Agriculture",
  "Transportation", "Media & Design", "Other",
]

const KOREAN_LEVELS = ["None", "1", "2", "3", "4", "5", "6"]

export default function AccountProfilePage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [fullName, setFullName] = useState("")
  const [currentTitle, setCurrentTitle] = useState("")
  const [location, setLocation] = useState("")
  const [industry, setIndustry] = useState("")
  const [experienceYears, setExperienceYears] = useState("")
  const [visaType, setVisaType] = useState("")
  const [topikLevel, setTopikLevel] = useState("")
  const [availableFrom, setAvailableFrom] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [languages, setLanguages] = useState<{ lang: string; level: string }[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }

      const { data } = await (supabase as any)
        .from("candidate_profiles")
        .select("*")
        .eq("id", user.id)
        .single() as { data: any }

      if (data) {
        setFullName(data.full_name ?? "")
        setCurrentTitle(data.current_title ?? "")
        setLocation(data.location ?? "")
        setIndustry(data.industry ?? "")
        setExperienceYears(data.experience_years?.toString() ?? "")
        setVisaType(data.visa_type ?? "")
        setTopikLevel(data.topik_level ?? "")
        setAvailableFrom(data.available_from?.slice(0, 10) ?? "")
        setSkills(data.skills ?? [])
        setLanguages((data.languages ?? []) as { lang: string; level: string }[])
      }
      setLoading(false)
    }
    load()
  }, [])

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s])
    setSkillInput("")
  }

  function addLanguage() {
    setLanguages((prev) => [...prev, { lang: "", level: "Beginner" }])
  }

  async function save() {
    setSaving(true)
    setError("")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await (supabase as any)
      .from("candidate_profiles")
      .update({
        full_name: fullName || null,
        current_title: currentTitle || null,
        location: location || null,
        industry: industry || null,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        visa_type: visaType || null,
        topik_level: topikLevel || null,
        available_from: availableFrom || null,
        skills,
        languages: languages.filter((l) => l.lang),
      })
      .eq("id", user.id)

    if (err) setError(err.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
        </div>

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Current Job Title</label>
                <input value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Industry</label>
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none">
                    <option value="">Select</option>
                    {INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input type="number" min="0" max="50" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Currently in Korea – Seoul"
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Korea Work Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-900">Korea Work Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Visa Type</label>
                <select value={visaType} onChange={(e) => setVisaType(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none">
                  <option value="">Select visa type</option>
                  {VISA_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">TOPIK Level</label>
                  <select value={topikLevel} onChange={(e) => setTopikLevel(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none">
                    {TOPIK_OPTIONS.map((o) => <option key={o} value={o}>{o === "None" ? "No TOPIK" : `Level ${o}`}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Available From</label>
                  <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-900">Skills</h2>
            <div className="mb-3 flex gap-2">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (press Enter)"
                className="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
              <Button type="button" variant="outline" onClick={addSkill} size="sm" className="h-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded-full border border-gray-200 py-0.5 pl-3 pr-1.5 text-sm text-gray-700">
                  {s}
                  <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="text-gray-300 hover:text-gray-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Languages</h2>
              <Button type="button" variant="outline" size="sm" onClick={addLanguage} className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {languages.map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={l.lang} onChange={(e) => setLanguages(languages.map((x, j) => j === i ? { ...x, lang: e.target.value } : x))}
                    placeholder="Language (e.g. Korean)"
                    className="h-9 flex-1 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
                  <select value={l.level} onChange={(e) => setLanguages(languages.map((x, j) => j === i ? { ...x, level: e.target.value } : x))}
                    className="h-9 rounded-lg border border-gray-200 px-2 text-sm focus:border-blue-400 focus:outline-none">
                    {["Beginner", "Elementary", "Intermediate", "Upper-Intermediate", "Advanced", "Native"].map((lv) => (
                      <option key={lv} value={lv}>{lv}</option>
                    ))}
                  </select>
                  <button onClick={() => setLanguages(languages.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {languages.length === 0 && <p className="text-sm text-gray-400">No languages added yet.</p>}
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pb-8">
            <Button onClick={save} disabled={saving} className="bg-blue-700 hover:bg-blue-800 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

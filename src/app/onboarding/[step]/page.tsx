"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

const TOTAL_STEPS = 6

const jobTypeOptions = [
  "Full-time", "Part-time", "Contract", "Internship", "Seasonal / EPS"
]

const locationOptions = [
  "Currently in Korea", "Outside Korea (planning to move)", "Student in Korea"
]

const visaOptions = [
  "None – Not in Korea", "E-7 – Skilled Worker", "E-9 – Non-professional (EPS)",
  "H-2 – Working Visit", "F-4 – Overseas Korean", "F-6 – Marriage Migrant",
  "F-2 – Residence", "F-5 – Permanent Resident", "D-10 – Job Seeker",
  "D-2 – Student", "Applying / In progress", "Other",
]

const koreanCities = [
  "Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju",
  "Suwon", "Ulsan", "Changwon", "Seongnam", "Any city",
]

const industryOptions = [
  "Manufacturing", "IT & Software", "Agriculture", "Construction",
  "Hospitality", "Healthcare", "Education", "Logistics", "Finance", "Other",
]

const skillSuggestions = [
  "Excel", "Korean", "English", "Forklift operation", "Quality control",
  "Customer service", "Sales", "Cooking", "Driving", "Machine operation",
  "Assembly", "Welding", "Teaching", "Nursing", "Programming",
]

const languageOptions = ["Korean", "English", "Nepali", "Vietnamese", "Chinese", "Other"]
const proficiencyOptions = ["Native", "Advanced", "Intermediate", "Basic", "None"]

export default function OnboardingPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = use(params)
  const stepNum = parseInt(step)
  const router = useRouter()
  const supabase = createClient()

  // Step 1 — Career goals
  const [jobTypes, setJobTypes] = useState<string[]>([])
  // Step 2 — Location
  const [locationStatus, setLocationStatus] = useState("")
  const [preferredCity, setPreferredCity] = useState("")
  // Step 3 — Work status
  const [visaType, setVisaType] = useState("")
  const [needsSponsorship, setNeedsSponsorship] = useState(false)
  const [availableFrom, setAvailableFrom] = useState("")
  // Step 4 — Experience (optional)
  const [currentTitle, setCurrentTitle] = useState("")
  const [experienceYears, setExperienceYears] = useState("")
  const [industry, setIndustry] = useState("")
  // Step 5 — Skills (optional)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  // Step 6 — Languages (optional)
  const [languages, setLanguages] = useState<{ lang: string; level: string }[]>([{ lang: "English", level: "Intermediate" }])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (stepNum < 1 || stepNum > TOTAL_STEPS) router.replace("/onboarding/1")
  }, [stepNum, router])

  function toggleJobType(type: string) {
    setJobTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type])
  }

  function addSkill(skill: string) {
    const s = skill.trim()
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s])
    setSkillInput("")
  }

  function addLanguage() {
    setLanguages((prev) => [...prev, { lang: "", level: "Intermediate" }])
  }

  function updateLanguage(idx: number, field: "lang" | "level", value: string) {
    setLanguages((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }

  async function saveAndContinue() {
    setError("")
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    let updateData: Record<string, unknown> = { onboarding_step: stepNum }

    if (stepNum === 1) {
      if (jobTypes.length === 0) { setError("Select at least one job type."); setLoading(false); return }
      updateData.career_goals = jobTypes
    } else if (stepNum === 2) {
      if (!locationStatus) { setError("Please select your location status."); setLoading(false); return }
      updateData.location = locationStatus
      if (preferredCity) updateData.preferred_city = preferredCity
    } else if (stepNum === 3) {
      if (!visaType) { setError("Please select your visa status."); setLoading(false); return }
      updateData.visa_type = visaType
      updateData.needs_sponsorship = needsSponsorship
      if (availableFrom) updateData.available_from = availableFrom
    } else if (stepNum === 4) {
      if (currentTitle) updateData.current_title = currentTitle
      if (experienceYears) updateData.experience_years = parseInt(experienceYears)
      if (industry) updateData.industry = industry
    } else if (stepNum === 5) {
      updateData.skills = skills
    } else if (stepNum === 6) {
      updateData.languages = languages.filter((l) => l.lang)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase as any)
      .from("candidate_profiles")
      .update(updateData)
      .eq("id", user.id)

    if (err) { setError(err.message); setLoading(false); return }

    if (stepNum === TOTAL_STEPS) {
      router.push("/dashboard")
    } else {
      router.push(`/onboarding/${stepNum + 1}`)
    }
  }

  function skip() {
    if (stepNum === TOTAL_STEPS) router.push("/dashboard")
    else router.push(`/onboarding/${stepNum + 1}`)
  }

  const isOptional = stepNum >= 4
  const stepLabels = ["Career Goals", "Location", "Work Status", "Experience", "Skills", "Languages"]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-blue-700">Step {stepNum} of {TOTAL_STEPS}</p>
          <div className="mt-2 flex gap-1 justify-center">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${i < stepNum ? "bg-blue-700" : "bg-gray-200"}`} />
            ))}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{stepLabels[stepNum - 1]}</h1>
          {isOptional && <p className="mt-1 text-sm text-gray-400">Optional — you can skip this step</p>}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          {/* Step 1: Career goals */}
          {stepNum === 1 && (
            <div>
              <p className="mb-4 text-sm text-gray-600">What kind of work are you looking for? Select all that apply.</p>
              <div className="flex flex-wrap gap-2">
                {jobTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleJobType(type)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      jobTypes.includes(type)
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {stepNum === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Where are you currently located?</p>
              <div className="space-y-2">
                {locationOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLocationStatus(opt)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-sm font-medium transition-all text-left ${
                      locationStatus === opt ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Preferred city in Korea (optional)</label>
                <select
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Any city</option>
                  {koreanCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Work status */}
          {stepNum === 3 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Current visa status <span className="text-blue-600">*</span></label>
                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select visa status</option>
                  {visaOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sponsorship"
                  checked={needsSponsorship}
                  onChange={(e) => setNeedsSponsorship(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <label htmlFor="sponsorship" className="text-sm text-gray-700">I need visa sponsorship from an employer</label>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Available to start (optional)</label>
                <Input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          )}

          {/* Step 4: Experience */}
          {stepNum === 4 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Current or most recent job title</label>
                <Input value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} placeholder="e.g. Factory worker, IT engineer" className="h-10" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Years of work experience</label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select</option>
                  {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((y) => (
                    <option key={y} value={y}>{y === "0" ? "No experience" : `${y} year${y === "1" ? "" : "s"}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select industry</option>
                  {industryOptions.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Skills */}
          {stepNum === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Add skills that are relevant to the jobs you&apos;re applying for.</p>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput) }}}
                  placeholder="Type a skill and press Enter"
                  className="h-10"
                />
                <Button type="button" variant="outline" onClick={() => addSkill(skillInput)} className="shrink-0">Add</Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-sm text-blue-700">
                      {s}
                      <button type="button" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} className="text-blue-400 hover:text-blue-700">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div>
                <p className="mb-2 text-xs text-gray-400">Suggestions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillSuggestions.filter((s) => !skills.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => addSkill(s)}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-700">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Languages */}
          {stepNum === 6 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Add the languages you speak. Korean and English are most important for Korean jobs.</p>
              <div className="space-y-3">
                {languages.map((l, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      value={l.lang}
                      onChange={(e) => updateLanguage(i, "lang", e.target.value)}
                      className="h-10 flex-1 appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select language</option>
                      {languageOptions.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <select
                      value={l.level}
                      onChange={(e) => updateLanguage(i, "level", e.target.value)}
                      className="h-10 w-36 appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {proficiencyOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {languages.length > 1 && (
                      <button type="button" onClick={() => setLanguages((prev) => prev.filter((_, j) => j !== i))}
                        className="text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addLanguage} className="text-sm text-blue-700 hover:underline">
                + Add another language
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          {stepNum > 1 ? (
            <button
              type="button"
              onClick={() => router.push(`/onboarding/${stepNum - 1}`)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {isOptional && (
              <button type="button" onClick={skip} className="text-sm text-gray-400 hover:text-gray-600">
                Skip for now
              </button>
            )}
            <Button
              onClick={saveAndContinue}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : stepNum === TOTAL_STEPS ? "Finish" : <>Continue <ChevronRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

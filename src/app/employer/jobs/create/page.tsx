"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, Plus, X } from "lucide-react"

const industries = ["Manufacturing", "IT & Software", "Agriculture", "Construction", "Hospitality", "Healthcare", "Education", "Logistics", "Finance", "Retail", "Other"]
const cities = ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Seongnam", "Other"]
const visaTypes = ["E-7", "E-9", "H-2", "F-4", "F-6", "D-10", "F-2", "F-5", "D-2", "C-4"]

const ddl = "h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"

export default function CreateJobPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState("")
  const [industry, setIndustry] = useState("")
  const [city, setCity] = useState("")
  const [jobType, setJobType] = useState("")
  const [workplaceType, setWorkplaceType] = useState("")
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")
  const [description, setDescription] = useState("")
  const [requiredReqs, setRequiredReqs] = useState<string[]>([])
  const [preferredReqs, setPreferredReqs] = useState<string[]>([])
  const [reqInput, setReqInput] = useState("")
  const [prefInput, setPrefInput] = useState("")
  const [benefits, setBenefits] = useState<string[]>([])
  const [benefitInput, setBenefitInput] = useState("")
  const [koreanLevel, setKoreanLevel] = useState("")
  const [englishRequired, setEnglishRequired] = useState("")
  const [intlApplicants, setIntlApplicants] = useState("")
  const [sponsorship, setSponsorship] = useState("")
  const [relocation, setRelocation] = useState("")
  const [overseasApplicants, setOverseasApplicants] = useState("")
  const [selectedVisas, setSelectedVisas] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState("")
  const [topikLevel, setTopikLevel] = useState("")
  const [deadline, setDeadline] = useState("")
  const [questions, setQuestions] = useState<{ question: string; required: boolean }[]>([])
  const [questionInput, setQuestionInput] = useState("")
  const [saving, setSaving] = useState(false)

  function toggleVisa(v: string) {
    setSelectedVisas((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v])
  }

  function addItem(arr: string[], setArr: (v: string[]) => void, input: string, setInput: (v: string) => void) {
    const s = input.trim()
    if (s && !arr.includes(s)) setArr([...arr, s])
    setInput("")
  }

  async function saveJob(status: "draft" | "preview") {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: emp } = await supabase
      .from("employer_profiles").select("company_id").eq("id", user.id).single()
    if (!emp?.company_id) { router.push("/onboarding/company"); return }

    const { data: job, error } = await supabase.from("jobs").insert({
      company_id: emp.company_id,
      title,
      industry: industry || null,
      city: city || null,
      job_type: jobType || null,
      workplace_type: workplaceType || null,
      salary_min: salaryMin ? parseInt(salaryMin) * 10000 : null,
      salary_max: salaryMax ? parseInt(salaryMax) * 10000 : null,
      description: description || null,
      requirements: { required: requiredReqs, preferred: preferredReqs },
      benefits,
      korean_level: koreanLevel || null,
      english_required: englishRequired || null,
      international_applicants: intlApplicants || null,
      sponsorship: sponsorship || null,
      relocation: relocation || null,
      overseas_applicants: overseasApplicants || null,
      visa_types: selectedVisas.length > 0 ? selectedVisas : null,
      experience_years: experienceYears || null,
      topik_level: topikLevel || null,
      deadline: deadline || null,
      questions: questions.length > 0 ? questions : null,
      status: "draft",
      payment_status: "unpaid",
    }).select("id").single()

    if (error) { setSaving(false); alert(error.message); return }

    if (status === "preview") router.push(`/employer/jobs/${job.id}/preview`)
    else router.push("/employer/jobs")
    setSaving(false)
  }

  const sectionCls = "rounded-xl border border-gray-200 bg-white p-6 space-y-4"
  const labelCls = "mb-1.5 block text-xs font-medium text-gray-600"

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Job Listing</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in the details for your new position.</p>
          </div>
          <Link href="/employer/jobs/create/ai">
            <Button variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" /> Use AI assist
            </Button>
          </Link>
        </div>

        <div className="space-y-5">
          {/* Basic */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">Basic Information</h2>
            <div>
              <label className={labelCls}>Job title <span className="text-blue-600">*</span></label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. International Sales Manager" required className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={ddl}>
                  <option value="">Select</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Location</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className={ddl}>
                  <option value="">Select city</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Employment type</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className={ddl}>
                  <option value="">Select</option>
                  {["Full-time", "Part-time", "Contract", "Seasonal", "Internship"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Workplace type</label>
                <select value={workplaceType} onChange={(e) => setWorkplaceType(e.target.value)} className={ddl}>
                  <option value="">Select</option>
                  {["On-site", "Hybrid", "Remote"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div><label className={labelCls}>Application deadline</label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-10 w-48" />
            </div>
          </div>

          {/* Compensation */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">Compensation</h2>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className={labelCls}>Min salary (만원)</label>
                <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="250" className="h-10" />
              </div>
              <span className="mt-5 text-gray-400">–</span>
              <div className="flex-1">
                <label className={labelCls}>Max salary (만원)</label>
                <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="400" className="h-10" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Enter amounts in 만원 (e.g. 250 = ₩2,500,000/month)</p>
            <div>
              <label className={labelCls}>Benefits</label>
              <div className="flex gap-2">
                <Input value={benefitInput} onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(benefits, setBenefits, benefitInput, setBenefitInput) }}}
                  placeholder="e.g. Health insurance, Housing" className="h-10" />
                <Button type="button" variant="outline" onClick={() => addItem(benefits, setBenefits, benefitInput, setBenefitInput)}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {benefits.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {b}<button type="button" onClick={() => setBenefits(benefits.filter((x) => x !== b))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">Requirements</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Experience</label>
                <select value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className={ddl}>
                  <option value="">Any experience</option>
                  {["Entry level", "1-2 years", "2-5 years", "5-10 years", "10+ years"].map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>TOPIK level required</label>
                <select value={topikLevel} onChange={(e) => setTopikLevel(e.target.value)} className={ddl}>
                  <option value="">Not required</option>
                  {["1", "2", "3", "4", "5", "6"].map((l) => <option key={l} value={l}>Level {l}+</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Required qualifications</label>
              <div className="flex gap-2">
                <Input value={reqInput} onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(requiredReqs, setRequiredReqs, reqInput, setReqInput) }}}
                  placeholder="Add a required qualification" className="h-10" />
                <Button type="button" variant="outline" onClick={() => addItem(requiredReqs, setRequiredReqs, reqInput, setReqInput)}>Add</Button>
              </div>
              <ul className="mt-2 space-y-1.5">
                {requiredReqs.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="flex-1">{r}</span>
                    <button onClick={() => setRequiredReqs(requiredReqs.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" /></button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className={labelCls}>Preferred qualifications</label>
              <div className="flex gap-2">
                <Input value={prefInput} onChange={(e) => setPrefInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(preferredReqs, setPreferredReqs, prefInput, setPrefInput) }}}
                  placeholder="Add a preferred qualification" className="h-10" />
                <Button type="button" variant="outline" onClick={() => addItem(preferredReqs, setPreferredReqs, prefInput, setPrefInput)}>Add</Button>
              </div>
              <ul className="mt-2 space-y-1.5">
                {preferredReqs.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="flex-1">{r}</span>
                    <button onClick={() => setPreferredReqs(preferredReqs.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Languages */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">Language Requirements</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Korean level required</label>
                <select value={koreanLevel} onChange={(e) => setKoreanLevel(e.target.value)} className={ddl}>
                  <option value="">Not required</option>
                  {["Basic", "Intermediate", "Business level", "Native", "Not specified"].map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>English requirement</label>
                <select value={englishRequired} onChange={(e) => setEnglishRequired(e.target.value)} className={ddl}>
                  <option value="">Not specified</option>
                  {["Required", "Preferred", "Not required"].map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* International hiring */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">International Hiring</h2>
            <p className="text-xs text-gray-400">These fields help international candidates understand if they can apply. Only fill in what you know.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "International applicants", value: intlApplicants, set: setIntlApplicants, options: ["Welcome", "Not applicable", "Not specified"] },
                { label: "Visa sponsorship", value: sponsorship, set: setSponsorship, options: ["Provided", "Not provided", "Case by case", "Not specified"] },
                { label: "Overseas applicants", value: overseasApplicants, set: setOverseasApplicants, options: ["Accepted", "Not accepted", "Not specified"] },
                { label: "Relocation support", value: relocation, set: setRelocation, options: ["Provided", "Not provided", "Not specified"] },
              ].map((field) => (
                <div key={field.label}>
                  <label className={labelCls}>{field.label}</label>
                  <select value={field.value} onChange={(e) => field.set(e.target.value)} className={ddl}>
                    <option value="">Select</option>
                    {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <label className={labelCls}>Accepted visa types</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {visaTypes.map((v) => (
                  <button key={v} type="button" onClick={() => toggleVisa(v)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      selectedVisas.includes(v) ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job description */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">Job Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Describe the role, responsibilities, and what a typical day looks like…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          {/* Candidate questions */}
          <div className={sectionCls}>
            <h2 className="font-semibold text-gray-900">Candidate Questions (optional)</h2>
            <p className="text-xs text-gray-400">Add questions candidates must answer when applying.</p>
            <div className="flex gap-2">
              <Input value={questionInput} onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="e.g. Do you have experience with quality control?" className="h-10" />
              <Button type="button" variant="outline" onClick={() => {
                if (questionInput.trim()) {
                  setQuestions([...questions, { question: questionInput.trim(), required: false }])
                  setQuestionInput("")
                }
              }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <span className="flex-1 text-gray-700">{q.question}</span>
                  <label className="flex items-center gap-1 text-xs text-gray-500">
                    <input type="checkbox" checked={q.required}
                      onChange={(e) => setQuestions(questions.map((x, j) => j === i ? { ...x, required: e.target.checked } : x))}
                      className="h-3.5 w-3.5" /> Required
                  </label>
                  <button onClick={() => setQuestions(questions.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => saveJob("preview")} disabled={!title || saving}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Preview Job →"}
            </Button>
            <Button variant="outline" onClick={() => saveJob("draft")} disabled={!title || saving}>
              Save draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

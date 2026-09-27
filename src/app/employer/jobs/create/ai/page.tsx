"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, ArrowLeft, AlertCircle, Pencil } from "lucide-react"
import Link from "next/link"
import type { JobDraft } from "@/lib/ai"

export default function AICreateJobPage() {
  const router = useRouter()
  const supabase = createClient()

  const [input, setInput] = useState("")
  const [draft, setDraft] = useState<JobDraft | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function generateDraft() {
    if (!input.trim()) return
    setLoading(true)
    setError("")
    const res = await fetch("/api/ai/structure-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    })
    if (!res.ok) { setError("AI could not process your description. Try again or use standard job creation."); setLoading(false); return }
    const data = await res.json()
    setDraft(data)
    setLoading(false)
  }

  async function saveAsDraft() {
    if (!draft) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: emp } = await supabase.from("employer_profiles").select("company_id").eq("id", user.id).single()
    if (!emp?.company_id) { router.push("/onboarding/company"); return }

    const { data: job } = await supabase.from("jobs").insert({
      company_id: emp.company_id,
      title: draft.title,
      description: draft.description,
      requirements: draft.requirements,
      benefits: draft.benefits,
      korean_level: draft.korean_level !== "Not specified" ? draft.korean_level : null,
      english_required: draft.english_required !== "Not specified" ? draft.english_required : null,
      international_applicants: draft.international_applicants !== "Not specified" ? draft.international_applicants : null,
      sponsorship: draft.sponsorship !== "Not specified" ? draft.sponsorship : null,
      experience_years: draft.experience_years !== "Not specified" ? draft.experience_years : null,
      status: "draft",
      payment_status: "unpaid",
    }).select("id").single()

    if (job) router.push(`/employer/jobs/${job.id}/preview`)
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-6">
          <Link href="/employer/jobs/create" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" /> Back to standard creation
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> AI Job Creation
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tell us who you need</h1>
          <p className="mt-1 text-gray-500">Describe the role in plain language. JOB-KR will draft a structured job listing for you to review and edit.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">Describe the position</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="e.g. We need a factory worker for our electronics assembly line in Suwon. They should be able to work full time and use basic tools. Korean is helpful but not required. We can support visa applications..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{error}
            </div>
          )}
          <Button onClick={generateDraft} disabled={!input.trim() || loading} className="mt-4 bg-blue-700 hover:bg-blue-800 text-white">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating…</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Draft</>}
          </Button>
        </div>

        {draft && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-4 py-3">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>All fields below are <strong>JOB-KR suggestions</strong> — review and edit before publishing.</span>
            </div>

            {[
              { label: "Job title", value: draft.title },
              { label: "Description", value: draft.description },
              { label: "Korean level", value: draft.korean_level },
              { label: "English", value: draft.english_required },
              { label: "International applicants", value: draft.international_applicants },
              { label: "Sponsorship", value: draft.sponsorship },
              { label: "Experience", value: draft.experience_years },
            ].map((field) => (
              <div key={field.label} className="rounded-xl border border-blue-100 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{field.label}</p>
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">JOB-KR suggestion</span>
                </div>
                <p className="text-sm text-gray-700">{field.value}</p>
              </div>
            ))}

            {draft.requirements.required.length > 0 && (
              <div className="rounded-xl border border-blue-100 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Required qualifications</p>
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">JOB-KR suggestion</span>
                </div>
                <ul className="space-y-1">
                  {draft.requirements.required.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700">• {r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>This draft is generated from your description. <strong>You must review every field</strong> before publishing. The job will not go live until you approve it and complete payment.</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveAsDraft} disabled={saving} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Pencil className="h-4 w-4 mr-1" /> Review and Edit →</>}
              </Button>
              <Button variant="outline" onClick={() => setDraft(null)}>Start over</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

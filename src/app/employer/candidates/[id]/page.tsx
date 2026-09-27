"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MapPin, Send, Loader2 } from "lucide-react"

export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()

  const [candidate, setCandidate] = useState<{
    full_name: string | null; current_title: string | null; location: string | null;
    experience_years: number | null; visa_type: string | null; topik_level: string | null;
    skills: string[] | null; languages: { lang: string; level: string }[] | null;
    career_goals: string[] | null; available_from: string | null; industry: string | null;
  } | null>(null)

  const [contactOpen, setContactOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [jobId, setJobId] = useState("")
  const [employerJobs, setEmployerJobs] = useState<{ id: string; title: string }[]>([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("candidate_profiles")
        .select("full_name, current_title, location, experience_years, visa_type, topik_level, skills, languages, career_goals, available_from, industry")
        .eq("id", id)
        .single() as { data: any }
      setCandidate(data)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: emp } = await supabase.from("employer_profiles").select("company_id").eq("id", user.id).single()
        if (emp?.company_id) {
          const { data: jobs } = await supabase.from("jobs").select("id, title").eq("company_id", emp.company_id).eq("status", "active")
          setEmployerJobs(jobs ?? [])
          if (jobs?.[0]) setJobId(jobs[0].id)
        }
      }
    }
    load()
  }, [id])

  async function suggestMessage() {
    if (!jobId || !candidate) return
    setAiLoading(true)
    const job = employerJobs.find((j) => j.id === jobId)
    const res = await fetch("/api/ai/suggest-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle: job?.title, candidateName: candidate.full_name ?? "Candidate" }),
    })
    const data = await res.json()
    setMessage(data.message ?? "")
    setAiLoading(false)
  }

  async function sendContact() {
    if (!message.trim() || !jobId) return
    setSending(true)
    await fetch("/api/employer/contact-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: id, jobId, message }),
    })
    setSent(true)
    setSending(false)
    setContactOpen(false)
  }

  if (!candidate) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/employer/candidates" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> Back to candidates
        </Link>

        {/* Header */}
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                {(candidate.full_name ?? "?").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{candidate.current_title ?? "Job Seeker"}</h1>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  {candidate.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-400" />{candidate.location.replace("Currently in Korea", "Korea")}</span>}
                  {candidate.experience_years !== null && <span>{candidate.experience_years} years experience</span>}
                  {candidate.industry && <span>{candidate.industry}</span>}
                </div>
              </div>
            </div>
            {sent ? (
              <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">Message sent</span>
            ) : (
              <Button onClick={() => setContactOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white">
                <Send className="h-4 w-4 mr-1" /> Contact
              </Button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">Languages</h2>
              <div className="space-y-2">
                {candidate.languages.map((l, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{l.lang}</span>
                    <span className="text-gray-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Korea work */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Korea Work Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Visa type</span>
                <span className="font-medium text-gray-700">{candidate.visa_type?.split(" – ")[0] ?? "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TOPIK level</span>
                <span className="font-medium text-gray-700">{candidate.topik_level ? `Level ${candidate.topik_level}` : "Not taken"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available from</span>
                <span className="font-medium text-gray-700">
                  {candidate.available_from
                    ? new Date(candidate.available_from) <= new Date() ? "Now" : new Date(candidate.available_from).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 sm:col-span-2">
              <h2 className="mb-3 text-sm font-semibold text-gray-700">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <span key={s} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact modal */}
        {contactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 font-semibold text-gray-900">Contact Candidate</h2>
              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-medium text-gray-600">For which job?</label>
                <select value={jobId} onChange={(e) => setJobId(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
                  {employerJobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600">Message</label>
                  <button onClick={suggestMessage} disabled={aiLoading || !jobId}
                    className="text-xs text-blue-700 hover:underline flex items-center gap-1 disabled:opacity-50">
                    {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "✨"} Use AI draft
                  </button>
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                  placeholder="Write your message to the candidate…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
                {message && <p className="mt-1 text-xs text-gray-400">The candidate will reply directly to your email address.</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={sendContact} disabled={!message.trim() || !jobId || sending} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" />Send</>}
                </Button>
                <Button variant="outline" onClick={() => setContactOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

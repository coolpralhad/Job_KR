import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Clock, CheckCircle2, Circle } from "lucide-react"
import { use } from "react"

const timeline = [
  "applied", "viewed", "shortlisted", "interview", "offer", "hired"
]

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-purple-100 text-purple-700",
  interview: "bg-green-100 text-green-700",
  offer: "bg-emerald-100 text-emerald-700",
  hired: "bg-teal-100 text-teal-700",
  rejected: "bg-red-100 text-red-700",
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: app } = await (supabase as any)
    .from("applications")
    .select(`
      *, jobs (
        id, title, city, job_type, salary_min, salary_max, deadline,
        companies (display_name, legal_name, city)
      )
    `)
    .eq("id", id)
    .eq("candidate_id", user.id)
    .single() as { data: any }

  if (!app) notFound()

  const job = app.jobs as {
    id: string; title: string; city: string; job_type: string;
    salary_min: number | null; salary_max: number | null; deadline: string | null;
    companies: { display_name: string | null; legal_name: string; city: string | null } | null
  } | null

  const companyName = job?.companies?.display_name ?? job?.companies?.legal_name ?? ""
  const currentIndex = app.status === "rejected" ? -1 : timeline.indexOf(app.status)

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link href="/applications" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </Link>

        {/* Job summary */}
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{job?.title}</h1>
              <p className="mt-0.5 text-sm text-gray-500">{companyName}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job?.city}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job?.job_type}</span>
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[app.status]}`}>
              {app.status}
            </span>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href={`/jobs/${job?.id}`}>
              <Button variant="outline" size="sm">View job listing</Button>
            </Link>
          </div>
        </div>

        {/* Status timeline */}
        {app.status !== "rejected" && (
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-900">Application Progress</h2>
            <div className="space-y-3">
              {timeline.map((step, i) => {
                const isDone = i <= currentIndex
                const isCurrent = i === currentIndex
                return (
                  <div key={step} className="flex items-center gap-3">
                    {isDone
                      ? <CheckCircle2 className={`h-5 w-5 shrink-0 ${isCurrent ? "text-blue-600" : "text-gray-300"}`} />
                      : <Circle className="h-5 w-5 shrink-0 text-gray-200" />}
                    <span className={`text-sm capitalize ${isCurrent ? "font-semibold text-blue-700" : isDone ? "text-gray-700" : "text-gray-400"}`}>
                      {step}
                    </span>
                    {isCurrent && <span className="ml-auto text-xs text-blue-600">Current status</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {app.status === "rejected" && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            This application was not successful. Keep applying — the right job is out there.
          </div>
        )}

        {/* Application details */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-gray-900">Application Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Submitted</dt>
              <dd className="font-medium text-gray-700">{formatDate(app.applied_at)}</dd>
            </div>
            {job?.deadline && (
              <div className="flex justify-between">
                <dt className="text-gray-400">Job deadline</dt>
                <dd className="font-medium text-gray-700">{formatDate(job.deadline)}</dd>
              </div>
            )}
          </dl>

          {app.cover_message && (
            <>
              <div className="my-4 border-t border-gray-100" />
              <h3 className="mb-2 text-sm font-medium text-gray-700">Your cover message</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">{app.cover_message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

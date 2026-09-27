import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, FileText, Clock, CheckCircle2, XCircle } from "lucide-react"

const STAGES = [
  { key: "applied", label: "Applied", color: "border-gray-300" },
  { key: "viewed", label: "Reviewed", color: "border-blue-400" },
  { key: "shortlisted", label: "Shortlisted", color: "border-indigo-400" },
  { key: "interview", label: "Interview", color: "border-violet-400" },
  { key: "offer", label: "Offer", color: "border-amber-400" },
  { key: "hired", label: "Hired", color: "border-green-500" },
]

const STATUS_ICON: Record<string, React.ReactNode> = {
  applied: <Clock className="h-3.5 w-3.5 text-gray-400" />,
  viewed: <FileText className="h-3.5 w-3.5 text-blue-400" />,
  shortlisted: <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />,
  interview: <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />,
  offer: <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />,
  hired: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
  rejected: <XCircle className="h-3.5 w-3.5 text-red-400" />,
}

type Application = {
  id: string
  status: string
  applied_at: string
  cover_message: string | null
  candidate_profiles: {
    full_name: string | null
    current_title: string | null
    location: string | null
    visa_type: string | null
  } | null
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>
}) {
  const { job: jobId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: emp } = await supabase.from("employer_profiles").select("company_id").eq("id", user.id).single()
  if (!emp?.company_id) redirect("/onboarding/company")

  // Get jobs for this employer
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status")
    .eq("company_id", emp.company_id)
    .in("status", ["active", "paused", "closed", "under_review"])
    .order("created_at", { ascending: false })

  const selectedJobId = jobId ?? jobs?.[0]?.id ?? null
  const selectedJob = jobs?.find((j) => j.id === selectedJobId)

  let applications: Application[] = []
  if (selectedJobId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("applications")
      .select(`
        id, status, applied_at, cover_message,
        candidate_profiles(full_name, current_title, location, visa_type)
      `)
      .eq("job_id", selectedJobId)
      .order("applied_at", { ascending: false }) as { data: any[] | null }
    applications = (data ?? []) as Application[]
  }

  // Group by stage
  const byStage: Record<string, Application[]> = {}
  for (const s of STAGES) byStage[s.key] = []
  const rejected = applications.filter((a) => a.status === "rejected")
  for (const app of applications) {
    if (app.status !== "rejected") {
      byStage[app.status] = byStage[app.status] ?? []
      byStage[app.status].push(app)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center gap-3">
          <Link href="/employer/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Hiring Pipeline</h1>
        </div>

        {/* Job selector */}
        {jobs && jobs.length > 0 && (
          <div className="mb-5 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 shrink-0">Job:</label>
            <div className="flex gap-2 flex-wrap">
              {jobs.map((job) => (
                <Link key={job.id} href={`/employer/pipeline?job=${job.id}`}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                    job.id === selectedJobId
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                  }`}>
                  {job.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!selectedJob ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
            <p className="text-gray-500">No active jobs to show pipeline for.</p>
            <Link href="/employer/jobs/create" className="mt-4">
              <span className="text-sm text-blue-700 hover:underline">Post a job →</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-800">{selectedJob.title}</span>
              <span>·</span>
              <span>{applications.length} applicant{applications.length !== 1 ? "s" : ""}</span>
              {rejected.length > 0 && <span>· {rejected.length} rejected</span>}
            </div>

            {/* Kanban columns */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {STAGES.map((stage) => {
                  const stageApps = byStage[stage.key] ?? []
                  return (
                    <div key={stage.key} className="w-60 shrink-0">
                      <div className={`mb-3 flex items-center justify-between rounded-lg border-t-2 ${stage.color} bg-white px-3 py-2.5 shadow-sm`}>
                        <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {stageApps.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {stageApps.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 py-8 text-center text-xs text-gray-300">
                            No candidates
                          </div>
                        ) : (
                          stageApps.map((app) => {
                            const candidate = app.candidate_profiles
                            return (
                              <Link key={app.id} href={`/applications/${app.id}`}>
                                <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                                  <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                      {(candidate?.full_name ?? "?").slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {candidate?.full_name ?? "Candidate"}
                                      </p>
                                      {candidate?.current_title && (
                                        <p className="text-xs text-gray-500 truncate">{candidate.current_title}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs text-gray-400">
                                    {candidate?.visa_type && (
                                      <span className="rounded-full bg-gray-100 px-2 py-0.5">{candidate.visa_type.split(" ")[0]}</span>
                                    )}
                                    <span className="flex items-center gap-0.5">
                                      {STATUS_ICON[app.status]}
                                      {new Date(app.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Rejected column */}
                {rejected.length > 0 && (
                  <div className="w-60 shrink-0">
                    <div className="mb-3 flex items-center justify-between rounded-lg border-t-2 border-red-300 bg-white px-3 py-2.5 shadow-sm">
                      <span className="text-sm font-semibold text-gray-500">Rejected</span>
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500">{rejected.length}</span>
                    </div>
                    <div className="space-y-3">
                      {rejected.map((app) => {
                        const candidate = app.candidate_profiles
                        return (
                          <Link key={app.id} href={`/applications/${app.id}`}>
                            <div className="rounded-xl border border-gray-200 bg-white/70 p-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                                  {(candidate?.full_name ?? "?").slice(0, 1).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{candidate?.full_name ?? "Candidate"}</p>
                                  {candidate?.current_title && (
                                    <p className="text-xs text-gray-400">{candidate.current_title}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

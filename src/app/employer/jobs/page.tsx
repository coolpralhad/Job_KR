/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Users, ChevronRight, Clock } from "lucide-react"

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "pending_payment", label: "Pending Payment" },
  { key: "under_review", label: "Under Review" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "closed", label: "Closed" },
]

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-600" },
  pending_payment: { label: "Pending Payment", cls: "bg-yellow-100 text-yellow-700" },
  under_review: { label: "Under Review", cls: "bg-blue-100 text-blue-700" },
  active: { label: "Active", cls: "bg-green-100 text-green-700" },
  paused: { label: "Paused", cls: "bg-orange-100 text-orange-700" },
  closed: { label: "Closed", cls: "bg-red-100 text-red-700" },
}

export default async function EmployerJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = tab ?? "all"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: emp } = await supabase.from("employer_profiles").select("company_id").eq("id", user.id).single()
  if (!emp?.company_id) redirect("/onboarding/company")

  let query = (supabase as any)
    .from("jobs")
    .select("id, title, status, city, industry, created_at, deadline, visa_types")
    .eq("company_id", emp.company_id)
    .order("created_at", { ascending: false })

  if (activeTab !== "all") {
    query = query.eq("status", activeTab)
  }

  const { data: jobs } = await query as { data: any[] | null }

  // Get applicant counts per job
  const jobIds = (jobs ?? []).map((j) => j.id)
  let applicantCounts: Record<string, number> = {}
  if (jobIds.length > 0) {
    const { data: apps } = await supabase
      .from("applications")
      .select("job_id")
      .in("job_id", jobIds)
    if (apps) {
      apps.forEach((a) => {
        applicantCounts[a.job_id] = (applicantCounts[a.job_id] ?? 0) + 1
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your job postings.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/employer/jobs/create/ai">
              <Button variant="outline" className="text-sm">✨ AI Create</Button>
            </Link>
            <Link href="/employer/jobs/create">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white text-sm">
                <Plus className="h-4 w-4 mr-1" /> Post a Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
          {STATUS_TABS.map((t) => (
            <Link key={t.key} href={`/employer/jobs?tab=${t.key}`}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "border-b-2 border-blue-700 text-blue-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}>
              {t.label}
            </Link>
          ))}
        </div>

        {!jobs || jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Plus className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-700">No jobs {activeTab !== "all" ? `with status "${activeTab}"` : "yet"}</h3>
            <p className="mt-1 text-sm text-gray-400">Create your first job listing to start receiving applications.</p>
            <Link href="/employer/jobs/create" className="mt-5">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">Post a Job</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const badge = STATUS_BADGE[job.status] ?? { label: job.status, cls: "bg-gray-100 text-gray-600" }
              const count = applicantCounts[job.id] ?? 0
              return (
                <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="font-semibold text-gray-900 truncate">{job.title}</h2>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {job.city && <span>{job.city}</span>}
                        {job.industry && <span>{job.industry}</span>}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Posted {new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        {job.deadline && <span>Deadline: {job.deadline}</span>}
                      </div>
                      {job.visa_types && job.visa_types.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(job.visa_types as string[]).map((v) => (
                            <span key={v} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{count}</p>
                        <p className="text-xs text-gray-400">applicants</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Link href={`/employer/jobs/${job.id}/preview`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/employer/pipeline?job=${job.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> Pipeline
                          </Button>
                        </Link>
                        {job.status === "pending_payment" && (
                          <Link href={`/employer/jobs/${job.id}/payment`}>
                            <Button size="sm" className="h-8 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3">
                              Pay now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

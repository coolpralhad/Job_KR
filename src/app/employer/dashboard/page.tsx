/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Eye, ChevronRight, Plus, Clock, AlertCircle } from "lucide-react"

export default async function EmployerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: emp } = await (supabase as any)
    .from("employer_profiles")
    .select("company_id, job_title, companies(id, legal_name, display_name, verification_status)")
    .eq("id", user.id)
    .single() as { data: any }

  if (!emp?.company_id) redirect("/onboarding/company")

  const company = emp.companies as { id: string; legal_name: string; display_name: string | null; verification_status: string } | null
  const companyName = company?.display_name ?? company?.legal_name ?? ""
  const isPending = company?.verification_status === "pending"
  const isRejected = company?.verification_status === "rejected"

  // Stats
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status, posted_at")
    .eq("company_id", emp.company_id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { count: activeJobsCount } = await supabase
    .from("jobs").select("id", { count: "exact", head: true })
    .eq("company_id", emp.company_id).eq("status", "active")

  const activeJobIds = (jobs ?? []).filter((j) => j.status === "active").map((j) => j.id)

  let newApplicants = 0
  let shortlisted = 0
  let interviews = 0

  if (activeJobIds.length > 0) {
    const { count: na } = await supabase
      .from("applications").select("id", { count: "exact", head: true })
      .in("job_id", activeJobIds).eq("status", "applied")
    const { count: sl } = await supabase
      .from("applications").select("id", { count: "exact", head: true })
      .in("job_id", activeJobIds).eq("status", "shortlisted")
    const { count: iv } = await supabase
      .from("applications").select("id", { count: "exact", head: true })
      .in("job_id", activeJobIds).eq("status", "interview")
    newApplicants = na ?? 0
    shortlisted = sl ?? 0
    interviews = iv ?? 0
  }

  // Recent applications
  const { data: recentApps } = activeJobIds.length > 0
    ? await (supabase as any).from("applications")
        .select("id, status, applied_at, jobs(title), candidate_profiles(full_name)")
        .in("job_id", activeJobIds)
        .order("applied_at", { ascending: false })
        .limit(5) as { data: any[] | null }
    : { data: [] as any[] }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      applied: "bg-blue-100 text-blue-700",
      viewed: "bg-yellow-100 text-yellow-700",
      shortlisted: "bg-purple-100 text-purple-700",
      interview: "bg-green-100 text-green-700",
    }
    return colors[status] ?? "bg-gray-100 text-gray-600"
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{companyName}</h1>
            <p className="mt-1 text-gray-500">{emp.job_title ?? "Employer"}</p>
          </div>
          <Link href="/employer/jobs/create">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              <Plus className="h-4 w-4 mr-1" /> Post a Job
            </Button>
          </Link>
        </div>

        {/* Verification banner */}
        {isPending && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Company verification under review</p>
              <p className="mt-0.5 text-sm text-yellow-700">We&apos;ll notify you within 1 working day. You can prepare job postings in the meantime, but they won&apos;t go live until your company is verified.</p>
            </div>
          </div>
        )}
        {isRejected && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Verification rejected</p>
              <p className="mt-0.5 text-sm text-red-700">Your company verification was not approved. Please check your email for details or contact support.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Active Jobs", value: activeJobsCount ?? 0, icon: <Briefcase className="h-5 w-5" />, color: "text-blue-700" },
            { label: "New Applicants", value: newApplicants, icon: <Users className="h-5 w-5" />, color: "text-green-700" },
            { label: "Shortlisted", value: shortlisted, icon: <Eye className="h-5 w-5" />, color: "text-purple-700" },
            { label: "Interviews", value: interviews, icon: <Eye className="h-5 w-5" />, color: "text-orange-700" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent applications */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Applications</h2>
              <Link href="/employer/pipeline" className="flex items-center gap-1 text-sm text-blue-700 hover:underline">
                View pipeline <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {!recentApps || recentApps.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No applications yet. Post a job to start receiving candidates.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentApps.map((app) => {
                  const candidate = app.candidate_profiles as { full_name: string | null } | null
                  const job = app.jobs as { title: string } | null
                  return (
                    <div key={app.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{candidate?.full_name ?? "Candidate"}</p>
                        <p className="text-xs text-gray-400">{job?.title} · {formatDate(app.applied_at)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Jobs */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Your Jobs</h2>
              <Link href="/employer/jobs" className="flex items-center gap-1 text-sm text-blue-700 hover:underline">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {!jobs || jobs.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Briefcase className="mb-3 h-8 w-8 text-gray-200" />
                <p className="text-sm text-gray-500">No jobs yet.</p>
                <Link href="/employer/jobs/create" className="mt-3">
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">Post Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => {
                  const statusColors: Record<string, string> = {
                    active: "bg-green-100 text-green-700",
                    draft: "bg-gray-100 text-gray-600",
                    pending_payment: "bg-yellow-100 text-yellow-700",
                    under_review: "bg-blue-100 text-blue-700",
                    paused: "bg-orange-100 text-orange-700",
                    closed: "bg-red-100 text-red-700",
                  }
                  return (
                    <div key={job.id} className="flex items-center justify-between gap-3 py-3">
                      <p className="font-medium text-sm text-gray-900 truncate">{job.title}</p>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[job.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {job.status.replace("_", " ")}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/employer/jobs/create", label: "Post a Job", icon: <Plus className="h-4 w-4" /> },
            { href: "/employer/candidates", label: "Find Candidates", icon: <Users className="h-4 w-4" /> },
            { href: "/employer/pipeline", label: "Hiring Pipeline", icon: <Briefcase className="h-4 w-4" /> },
            { href: "/employer/jobs", label: "Manage Jobs", icon: <Eye className="h-4 w-4" /> },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <span className="text-blue-700">{action.icon}</span>
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

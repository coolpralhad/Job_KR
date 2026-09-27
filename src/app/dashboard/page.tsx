/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Briefcase, FileText, Star, Bell, ChevronRight,
  MapPin, Clock, CheckCircle2, Eye, UserCheck, XCircle,
} from "lucide-react"
import { useLang } from "@/lib/i18n/context"

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  applied:     { label: "Applied",     color: "bg-blue-100 text-blue-700",   icon: <FileText className="h-3.5 w-3.5" /> },
  viewed:      { label: "Viewed",      color: "bg-yellow-100 text-yellow-700", icon: <Eye className="h-3.5 w-3.5" /> },
  shortlisted: { label: "Shortlisted", color: "bg-purple-100 text-purple-700", icon: <Star className="h-3.5 w-3.5" /> },
  interview:   { label: "Interview",   color: "bg-green-100 text-green-700",  icon: <UserCheck className="h-3.5 w-3.5" /> },
  offer:       { label: "Offer",       color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-700",      icon: <XCircle className="h-3.5 w-3.5" /> },
}

function formatSalary(min: number | null, max: number | null, noSalary = "Salary not specified") {
  if (!min && !max) return noSalary
  const fmt = (n: number) => `₩${(n / 10000).toFixed(0)}만`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${fmt(min)}+`
  return `Up to ${fmt(max!)}`
}

export default async function DashboardPage() {
  const { t } = useLang()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Fetch candidate profile
  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Redirect to onboarding if not completed step 1
  if (!profile || (profile.onboarding_step ?? 0) < 1) {
    redirect("/onboarding/1")
  }

  // Fetch recent applications
  const { data: applications } = await (supabase as any)
    .from("applications")
    .select(`
      id, status, applied_at,
      jobs (id, title, city, job_type,
        companies (display_name, legal_name)
      )
    `)
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false })
    .limit(5) as { data: any[] | null }

  // Application counts by status
  const { data: allApplications } = await supabase
    .from("applications")
    .select("status")
    .eq("candidate_id", user.id)

  const statusCounts = (allApplications ?? []).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  // Recommended jobs — basic matching by visa type
  const { data: recommendedJobs } = await (supabase as any)
    .from("jobs")
    .select(`id, title, city, job_type, salary_min, salary_max, visa_types, companies (display_name, legal_name)`)
    .eq("status", "active")
    .limit(5) as { data: any[] | null }

  // Profile completion
  const fields = [
    { key: "full_name", label: t.dashboard.profile.fields.fullName },
    { key: "career_goals", label: t.dashboard.profile.fields.goals },
    { key: "location", label: t.dashboard.profile.fields.location },
    { key: "visa_type", label: t.dashboard.profile.fields.visa },
    { key: "current_title", label: t.dashboard.profile.fields.title },
    { key: "skills", label: t.dashboard.profile.fields.skills },
    { key: "languages", label: t.dashboard.profile.fields.languages },
  ]
  const completed = fields.filter((f) => {
    const val = profile?.[f.key as keyof typeof profile]
    return Array.isArray(val) ? val.length > 0 : Boolean(val)
  })
  const completionPct = Math.round((completed.length / fields.length) * 100)
  const nextMissing = fields.find((f) => {
    const val = profile?.[f.key as keyof typeof profile]
    return Array.isArray(val) ? val.length === 0 : !val
  })

  const firstName = profile?.full_name?.split(" ")[0] ?? "there"
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.dashboard.greetings.morning : hour < 17 ? t.dashboard.greetings.afternoon : t.dashboard.greetings.evening

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {firstName} 👋</h1>
          <p className="mt-1 text-gray-500">{t.dashboard.overview}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application stats */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{t.dashboard.applications.title}</h2>
                <Link href="/applications" className="flex items-center gap-1 text-sm text-blue-700 hover:underline">
                  {t.dashboard.applications.viewAll} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {allApplications && allApplications.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {Object.entries(statusConfig).map(([status, cfg]) => (
                    <div key={status} className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 p-3 text-center">
                      <span className="text-xl font-bold text-gray-900">{statusCounts[status] ?? 0}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
                        {cfg.icon} {(t.dashboard.status as Record<string, string>)[status]}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <Briefcase className="h-10 w-10 text-gray-200" />
                  <p className="font-medium text-gray-500">{t.dashboard.applications.empty}</p>
                  <Link href="/jobs">
                    <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">{t.dashboard.applications.findJobs}</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent applications */}
            {applications && applications.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">{t.dashboard.recent}</h2>
                <div className="divide-y divide-gray-100">
                  {applications.map((app) => {
                    const job = app.jobs as { id: string; title: string; city: string; job_type: string; companies: { display_name: string | null; legal_name: string } | null } | null
                    const companyName = job?.companies?.display_name ?? job?.companies?.legal_name ?? ""
                    const cfg = statusConfig[app.status]
                    return (
                      <div key={app.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{job?.title}</p>
                          <p className="text-sm text-gray-500">{companyName} · {job?.city}</p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                          {cfg.icon} {(t.dashboard.status as Record<string, string>)[app.status]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recommended jobs */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{t.dashboard.recommended.title}</h2>
                <Link href="/jobs" className="flex items-center gap-1 text-sm text-blue-700 hover:underline">
                  {t.dashboard.recommended.viewAll} <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {recommendedJobs && recommendedJobs.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recommendedJobs.map((job) => {
                    const co = job.companies as { display_name: string | null; legal_name: string } | null
                    return (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <div className="flex items-center justify-between gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 hover:text-blue-700">{job.title}</p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.job_type}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-gray-700">{formatSalary(job.salary_min, job.salary_max, t.dashboard.recommended.noSalary)}</p>
                            <p className="text-xs text-gray-400">{co?.display_name ?? co?.legal_name}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <Star className="h-10 w-10 text-gray-200" />
                  <p className="text-gray-500">{t.dashboard.recommended.empty}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Profile completion */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 font-semibold text-gray-900">{t.dashboard.profile.title}</h3>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-blue-700">{completionPct}%</span>
                <span className="text-gray-400">{completed.length}/{fields.length} {t.dashboard.profile.sections}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              {nextMissing && completionPct < 100 && (
                <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
                  <p className="font-medium text-blue-800">{t.dashboard.profile.next} {t.dashboard.profile.addYour} {nextMissing.label}</p>
                  <Link href={`/account/profile`} className="mt-2 block text-xs text-blue-600 hover:underline">
                    {t.dashboard.profile.update}
                  </Link>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="mb-3 font-semibold text-gray-900">{t.dashboard.quickActions.title}</h3>
              <div className="space-y-2">
                {[
                  { href: "/jobs", icon: <Briefcase className="h-4 w-4" />, label: t.dashboard.quickActions.browse },
                  { href: "/saved-jobs", icon: <Star className="h-4 w-4" />, label: t.dashboard.quickActions.saved },
                  { href: "/applications", icon: <FileText className="h-4 w-4" />, label: t.dashboard.quickActions.applications },
                  { href: "/alerts", icon: <Bell className="h-4 w-4" />, label: t.dashboard.quickActions.alerts },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <span className="text-blue-700">{action.icon}</span>
                      {action.label}
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-gray-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

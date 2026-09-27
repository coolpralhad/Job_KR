/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

function formatSalary(min: number | null, max: number | null, negotiable = "Negotiable") {
  if (!min && !max) return negotiable
  const fmt = (n: number) => `₩${(n / 10000).toFixed(0)}만`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  return min ? `${fmt(min)}+` : `Up to ${fmt(max!)}`
}

export default async function SavedJobsPage() {
  const { t } = useLang()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: saved } = await (supabase as any)
    .from("saved_jobs")
    .select(`
      saved_at,
      jobs (id, title, city, job_type, salary_min, salary_max, status,
        companies (display_name, legal_name)
      )
    `)
    .eq("candidate_id", user.id)
    .order("saved_at", { ascending: false }) as { data: any[] | null }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.savedJobs.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{saved?.length ?? 0} saved job{(saved?.length ?? 0) !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/jobs">
            <Button variant="outline" size="sm">{t.savedJobs.browse}</Button>
          </Link>
        </div>

        {!saved || saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
            <Heart className="mb-4 h-10 w-10 text-gray-200" />
            <h3 className="font-semibold text-gray-700">{t.savedJobs.empty.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{t.savedJobs.empty.subtitle}</p>
            <Link href="/jobs" className="mt-4">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">{t.savedJobs.empty.btn}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {saved.map((s) => {
              const job = s.jobs as {
                id: string; title: string; city: string; job_type: string;
                salary_min: number | null; salary_max: number | null; status: string;
                companies: { display_name: string | null; legal_name: string } | null
              } | null
              if (!job) return null
              const companyName = job.companies?.display_name ?? job.companies?.legal_name ?? ""
              const isExpired = job.status === "closed"

              return (
                <div key={job.id} className={`rounded-xl border bg-white p-4 ${isExpired ? "border-gray-100 opacity-60" : "border-gray-200 hover:border-blue-300 hover:shadow-sm"} transition-all`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <Link href={`/jobs/${job.id}`}>
                        <p className={`font-semibold text-gray-900 hover:text-blue-700 ${isExpired ? "" : "cursor-pointer"}`}>{job.title}</p>
                      </Link>
                      <p className="mt-0.5 text-sm text-gray-500">{companyName}</p>
                    </div>
                    {isExpired && <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{t.savedJobs.card.closed}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.job_type}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-700">{formatSalary(job.salary_min, job.salary_max, t.savedJobs.card.negotiable)}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/jobs/${job.id}/apply`} className="flex-1">
                      <Button size="sm" disabled={isExpired} className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs">
                        {t.savedJobs.card.apply}
                      </Button>
                    </Link>
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

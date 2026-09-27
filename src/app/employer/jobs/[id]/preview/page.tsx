/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye } from "lucide-react"

export default async function JobPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: job } = await (supabase as any)
    .from("jobs")
    .select("*, companies(legal_name, display_name, description, city)")
    .eq("id", id)
    .single() as { data: any }

  if (!job) notFound()

  const company = job.companies as { legal_name: string; display_name: string | null; description: string | null; city: string | null } | null
  const companyName = company?.display_name ?? company?.legal_name ?? ""
  const requirements = job.requirements as { required: string[]; preferred: string[] } | null

  function formatSalary(min: number | null, max: number | null) {
    if (!min && !max) return "Negotiable"
    const fmt = (n: number) => `₩${(n / 10000).toFixed(0)}만`
    if (min && max) return `${fmt(min)} – ${fmt(max)}`
    return min ? `${fmt(min)}+` : `Up to ${fmt(max!)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Employer-only banner */}
      <div className="sticky top-16 z-40 bg-amber-50 border-b border-amber-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Eye className="h-4 w-4" />
            <span><strong>Preview mode</strong> — this is how candidates will see your job listing</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/employer/jobs/edit/${id}`}>
              <Button variant="outline" size="sm">Edit job</Button>
            </Link>
            <Link href={`/employer/jobs/${id}/payment`}>
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">Proceed to payment →</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Link href="/employer/jobs/create" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-base font-bold text-gray-600">
                  {companyName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                  <p className="mt-0.5 text-gray-500">{companyName}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {job.city && <span>{job.city}</span>}
                    {job.job_type && <span>{job.job_type}</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(job.visa_types ?? []).map((v: string) => (
                      <span key={v} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{v}</span>
                    ))}
                    {job.industry && <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{job.industry}</span>}
                  </div>
                </div>
              </div>
            </div>

            {job.description && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-3 font-semibold text-gray-900">Job Description</h2>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {requirements && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">Requirements</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {requirements.required.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Required</p>
                      <ul className="space-y-1.5">
                        {requirements.required.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />{r}</li>)}
                      </ul>
                    </div>
                  )}
                  {requirements.preferred.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Preferred</p>
                      <ul className="space-y-1.5">
                        {requirements.preferred.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-500"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-1 text-2xl font-bold text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</div>
              <p className="text-xs text-gray-400 mb-4">per month</p>
              <div className="space-y-2 text-sm">
                {job.industry && <div className="flex justify-between"><span className="text-gray-400">Industry</span><span className="font-medium">{job.industry}</span></div>}
                {job.job_type && <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="font-medium">{job.job_type}</span></div>}
                {job.deadline && <div className="flex justify-between"><span className="text-gray-400">Deadline</span><span className="font-medium">{job.deadline}</span></div>}
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 text-center">
                Apply button visible after publishing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

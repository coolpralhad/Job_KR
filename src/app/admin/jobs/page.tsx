/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Eye } from "lucide-react"

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-600" },
  pending_payment: { label: "Pending Payment", cls: "bg-yellow-100 text-yellow-700" },
  under_review: { label: "Under Review", cls: "bg-blue-100 text-blue-700" },
  active: { label: "Active", cls: "bg-green-100 text-green-700" },
  paused: { label: "Paused", cls: "bg-orange-100 text-orange-700" },
  closed: { label: "Closed", cls: "bg-red-100 text-red-700" },
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const profileRes = await (supabase as any).from("profiles").select("role").eq("id", user.id).single()
  if (profileRes.data?.role !== "admin") redirect("/dashboard")

  const { status, q } = await searchParams
  const admin = createAdminClient()

  let query = (admin as any)
    .from("jobs")
    .select("id, title, status, payment_status, city, industry, created_at, companies(legal_name, display_name)")
    .order("created_at", { ascending: false })
    .limit(50)

  if (status) query = query.eq("status", status)

  const { data: jobs } = await query as { data: any[] | null }

  const filtered = q
    ? (jobs ?? []).filter((j: any) => j.title.toLowerCase().includes(q.toLowerCase()))
    : (jobs ?? [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-700">← Admin</Link>
          <h1 className="text-xl font-bold text-gray-900">Job Management</h1>
        </div>

        <form method="get" className="mb-5 flex flex-wrap gap-2">
          <input name="q" defaultValue={q} placeholder="Search by title…"
            className="h-9 flex-1 min-w-48 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none" />
          <select name="status" defaultValue={status ?? ""} className="h-9 appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
            <option value="">All statuses</option>
            {Object.keys(STATUS_BADGE).map((s) => <option key={s} value={s}>{STATUS_BADGE[s].label}</option>)}
          </select>
          <button type="submit" className="h-9 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800">Filter</button>
          {(status || q) && <Link href="/admin/jobs" className="h-9 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700">Clear</Link>}
        </form>

        <p className="mb-4 text-sm text-gray-500">{filtered.length} job{filtered.length !== 1 ? "s" : ""}</p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Posted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">No jobs found.</td></tr>
              ) : filtered.map((job: any) => {
                const company = job.companies as { legal_name: string; display_name: string | null } | null
                const badge = STATUS_BADGE[job.status] ?? { label: job.status, cls: "bg-gray-100 text-gray-600" }
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                    <td className="px-4 py-3 text-gray-500">{company?.display_name ?? company?.legal_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{job.payment_status?.replace("_", " ") ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="px-4 py-3">
                      <Link href={`/jobs/${job.id}`}>
                        <button className="text-gray-400 hover:text-blue-700 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

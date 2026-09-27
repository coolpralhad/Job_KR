/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const ROLE_BADGE: Record<string, string> = {
  candidate: "bg-blue-100 text-blue-700",
  employer: "bg-indigo-100 text-indigo-700",
  admin: "bg-red-100 text-red-700",
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const profileRes = await (supabase as any).from("profiles").select("role").eq("id", user.id).single()
  if (profileRes.data?.role !== "admin") redirect("/dashboard")

  const { role, q } = await searchParams
  const admin = createAdminClient() as any

  let query = admin
    .from("profiles")
    .select("id, role, created_at")
    .order("created_at", { ascending: false })
    .limit(50)

  if (role && ["candidate", "employer", "admin"].includes(role)) {
    query = query.eq("role", role)
  }

  const { data: profiles } = await query as { data: any[] | null }

  const candidateIds = (profiles ?? []).filter((p: any) => p.role === "candidate").map((p: any) => p.id)
  const employerIds = (profiles ?? []).filter((p: any) => p.role === "employer").map((p: any) => p.id)

  const [{ data: candidates }, { data: employers }] = await Promise.all([
    candidateIds.length > 0
      ? admin.from("candidate_profiles").select("id, full_name, current_title").in("id", candidateIds)
      : { data: [] },
    employerIds.length > 0
      ? admin.from("employer_profiles").select("id, job_title, companies(legal_name, display_name)").in("id", employerIds)
      : { data: [] },
  ]) as [{ data: any[] | null }, { data: any[] | null }]

  const candidateMap: Record<string, any> = {}
  for (const c of candidates ?? []) candidateMap[c.id] = c
  const employerMap: Record<string, any> = {}
  for (const e of employers ?? []) employerMap[e.id] = e

  const allProfiles = profiles ?? []
  const filtered = q
    ? allProfiles.filter((p: any) => {
        const name = p.role === "candidate"
          ? (candidateMap[p.id]?.full_name ?? "")
          : (employerMap[p.id]?.companies?.legal_name ?? "")
        return name.toLowerCase().includes(q.toLowerCase())
      })
    : allProfiles

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-700">← Admin</Link>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        </div>

        <form method="get" className="mb-5 flex flex-wrap gap-2">
          <input name="q" defaultValue={q} placeholder="Search by name or company…"
            className="h-9 flex-1 min-w-48 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none" />
          <select name="role" defaultValue={role ?? ""} className="h-9 appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-blue-400 focus:outline-none">
            <option value="">All roles</option>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="h-9 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800">Filter</button>
          {(role || q) && <Link href="/admin/users" className="h-9 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700">Clear</Link>}
        </form>

        <p className="mb-4 text-sm text-gray-500">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">No users found.</td></tr>
              ) : filtered.map((p: any) => {
                const isCandidate = p.role === "candidate"
                const info = isCandidate ? candidateMap[p.id] : employerMap[p.id]
                const displayName = isCandidate
                  ? info?.full_name ?? "—"
                  : info?.companies?.display_name ?? info?.companies?.legal_name ?? "—"
                const subInfo = isCandidate ? info?.current_title ?? "" : info?.job_title ?? ""
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_BADGE[p.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{subInfo || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
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

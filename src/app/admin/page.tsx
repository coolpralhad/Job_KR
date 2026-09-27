/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, Briefcase, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const profileRes = await (supabase as any).from("profiles").select("role").eq("id", user.id).single()
  if (profileRes.data?.role !== "admin") redirect("/dashboard")

  const admin = createAdminClient() as any

  const [
    { count: candidateCount },
    { count: employerCount },
    { count: activeJobCount },
    { count: pendingVerif },
    { count: pendingPayment },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "candidate"),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "employer"),
    admin.from("jobs").select("*", { count: "exact", head: true }).eq("status", "active"),
    admin.from("companies").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    admin.from("jobs").select("*", { count: "exact", head: true }).eq("payment_status", "pending_confirmation"),
  ])

  const { data: recentApps } = await admin
    .from("applications")
    .select("id, created_at, status, jobs(title), candidate_profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(5) as { data: any[] | null }

  const stats = [
    { label: "Candidates", value: candidateCount ?? 0, icon: Users, href: "/admin/users?role=candidate", color: "bg-blue-50 text-blue-700" },
    { label: "Employers", value: employerCount ?? 0, icon: ShieldCheck, href: "/admin/users?role=employer", color: "bg-indigo-50 text-indigo-700" },
    { label: "Active Jobs", value: activeJobCount ?? 0, icon: Briefcase, href: "/admin/jobs", color: "bg-green-50 text-green-700" },
    { label: "Pending Verification", value: pendingVerif ?? 0, icon: CheckCircle2, href: "/admin/verification", color: pendingVerif ? "bg-yellow-50 text-yellow-700" : "bg-gray-50 text-gray-600" },
    { label: "Pending Payment", value: pendingPayment ?? 0, icon: CreditCard, href: "/admin/payments", color: pendingPayment ? "bg-orange-50 text-orange-700" : "bg-gray-50 text-gray-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">JOB-KR operations overview.</p>
        </div>

        {(pendingVerif || 0) > 0 || (pendingPayment || 0) > 0 ? (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {(pendingVerif || 0) > 0 && <span className="mr-4">⚠️ {pendingVerif} verification{(pendingVerif || 0) > 1 ? "s" : ""} pending review</span>}
            {(pendingPayment || 0) > 0 && <span>⚠️ {pendingPayment} payment{(pendingPayment || 0) > 1 ? "s" : ""} to confirm</span>}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Admin Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Review Verifications", href: "/admin/verification", badge: pendingVerif ?? 0 },
                { label: "Confirm Payments", href: "/admin/payments", badge: pendingPayment ?? 0 },
                { label: "Manage Jobs", href: "/admin/jobs", badge: 0 },
                { label: "Manage Users", href: "/admin/users", badge: 0 },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">{item.badge}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Recent Applications</h2>
            {recentApps && recentApps.length > 0 ? (
              <div className="space-y-3">
                {recentApps.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-800">{app.candidate_profiles?.full_name ?? "Candidate"}</p>
                      <p className="text-gray-500">{app.jobs?.title ?? "Job"}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">{app.status}</span>
                      <p className="mt-0.5 text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No applications yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

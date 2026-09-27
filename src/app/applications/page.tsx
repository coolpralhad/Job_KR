/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ApplicationsView from "./ApplicationsView"

type Tab = "all" | "applied" | "viewed" | "shortlisted" | "interview" | "offer" | "rejected"

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = (tab as Tab) ?? "all"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  let query = (supabase as any)
    .from("applications")
    .select(`
      id, status, applied_at, cover_message,
      jobs (id, title, city, job_type, salary_min, salary_max,
        companies (display_name, legal_name)
      )
    `)
    .eq("candidate_id", user.id)
    .order("applied_at", { ascending: false })

  if (activeTab !== "all") {
    query = query.eq("status", activeTab)
  }

  const { data: applications } = await query as { data: any[] | null }

  return <ApplicationsView applications={applications} activeTab={activeTab} />
}

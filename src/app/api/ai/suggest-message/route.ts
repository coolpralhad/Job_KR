/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { suggestContactMessage } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobTitle, candidateName } = await req.json()
  if (!jobTitle) return NextResponse.json({ error: "jobTitle required" }, { status: 400 })

  const admin = createAdminClient() as any
  const { data: emp } = await admin.from("employer_profiles").select("company_id").eq("id", user.id).single() as { data: any }
  let companyName = "our company"
  if (emp?.company_id) {
    const { data: co } = await admin.from("companies").select("display_name, legal_name").eq("id", emp.company_id).single() as { data: any }
    companyName = co?.display_name ?? co?.legal_name ?? companyName
  }

  try {
    const message = await suggestContactMessage(jobTitle, companyName, candidateName ?? "Candidate", user.id)
    return NextResponse.json({ message })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error"
    if (msg.includes("Rate limit")) return NextResponse.json({ error: msg }, { status: 429 })
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}

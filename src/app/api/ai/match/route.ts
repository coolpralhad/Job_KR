import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { scoreMatch } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await req.json()
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 })

  const { data: job } = await supabase.from("jobs").select("*").eq("id", jobId).single()
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const { data: candidate } = await supabase
    .from("candidate_profiles")
    .select("current_title, skills, experience_years, visa_type, topik_level, languages, location")
    .eq("id", user.id)
    .single()
  if (!candidate) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 })

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await scoreMatch(job as any, candidate as any, user.id)
    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error"
    if (msg.includes("Rate limit")) return NextResponse.json({ error: msg }, { status: 429 })
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}

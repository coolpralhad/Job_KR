import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { explainJob } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobDescription, requirements, candidateLanguage } = await req.json()
  if (!jobDescription) return NextResponse.json({ error: "jobDescription required" }, { status: 400 })

  try {
    const result = await explainJob(jobDescription, requirements ?? "", candidateLanguage ?? "English")
    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error"
    if (msg.includes("Rate limit")) return NextResponse.json({ error: msg }, { status: 429 })
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { structureJobFromText } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { input } = await req.json()
  if (!input?.trim()) return NextResponse.json({ error: "Input required" }, { status: 400 })

  try {
    const draft = await structureJobFromText(input, user.id)
    return NextResponse.json(draft)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error"
    if (msg.includes("Rate limit")) return NextResponse.json({ error: msg }, { status: 429 })
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}

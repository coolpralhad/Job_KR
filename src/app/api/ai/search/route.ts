import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { parseJobSearch } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { query } = await req.json()
  if (!query?.trim()) return NextResponse.json({ error: "query required" }, { status: 400 })

  try {
    const criteria = await parseJobSearch(query, user.id)
    return NextResponse.json(criteria)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI error"
    if (msg.includes("Rate limit")) return NextResponse.json({ error: msg }, { status: 429 })
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}

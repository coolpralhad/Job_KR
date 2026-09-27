import { NextRequest, NextResponse } from "next/server"

const isConfigured = !!(process.env.INNGEST_EVENT_KEY && process.env.INNGEST_SIGNING_KEY)

async function getHandler() {
  if (!isConfigured) return null
  const { serve } = await import("inngest/next")
  const { inngest, sendJobAlerts } = await import("@/lib/inngest")
  return serve({ client: inngest, functions: [sendJobAlerts] })
}

const disabled = () => NextResponse.json({ error: "Inngest not configured" }, { status: 503 })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, ctx: any) {
  const h = await getHandler()
  return h ? h.GET(req, ctx) : disabled()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, ctx: any) {
  const h = await getHandler()
  return h ? h.POST(req, ctx) : disabled()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, ctx: any) {
  const h = await getHandler()
  return h ? h.PUT(req, ctx) : disabled()
}

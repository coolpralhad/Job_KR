/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobId } = await req.json()
  const adminClient = createAdminClient() as any

  const { data: job } = await adminClient
    .from("jobs")
    .select("title, companies(legal_name, display_name)")
    .eq("id", jobId)
    .single() as { data: any }

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const { data: payment } = await adminClient
    .from("payment_records")
    .select("amount, reference_code")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single() as { data: any }

  const company = job.companies as { legal_name: string; display_name: string | null } | null
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER ?? ""

  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `[JOB-KR] Payment pending confirmation: ${job.title}`,
      html: `
        <p>An employer has submitted bank transfer proof for a job posting.</p>
        <table style="border-collapse:collapse;margin-top:12px">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Job</td><td style="font-weight:600">${job.title}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Company</td><td>${company?.display_name ?? company?.legal_name ?? "—"}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Amount</td><td>₩${payment?.amount?.toLocaleString() ?? "—"}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Reference</td><td style="font-family:monospace">${payment?.reference_code ?? "—"}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Submitted by</td><td>${user.email}</td></tr>
        </table>
        <p style="margin-top:16px"><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/payments" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">Review payment →</a></p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}

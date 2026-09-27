/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { companyId } = await req.json()
  const adminClient = createAdminClient() as any

  const { data: company } = await adminClient
    .from("companies")
    .select("legal_name, display_name, business_reg_number, verification_status")
    .eq("id", companyId)
    .single() as { data: any }

  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 })

  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER ?? ""

  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `[JOB-KR] New verification request: ${company.display_name ?? company.legal_name}`,
      html: `
        <p>A new employer has submitted their business verification documents.</p>
        <table style="border-collapse:collapse;margin-top:12px">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Company</td><td style="font-weight:600">${company.display_name ?? company.legal_name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Business Reg #</td><td>${company.business_reg_number ?? "—"}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280">Submitted by</td><td>${user.email}</td></tr>
        </table>
        <p style="margin-top:16px"><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/verification" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">Review in Admin →</a></p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}

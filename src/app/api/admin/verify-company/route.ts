/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profileRes = await (supabase as any).from("profiles").select("role").eq("id", user.id).single()
  if (profileRes.data?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { companyId, action, reason } = await req.json()
  const admin = createAdminClient() as any

  const { data: company } = await admin
    .from("companies")
    .select("legal_name, display_name")
    .eq("id", companyId)
    .single() as { data: any }

  const { data: emp } = await admin
    .from("employer_profiles")
    .select("id")
    .eq("company_id", companyId)
    .single() as { data: any }

  if (emp?.id) {
    const { data: authUser } = await admin.auth.admin.getUserById(emp.id)
    const email = authUser?.user?.email
    if (email) {
      const companyName = company?.display_name ?? company?.legal_name ?? "your company"
      await sendEmail({
        to: email,
        subject: action === "approve"
          ? `Your company ${companyName} is verified on JOB-KR`
          : `Verification update for ${companyName}`,
        html: action === "approve"
          ? `<p>Great news! <strong>${companyName}</strong> has been verified on JOB-KR. You can now post jobs.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/jobs/create" style="color:#1d4ed8">Post your first job →</a></p>`
          : `<p>We were unable to verify <strong>${companyName}</strong>.</p>${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}<p>Please <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding/verification" style="color:#1d4ed8">resubmit your documents</a> or contact support.</p>`,
      })
    }
  }

  await admin.from("admin_logs").insert({
    admin_id: user.id,
    action: `company_verification_${action}`,
    target_id: companyId,
    target_type: "company",
    notes: reason ?? null,
  })

  return NextResponse.json({ ok: true })
}

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

  const { jobId, action, note } = await req.json()
  const admin = createAdminClient() as any

  const { data: job } = await admin
    .from("jobs")
    .select("title, company_id")
    .eq("id", jobId)
    .single() as { data: any }

  if (job?.company_id) {
    const { data: emp } = await admin.from("employer_profiles").select("id").eq("company_id", job.company_id).single() as { data: any }
    if (emp?.id) {
      const { data: authUser } = await admin.auth.admin.getUserById(emp.id)
      const email = authUser?.user?.email
      if (email) {
        await sendEmail({
          to: email,
          subject: action === "confirm"
            ? `Payment confirmed — "${job.title}" is now live!`
            : `Payment update for "${job.title}"`,
          html: action === "confirm"
            ? `<p>Your payment has been confirmed and <strong>${job.title}</strong> is now live on JOB-KR.</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" style="color:#1d4ed8">View your listing →</a></p>`
            : `<p>We were unable to confirm your payment for <strong>${job.title}</strong>.</p>${note ? `<p><strong>Note:</strong> ${note}</p>` : ""}<p>Please <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/jobs" style="color:#1d4ed8">resubmit payment</a> or contact support.</p>`,
        })
      }
    }
  }

  await admin.from("admin_logs").insert({
    admin_id: user.id,
    action: `payment_${action}`,
    target_id: jobId,
    target_type: "job",
    notes: note ?? null,
  })

  return NextResponse.json({ ok: true })
}

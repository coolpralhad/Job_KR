/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { candidateId, jobId, message } = await req.json()
  if (!candidateId || !jobId || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const adminClient = createAdminClient() as any

  const { data: candidateAuth } = await adminClient.auth.admin.getUserById(candidateId)
  const candidateEmail = candidateAuth?.user?.email

  const { data: job } = await adminClient.from("jobs").select("title, companies(display_name, legal_name)").eq("id", jobId).single() as { data: any }
  const company = job?.companies as { legal_name: string; display_name: string | null } | null
  const companyName = company?.display_name ?? company?.legal_name ?? "An employer"
  const jobTitle = job?.title ?? "a position"

  if (candidateEmail) {
    await sendEmail({
      to: candidateEmail,
      subject: `${companyName} wants to connect about ${jobTitle} on JOB-KR`,
      html: `
        <p>Hello,</p>
        <p><strong>${companyName}</strong> has reached out about the position <strong>${jobTitle}</strong>.</p>
        <blockquote style="border-left:3px solid #e5e7eb;padding:12px 16px;margin:16px 0;color:#374151;font-style:italic">
          ${message.replace(/\n/g, "<br>")}
        </blockquote>
        <p>You can reply directly to this email. The employer will receive your response at <strong>${user.email}</strong>.</p>
        <p style="margin-top:24px">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">View Job →</a>
        </p>
      `,
      replyTo: user.email,
    })
  }

  await adminClient.from("email_logs").insert({
    sent_by: user.id,
    recipient_email: candidateEmail ?? "",
    subject: `${companyName} wants to connect about ${jobTitle}`,
  })

  return NextResponse.json({ ok: true })
}

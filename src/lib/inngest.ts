import { Inngest } from "inngest"
import { createAdminClient } from "./supabase/admin"
import { sendEmail } from "./mailer"

export const inngest = new Inngest({ id: "job-kr" })

export const sendJobAlerts = inngest.createFunction(
  { id: "send-job-alerts", name: "Send Job Alert Digests", triggers: [{ cron: "0 8 * * *" }] },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async () => {
    const admin = createAdminClient() as any

    const { data: alerts } = await admin
      .from("job_alerts")
      .select("id, candidate_id, criteria, frequency, last_sent_at")
      .eq("active", true)

    if (!alerts) return { sent: 0 }

    let sent = 0

    for (const alert of alerts) {
      const now = new Date()
      const lastSent = alert.last_sent_at ? new Date(alert.last_sent_at) : null

      let shouldSend = false
      if (alert.frequency === "immediately") shouldSend = true
      else if (alert.frequency === "daily") {
        shouldSend = !lastSent || (now.getTime() - lastSent.getTime()) >= 86400000
      } else if (alert.frequency === "weekly") {
        shouldSend = !lastSent || (now.getTime() - lastSent.getTime()) >= 604800000
      }

      if (!shouldSend) continue

      const criteria = (alert.criteria ?? {}) as Record<string, string>

      // Find matching jobs
      let query = (admin as any)
        .from("jobs")
        .select("id, title, city, industry, visa_types, salary_min, salary_max, companies(display_name, legal_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10)

      if (criteria.keyword) query = query.ilike("title", `%${criteria.keyword}%`)
      if (criteria.location) query = query.ilike("city", `%${criteria.location}%`)
      if (criteria.industry) query = query.eq("industry", criteria.industry)

      const { data: jobs } = await query as { data: any[] | null }

      if (!jobs || jobs.length === 0) continue

      // Get candidate email
      const { data: authUser } = await admin.auth.admin.getUserById(alert.candidate_id)
      const email = authUser?.user?.email
      if (!email) continue

      const jobListHtml = jobs.map((job) => {
        const company = job.companies as { legal_name: string; display_name: string | null } | null
        const companyName = company?.display_name ?? company?.legal_name ?? "Company"
        const visas = (job.visa_types as string[] | null)?.join(", ") ?? ""
        return `
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px">
            <p style="font-weight:600;margin:0 0 4px">${job.title}</p>
            <p style="color:#6b7280;font-size:13px;margin:0 0 4px">${companyName}${job.city ? ` · ${job.city}` : ""}</p>
            ${visas ? `<p style="font-size:12px;color:#3b82f6;margin:0 0 8px">${visas}</p>` : ""}
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}" style="color:#1d4ed8;font-size:13px">View job →</a>
          </div>
        `
      }).join("")

      await sendEmail({
        to: email,
        subject: `${jobs.length} new job${jobs.length !== 1 ? "s" : ""} matching your alert: "${criteria.keyword || criteria.industry || "your search"}"`,
        html: `
          <p>Hi! Here are the latest jobs matching your alert on JOB-KR:</p>
          ${jobListHtml}
          <p style="margin-top:16px">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">Browse all jobs →</a>
          </p>
          <p style="margin-top:16px;font-size:12px;color:#9ca3af">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts" style="color:#9ca3af">Manage your alerts</a>
          </p>
        `,
      })

      await admin
        .from("job_alerts")
        .update({ last_sent_at: now.toISOString() })
        .eq("id", alert.id)

      sent++
    }

    return { sent }
  }
)

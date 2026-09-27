import nodemailer from "nodemailer"

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const transporter = getTransporter()
  if (!transporter) {
    console.log(`[email skipped — GMAIL not configured] to=${to} subject="${subject}"`)
    return
  }
  await transporter.sendMail({
    from: `"JOB-KR" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  })
}

// ─── Templates ────────────────────────────────────────────────────────────────

function wrap(content: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif">
    <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:#1d4ed8;padding:20px 28px">
        <span style="color:#fff;font-size:20px;font-weight:700">JOB<span style="color:#fbbf24">-KR</span></span>
      </div>
      <div style="padding:28px">
        ${content}
      </div>
      <div style="background:#f9fafb;padding:16px 28px;border-top:1px solid #e5e7eb">
        <p style="margin:0;color:#9ca3af;font-size:12px">
          JOB-KR · Korea's job portal for international workers<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color:#6b7280">Privacy Policy</a> ·
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color:#6b7280">Terms</a>
        </p>
      </div>
    </div>
  </body>
  </html>`
}

export const templates = {
  welcome(name: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Welcome to JOB-KR, ${name}!</h2>
      <p style="color:#374151">Your account has been created. Start exploring jobs that match your visa and skills.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">Browse Jobs</a>
    `)
  },

  applicationConfirmed(candidateName: string, jobTitle: string, companyName: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Application Received</h2>
      <p style="color:#374151">Hi ${candidateName},</p>
      <p style="color:#374151">Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">Track Application</a>
    `)
  },

  applicationStatusChanged(candidateName: string, jobTitle: string, status: string, message?: string) {
    const statusLabels: Record<string, string> = {
      viewed: "Your application has been viewed",
      shortlisted: "You've been shortlisted",
      interview: "You've been invited for an interview",
      offer: "You've received a job offer",
      rejected: "Application update",
    }
    return wrap(`
      <h2 style="color:#111827;margin-top:0">${statusLabels[status] ?? "Application Update"}</h2>
      <p style="color:#374151">Hi ${candidateName},</p>
      <p style="color:#374151">Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status}</strong>.</p>
      ${message ? `<p style="color:#374151;background:#f3f4f6;padding:12px;border-radius:8px">${message}</p>` : ""}
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/applications" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">View Application</a>
    `)
  },

  jobAlertDigest(candidateName: string, jobs: { title: string; company: string; city: string; id: string }[], frequency: string) {
    const jobRows = jobs.map((j) => `
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px">
        <p style="margin:0 0 4px;font-weight:600;color:#111827">${j.title}</p>
        <p style="margin:0;color:#6b7280;font-size:14px">${j.company} · ${j.city}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${j.id}" style="display:inline-block;margin-top:8px;color:#1d4ed8;font-size:14px;text-decoration:none">View job →</a>
      </div>
    `).join("")
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Your ${frequency} job alert</h2>
      <p style="color:#374151">Hi ${candidateName}, here are your latest matching jobs:</p>
      ${jobRows}
      <p style="color:#9ca3af;font-size:12px;margin-top:16px"><a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts" style="color:#6b7280">Manage alerts</a></p>
    `)
  },

  verificationSubmitted(adminEmail: string, companyName: string, companyId: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">New Verification Request</h2>
      <p style="color:#374151"><strong>${companyName}</strong> has submitted a verification request.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/verification/${companyId}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">Review Request</a>
    `)
  },

  verificationApproved(employerName: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Company Verified ✓</h2>
      <p style="color:#374151">Hi ${employerName},</p>
      <p style="color:#374151">Your company has been verified. You can now post jobs on JOB-KR.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/jobs/create" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">Post Your First Job</a>
    `)
  },

  verificationRejected(employerName: string, reason: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Verification Update</h2>
      <p style="color:#374151">Hi ${employerName},</p>
      <p style="color:#374151">We were unable to verify your company at this time.</p>
      <p style="color:#374151;background:#fef2f2;padding:12px;border-radius:8px;border-left:4px solid #ef4444"><strong>Reason:</strong> ${reason}</p>
      <p style="color:#374151">Please contact <a href="mailto:${process.env.GMAIL_USER}">${process.env.GMAIL_USER}</a> if you have questions.</p>
    `)
  },

  paymentPending(adminEmail: string, companyName: string, jobTitle: string, paymentId: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Payment Proof Submitted</h2>
      <p style="color:#374151"><strong>${companyName}</strong> has submitted payment proof for: <strong>${jobTitle}</strong></p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/payments/${paymentId}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">Confirm Payment</a>
    `)
  },

  paymentConfirmed(employerName: string, jobTitle: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Payment Confirmed</h2>
      <p style="color:#374151">Hi ${employerName},</p>
      <p style="color:#374151">Your payment for <strong>${jobTitle}</strong> has been confirmed. Your job is now under review and will go live shortly.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/employer/jobs" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">View Jobs</a>
    `)
  },

  jobPosted(employerName: string, jobTitle: string, jobId: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Job Posted Successfully</h2>
      <p style="color:#374151">Hi ${employerName},</p>
      <p style="color:#374151">Your job listing <strong>${jobTitle}</strong> is now live on JOB-KR.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">View Listing</a>
    `)
  },

  candidateContact(candidateName: string, employerName: string, companyName: string, jobTitle: string, message: string, replyTo: string) {
    return wrap(`
      <h2 style="color:#111827;margin-top:0">Message from ${companyName}</h2>
      <p style="color:#374151">Hi ${candidateName},</p>
      <p style="color:#374151"><strong>${employerName}</strong> from <strong>${companyName}</strong> has sent you a message regarding <strong>${jobTitle}</strong>:</p>
      <p style="color:#374151;background:#f3f4f6;padding:16px;border-radius:8px;border-left:4px solid #1d4ed8">${message}</p>
      <p style="color:#6b7280;font-size:14px">Reply directly to: <a href="mailto:${replyTo}" style="color:#1d4ed8">${replyTo}</a></p>
    `)
  },
}

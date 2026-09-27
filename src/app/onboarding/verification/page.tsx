"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Upload, Loader2, AlertCircle } from "lucide-react"

export default function VerificationPage() {
  const router = useRouter()
  const supabase = createClient()
  const [company, setCompany] = useState<{ id: string; legal_name: string; verification_status: string } | null>(null)
  const [certFile, setCertFile] = useState<File | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: emp } = await supabase
        .from("employer_profiles")
        .select("company_id")
        .eq("id", user.id)
        .single()
      if (!emp?.company_id) { router.push("/onboarding/company"); return }
      const { data: co } = await supabase
        .from("companies")
        .select("id, legal_name, verification_status")
        .eq("id", emp.company_id)
        .single()
      setCompany(co)
      if (co?.verification_status === "approved") {
        router.push("/employer/dashboard")
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!certFile) { setError("Please upload your business registration certificate."); return }
    if (!confirmed) { setError("Please confirm you are authorized to recruit on behalf of this company."); return }
    setError("")
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !company) return

    // Upload verification document
    const path = `verifications/${company.id}/${Date.now()}-${certFile.name}`
    const { error: uploadErr } = await supabase.storage
      .from("documents")
      .upload(path, certFile, { upsert: true })

    if (uploadErr) { setError(uploadErr.message); setLoading(false); return }

    // Update company with document path
    await supabase
      .from("companies")
      .update({ verification_status: "pending" })
      .eq("id", company.id)

    // Notify admin via API
    await fetch("/api/admin/notify-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: company.id }),
    })

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted || company?.verification_status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-xl font-bold text-gray-900">Verification Status</h1>
            <div className="space-y-4">
              {[
                { label: "Company information", status: "done" },
                { label: "Business certificate", status: "done" },
                { label: "Admin review", status: "pending" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {item.status === "done"
                    ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    : <Clock className="h-5 w-5 text-yellow-500 shrink-0" />}
                  <span className="text-sm text-gray-700">{item.label}</span>
                  {item.status === "pending" && (
                    <span className="ml-auto text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                      SLA: 1 working day
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-medium">What happens next?</p>
              <p className="mt-1 text-blue-700">Our team will review your application within 1 working day. You&apos;ll receive an email when the decision is made.</p>
              <p className="mt-2 text-blue-700">You can prepare your job posting in the meantime.</p>
            </div>
            <Button
              onClick={() => router.push("/employer/jobs/create")}
              className="mt-5 w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              Prepare a Job Posting →
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verify your company</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload your business registration certificate to get verified within 1 working day.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Registration Certificate <span className="text-blue-600">*</span>
              </label>
              <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                certFile ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
              }`}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                  onChange={(e) => setCertFile(e.target.files?.[0] ?? null)} />
                {certFile ? (
                  <>
                    <CheckCircle2 className="mb-2 h-6 w-6 text-green-600" />
                    <p className="text-sm font-medium text-green-700">{certFile.name}</p>
                    <p className="text-xs text-green-500">Click to replace</p>
                  </>
                ) : (
                  <>
                    <Upload className="mb-2 h-6 w-6 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600">Upload certificate</p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG up to 5MB</p>
                  </>
                )}
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="confirm" className="text-sm text-gray-700">
                I confirm that I am authorised to recruit on behalf of this company and that the information provided is accurate.
              </label>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Documents are reviewed by our team and kept confidential.
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for Verification"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

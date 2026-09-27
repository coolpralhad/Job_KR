"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Upload, Copy, Loader2, AlertCircle } from "lucide-react"

const FEE_MANWON = parseInt(process.env.NEXT_PUBLIC_JOB_POSTING_FEE_MANWON ?? "990")
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME ?? "Kakao Bank"
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "3333-00-0000000"
const BANK_HOLDER = process.env.NEXT_PUBLIC_BANK_HOLDER ?? "JOB-KR Corp"

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [job, setJob] = useState<{ title: string } | null>(null)
  const [referenceCode, setReferenceCode] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("jobs").select("title").eq("id", id).single()
      setJob(data)
      // Generate reference code
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
      const rand = Math.floor(Math.random() * 9000 + 1000)
      setReferenceCode(`JOB-${date}-${rand}`)
    }
    load()
  }, [id])

  function copyRef() {
    navigator.clipboard.writeText(referenceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!confirmed) { setError("Please confirm you have completed the transfer."); return }
    setError("")
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let proofPath: string | null = null
    if (proofFile) {
      const path = `payments/${id}/${Date.now()}-${proofFile.name}`
      await supabase.storage.from("documents").upload(path, proofFile, { upsert: true })
      proofPath = path
    }

    await supabase.from("payment_records").insert({
      job_id: id,
      amount: FEE_MANWON * 10000,
      proof_path: proofPath,
      reference_code: referenceCode,
    })

    await supabase.from("jobs").update({ payment_status: "pending_confirmation" }).eq("id", id)

    // Notify admin
    await fetch("/api/admin/notify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    })

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment submitted</h1>
        <p className="mt-3 max-w-md text-gray-500">
          Our team will verify your transfer within 1 working day and activate your listing.
        </p>
        <Button onClick={() => router.push("/employer/jobs")} className="mt-8 bg-blue-700 hover:bg-blue-800 text-white">
          View my jobs
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          {job && <p className="mt-1 text-sm text-gray-500">For: {job.title}</p>}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          {/* Amount */}
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-600">Job listing fee</p>
            <p className="text-3xl font-extrabold text-blue-700">₩{(FEE_MANWON * 10000).toLocaleString()}</p>
            <p className="text-xs text-blue-400">One-time fee · 60-day active listing</p>
          </div>

          {/* Bank details */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Bank Transfer Details</p>
            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
              {[
                { label: "Bank", value: BANK_NAME },
                { label: "Account number", value: BANK_ACCOUNT },
                { label: "Account holder", value: BANK_HOLDER },
                { label: "Amount", value: `₩${(FEE_MANWON * 10000).toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-mono font-medium text-gray-800">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-3 text-sm">
                <span className="text-gray-400">Reference</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-blue-700">{referenceCode}</span>
                  <button onClick={copyRef} className="text-gray-400 hover:text-blue-700 transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {copied && <span className="text-xs text-green-600">Copied!</span>}
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">⚠️ Include the reference code in the transfer memo so we can identify your payment.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Upload proof of transfer (optional)</p>
              <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 text-sm transition-colors ${
                proofFile ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 hover:border-blue-300 text-gray-500"
              }`}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                  onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} />
                {proofFile ? <><CheckCircle2 className="h-4 w-4 text-green-600" />{proofFile.name}</> : <><Upload className="h-4 w-4" />Upload receipt</>}
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="confirm" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600" />
              <label htmlFor="confirm" className="text-sm text-gray-700">
                I have completed the bank transfer using the reference code above.
              </label>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Your job will be activated within 1 working day after payment is confirmed.
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-blue-700 hover:bg-blue-800 text-white">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "I have completed the transfer"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

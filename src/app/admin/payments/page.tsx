"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react"

type PaymentRecord = {
  id: string
  job_id: string
  amount: number
  reference_code: string | null
  proof_path: string | null
  status: string
  created_at: string
  jobs: { title: string; companies: { legal_name: string; display_name: string | null } | null } | null
}

export default function AdminPaymentsPage() {
  const supabase = createClient()
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState<"pending_confirmation" | "confirmed" | "rejected">("pending_confirmation")
  const [showReject, setShowReject] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({})

  useEffect(() => { loadRecords() }, [filter])

  async function loadRecords() {
    setLoading(true)
    const { data } = await (supabase as any)
      .from("payment_records")
      .select("id, job_id, amount, reference_code, proof_path, status, created_at, jobs(title, companies(legal_name, display_name))")
      .eq("status", filter)
      .order("created_at", { ascending: false }) as { data: any[] | null }
    setRecords((data ?? []) as PaymentRecord[])
    setLoading(false)
  }

  async function confirm(record: PaymentRecord) {
    setProcessing(record.id)
    await (supabase as any).from("payment_records").update({ status: "confirmed" }).eq("id", record.id)
    await (supabase as any).from("jobs").update({ payment_status: "paid", status: "active" }).eq("id", record.job_id)
    await fetch("/api/admin/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: record.job_id, action: "confirm" }),
    })
    setRecords((prev) => prev.filter((r) => r.id !== record.id))
    setProcessing(null)
  }

  async function reject(record: PaymentRecord) {
    const note = rejectNote[record.id]?.trim()
    setProcessing(record.id)
    await (supabase as any).from("payment_records").update({ status: "rejected" }).eq("id", record.id)
    await (supabase as any).from("jobs").update({ payment_status: "unpaid" }).eq("id", record.job_id)
    await fetch("/api/admin/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: record.job_id, action: "reject", note }),
    })
    setRecords((prev) => prev.filter((r) => r.id !== record.id))
    setShowReject(null)
    setProcessing(null)
  }

  async function getDocUrl(path: string) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(path, 900)
    if (data?.signedUrl) window.open(data.signedUrl, "_blank")
  }

  const TABS: { key: "pending_confirmation" | "confirmed" | "rejected"; label: string }[] = [
    { key: "pending_confirmation", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "rejected", label: "Rejected" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Payment Confirmation</h1>
        </div>

        <div className="mb-5 flex gap-1 border-b border-gray-200 pb-px">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                filter === t.key ? "border-b-2 border-blue-700 text-blue-700" : "text-gray-500 hover:text-gray-800"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
        ) : records.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            No {filter === "pending_confirmation" ? "pending" : filter} payments.
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const job = record.jobs
              const company = job?.companies
              return (
                <div key={record.id} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">{job?.title ?? "Job"}</h2>
                      <p className="text-sm text-gray-500">{company?.display_name ?? company?.legal_name ?? "Unknown company"}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="font-mono font-semibold text-blue-700">{record.reference_code}</span>
                        <span>₩{record.amount.toLocaleString()}</span>
                        <span>{new Date(record.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {record.proof_path && (
                        <Button variant="outline" size="sm" onClick={() => getDocUrl(record.proof_path!)}
                          className="h-8 text-xs flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" /> Proof
                        </Button>
                      )}
                      {filter === "pending_confirmation" && (
                        <>
                          <Button size="sm" onClick={() => confirm(record)} disabled={processing === record.id}
                            className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1">
                            {processing === record.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowReject(showReject === record.id ? null : record.id)}
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50 text-xs flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {showReject === record.id && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">Rejection note (optional, sent to employer)</label>
                      <textarea
                        value={rejectNote[record.id] ?? ""}
                        onChange={(e) => setRejectNote((prev) => ({ ...prev, [record.id]: e.target.value }))}
                        rows={2} placeholder="e.g. Transfer amount does not match. Please resubmit."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:border-blue-400 focus:outline-none"
                      />
                      <Button size="sm" onClick={() => reject(record)} disabled={processing === record.id}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs">
                        {processing === record.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Reject Payment"}
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

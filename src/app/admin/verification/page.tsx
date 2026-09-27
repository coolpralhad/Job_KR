"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react"

type Company = {
  id: string
  legal_name: string
  display_name: string | null
  business_reg_number: string | null
  verification_status: string
  city: string | null
  verification_doc_path: string | null
  created_at: string
}

export default function AdminVerificationPage() {
  const supabase = createClient()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
  const [showReject, setShowReject] = useState<string | null>(null)
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending")

  useEffect(() => { loadCompanies() }, [filter])

  async function loadCompanies() {
    setLoading(true)
    const { data } = await (supabase as any)
      .from("companies")
      .select("id, legal_name, display_name, business_reg_number, verification_status, city, verification_doc_path, created_at")
      .eq("verification_status", filter)
      .order("created_at", { ascending: false }) as { data: any[] | null }
    setCompanies(data ?? [])
    setLoading(false)
  }

  async function approve(companyId: string) {
    setProcessing(companyId)
    await (supabase as any).from("companies").update({ verification_status: "approved" }).eq("id", companyId)
    await fetch("/api/admin/verify-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, action: "approve" }),
    })
    setCompanies((prev) => prev.filter((c) => c.id !== companyId))
    setProcessing(null)
  }

  async function reject(companyId: string) {
    const reason = rejectReason[companyId]?.trim()
    if (!reason) return
    setProcessing(companyId)
    await (supabase as any).from("companies").update({ verification_status: "rejected" }).eq("id", companyId)
    await fetch("/api/admin/verify-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, action: "reject", reason }),
    })
    setCompanies((prev) => prev.filter((c) => c.id !== companyId))
    setShowReject(null)
    setProcessing(null)
  }

  async function getDocUrl(path: string) {
    const { data } = await supabase.storage.from("documents").createSignedUrl(path, 900)
    if (data?.signedUrl) window.open(data.signedUrl, "_blank")
  }

  const TABS: { key: "pending" | "approved" | "rejected"; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Employer Verification</h1>
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
        ) : companies.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            No {filter} verifications.
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <div key={company.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">{company.display_name ?? company.legal_name}</h2>
                    <p className="text-sm text-gray-500">{company.legal_name}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      {company.business_reg_number && <span>Reg # {company.business_reg_number}</span>}
                      {company.city && <span>{company.city}</span>}
                      <span>Submitted {new Date(company.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {company.verification_doc_path && (
                      <Button variant="outline" size="sm" onClick={() => getDocUrl(company.verification_doc_path!)}
                        className="h-8 text-xs flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> Document
                      </Button>
                    )}
                    {filter === "pending" && (
                      <>
                        <Button size="sm" onClick={() => approve(company.id)} disabled={processing === company.id}
                          className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1">
                          {processing === company.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowReject(showReject === company.id ? null : company.id)}
                          className="h-8 text-red-600 border-red-200 hover:bg-red-50 text-xs flex items-center gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {showReject === company.id && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Rejection reason (sent to employer)</label>
                    <textarea
                      value={rejectReason[company.id] ?? ""}
                      onChange={(e) => setRejectReason((prev) => ({ ...prev, [company.id]: e.target.value }))}
                      rows={2} placeholder="e.g. Document unclear, please resubmit with higher quality scan."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:border-blue-400 focus:outline-none"
                    />
                    <Button size="sm" onClick={() => reject(company.id)} disabled={!rejectReason[company.id]?.trim() || processing === company.id}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs">
                      {processing === company.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Rejection"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

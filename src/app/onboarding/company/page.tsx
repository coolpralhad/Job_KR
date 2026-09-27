"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Building2 } from "lucide-react"

const industries = [
  "Manufacturing", "IT & Software", "Agriculture", "Construction",
  "Hospitality", "Healthcare", "Education", "Logistics", "Finance",
  "Retail", "Media", "Real Estate", "Other",
]

const companySizes = [
  "1–10", "11–50", "51–200", "201–500", "500+",
]

const cities = [
  "Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju",
  "Suwon", "Ulsan", "Changwon", "Seongnam", "Other",
]

const ddlCls = "h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"

export default function CompanyOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [legalName, setLegalName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [city, setCity] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")
  const [businessRegNumber, setBusinessRegNumber] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }

    // Check for duplicate business registration number
    if (businessRegNumber) {
      const { data: existing } = await supabase
        .from("companies")
        .select("id")
        .eq("business_reg_number", businessRegNumber)
        .single()
      if (existing) {
        setError("A company with this business registration number is already registered. Contact support if you need access.")
        setLoading(false)
        return
      }
    }

    // Create company
    const { data: company, error: companyErr } = await supabase
      .from("companies")
      .insert({
        legal_name: legalName,
        display_name: displayName || null,
        industry: industry || null,
        size: size || null,
        city: city || null,
        website: website || null,
        description: description || null,
        business_reg_number: businessRegNumber || null,
        verification_status: "pending",
      })
      .select("id")
      .single()

    if (companyErr) { setError(companyErr.message); setLoading(false); return }

    // Link employer profile to company
    await supabase
      .from("employer_profiles")
      .update({ company_id: company.id, job_title: jobTitle || null })
      .eq("id", user.id)

    router.push("/onboarding/verification")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-7 w-7 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set up your company</h1>
          <p className="mt-1 text-sm text-gray-500">This information will be shown to candidates on your job listings.</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Legal company name <span className="text-blue-600">*</span></label>
              <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="As on business registration" required className="h-10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Display name (optional)</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Brand name shown to candidates" className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Industry <span className="text-blue-600">*</span></label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} required className={ddlCls}>
                  <option value="">Select</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Company size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className={ddlCls}>
                  <option value="">Select</option>
                  {companySizes.map((s) => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Primary location <span className="text-blue-600">*</span></label>
                <select value={city} onChange={(e) => setCity(e.target.value)} required className={ddlCls}>
                  <option value="">Select city</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className="h-10" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Business registration number</label>
              <Input value={businessRegNumber} onChange={(e) => setBusinessRegNumber(e.target.value)} placeholder="000-00-00000" className="h-10" />
              <p className="mt-1 text-xs text-gray-400">Used to verify your company. Not shown to candidates.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Company description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of your company (shown to candidates)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Your job title at this company</label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. HR Manager, Recruiter" className="h-10" />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue to Verification →"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

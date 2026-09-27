"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Trash2, Pause, Play, Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

const industries = [
  "Manufacturing", "IT & Software", "Agriculture", "Construction",
  "Hospitality", "Healthcare", "Education", "Logistics",
]

const cities = [
  "Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju",
  "Suwon", "Ulsan", "Changwon", "Seongnam",
]

interface Alert {
  id: string
  criteria: Record<string, string>
  frequency: string
  active: boolean
  created_at: string
}

function alertSummary(criteria: Record<string, string>) {
  const parts = []
  if (criteria.keyword) parts.push(`"${criteria.keyword}"`)
  if (criteria.location) parts.push(`in ${criteria.location}`)
  if (criteria.industry) parts.push(criteria.industry)
  if (criteria.salary_min) parts.push(`above ₩${parseInt(criteria.salary_min) / 10000}만`)
  if (criteria.international === "true") parts.push("international-friendly")
  return parts.length ? parts.join(" · ") : "All jobs"
}

export default function AlertsPage() {
  const supabase = createClient()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  // New alert form
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [industry, setIndustry] = useState("")
  const [salaryMin, setSalaryMin] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [international, setInternational] = useState(false)

  useEffect(() => {
    loadAlerts()
  }, [])

  async function loadAlerts() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("job_alerts")
      .select("*")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false })
    setAlerts((data as Alert[]) ?? [])
    setLoading(false)
  }

  async function saveAlert() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const criteria: Record<string, string> = {}
    if (keyword) criteria.keyword = keyword
    if (location) criteria.location = location
    if (industry) criteria.industry = industry
    if (salaryMin) criteria.salary_min = salaryMin
    if (international) criteria.international = "true"

    await supabase.from("job_alerts").insert({
      candidate_id: user.id,
      criteria,
      frequency: frequency as "immediately" | "daily" | "weekly",
      active: true,
    })

    setKeyword(""); setLocation(""); setIndustry(""); setSalaryMin(""); setInternational(false); setFrequency("daily")
    setCreating(false)
    setSaving(false)
    await loadAlerts()
  }

  async function togglePause(alertId: string, active: boolean) {
    await supabase.from("job_alerts").update({ active: !active }).eq("id", alertId)
    setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, active: !active } : a))
  }

  async function deleteAlert(alertId: string) {
    await supabase.from("job_alerts").delete().eq("id", alertId)
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }

  const { t } = useLang()

  const ddlCls = "h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.alerts.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{t.alerts.subtitle}</p>
          </div>
          <Button onClick={() => setCreating(true)} className="bg-blue-700 hover:bg-blue-800 text-white">
            <Plus className="h-4 w-4 mr-1" /> {t.alerts.newAlert}
          </Button>
        </div>

        {/* Create alert form */}
        {creating && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="mb-4 font-semibold text-blue-900">{t.alerts.form.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t.alerts.form.keyword}</label>
                <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t.alerts.form.keywordPlaceholder} className="h-10" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t.alerts.form.city}</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className={ddlCls}>
                  <option value="">{t.alerts.form.anyCity}</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t.alerts.form.industry}</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={ddlCls}>
                  <option value="">{t.alerts.form.anyIndustry}</option>
                  {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t.alerts.form.minSalary}</label>
                <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder={t.alerts.form.salaryPlaceholder} className="h-10" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{t.alerts.form.frequency}</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={ddlCls}>
                  <option value="immediately">{t.alerts.form.immediate}</option>
                  <option value="daily">{t.alerts.form.daily}</option>
                  <option value="weekly">{t.alerts.form.weekly}</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input type="checkbox" id="intl" checked={international} onChange={(e) => setInternational(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                <label htmlFor="intl" className="text-sm text-gray-700">{t.alerts.form.intlOnly}</label>
              </div>
            </div>

            {(keyword || location || industry) && (
              <div className="mt-3 rounded-lg bg-white p-3 text-sm text-gray-600 border border-gray-200">
                <span className="text-gray-400 mr-1">{t.alerts.form.preview}</span>
                {alertSummary({ keyword, location, industry, salary_min: salaryMin ? (parseInt(salaryMin) * 10000).toString() : "", international: international ? "true" : "" })}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button onClick={saveAlert} disabled={saving} className="bg-blue-700 hover:bg-blue-800 text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t.alerts.form.save}
              </Button>
              <Button variant="outline" onClick={() => setCreating(false)}>{t.alerts.form.cancel}</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
            <Bell className="mb-4 h-10 w-10 text-gray-200" />
            <h3 className="font-semibold text-gray-700">{t.alerts.empty.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{t.alerts.empty.subtitle}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`rounded-xl border bg-white p-4 ${!alert.active ? "opacity-60" : "border-gray-200"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{alertSummary(alert.criteria)}</p>
                    <p className="mt-0.5 text-sm text-gray-500 capitalize">{alert.frequency === "immediately" ? t.alerts.item.immediate : `${alert.frequency.charAt(0).toUpperCase() + alert.frequency.slice(1)} ${t.alerts.item.digest}`}</p>
                    {!alert.active && <span className="mt-1 inline-block text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{t.alerts.item.paused}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePause(alert.id, alert.active)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-700 transition-colors"
                      title={alert.active ? t.alerts.item.pause : t.alerts.item.resume}
                    >
                      {alert.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors"
                      title={t.alerts.item.delete}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

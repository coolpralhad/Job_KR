"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, MapPin, Clock, ChevronRight, Briefcase } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

type Tab = "all" | "applied" | "viewed" | "shortlisted" | "interview" | "offer" | "rejected"

const tabs: { key: Tab }[] = [
  { key: "all" },
  { key: "applied" },
  { key: "viewed" },
  { key: "shortlisted" },
  { key: "interview" },
  { key: "offer" },
  { key: "rejected" },
]

const statusColors: Record<string, string> = {
  applied:     "bg-blue-100 text-blue-700",
  viewed:      "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-purple-100 text-purple-700",
  interview:   "bg-green-100 text-green-700",
  offer:       "bg-emerald-100 text-emerald-700",
  hired:       "bg-teal-100 text-teal-700",
  rejected:    "bg-red-100 text-red-700",
}

type Application = {
  id: string
  status: string
  applied_at: string
  cover_message: string | null
  jobs: {
    id: string; title: string; city: string; job_type: string
    salary_min: number | null; salary_max: number | null
    companies: { display_name: string | null; legal_name: string } | null
  } | null
}

export default function ApplicationsView({
  applications,
  activeTab,
}: {
  applications: Application[] | null
  activeTab: Tab
}) {
  const { t } = useLang()

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t.applicationsPage.title}</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
          {tabs.map((tab) => (
            <Link key={tab.key} href={`/applications?tab=${tab.key}`}>
              <button className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-blue-700 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}>
                {(t.applicationsPage.tabs as Record<string, string>)[tab.key]}
              </button>
            </Link>
          ))}
        </div>

        {!applications || applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
            <Briefcase className="mb-4 h-10 w-10 text-gray-200" />
            <h3 className="font-semibold text-gray-700">{t.applicationsPage.empty.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{t.applicationsPage.empty.subtitle}</p>
            <Link href="/jobs" className="mt-4">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">{t.applicationsPage.empty.btn}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const job = app.jobs
              const companyName = job?.companies?.display_name ?? job?.companies?.legal_name ?? ""
              return (
                <Link key={app.id} href={`/applications/${app.id}`}>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 hover:text-blue-700">{job?.title}</p>
                        <p className="mt-0.5 text-sm text-gray-500">{companyName}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job?.city}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job?.job_type}</span>
                          <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{t.applicationsPage.appliedOn} {formatDate(app.applied_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Users, Star } from "lucide-react"
import { Job, daysAgo } from "@/lib/mock-data"

function formatSalaryLocale(min: number, max: number): string {
  const isKorean = typeof navigator !== "undefined" && navigator.language.startsWith("ko")
  if (isKorean) {
    const fmt = (n: number) => `${(n / 10000).toFixed(0)}만원`
    return `${fmt(min)} – ${fmt(max)}`
  }
  const fmt = (n: number) =>
    "₩" + n.toLocaleString("en-US")
  return `${fmt(min)} – ${fmt(max)}`
}

const visaColors: Record<string, string> = {
  "E-7": "bg-blue-100 text-blue-700",
  "E-9": "bg-green-100 text-green-700",
  "H-2": "bg-yellow-100 text-yellow-700",
  "F-4": "bg-purple-100 text-purple-700",
  "F-6": "bg-pink-100 text-pink-700",
  "D-10": "bg-orange-100 text-orange-700",
}

interface JobCardProps {
  job: Job
  compact?: boolean
}

export default function JobCard({ job, compact = false }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card
        className={`group cursor-pointer border border-gray-200 transition-all hover:border-blue-300 hover:shadow-md ${
          job.featured ? "ring-1 ring-blue-100" : ""
        }`}
      >
        <CardContent className={compact ? "p-4" : "p-5"}>
          <div className="flex items-start justify-between gap-3">
            {/* Company Avatar */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-600 group-hover:bg-blue-50">
              {job.company.logo}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {job.company.name}
                    {job.company.verified && (
                      <Star className="ml-1 inline h-3 w-3 fill-yellow-400 text-yellow-400" />
                    )}
                  </p>
                </div>
                {job.featured && (
                  <Badge className="shrink-0 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Meta row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.jobType}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {job.applicants} applied
                </span>
              </div>

              {/* Visa badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.visaTypes.map((v) => (
                  <span
                    key={v}
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${visaColors[v]}`}
                  >
                    {v}
                  </span>
                ))}
                {job.topikLevel && (
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    TOPIK {job.topikLevel}+
                  </span>
                )}
              </div>

              {/* Salary + posted */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">
                  {formatSalaryLocale(job.salary.min, job.salary.max)}
                  {typeof navigator !== "undefined" && navigator.language.startsWith("ko") ? "/월" : "/mo"}
                </span>
                <span className="text-xs text-gray-400">{daysAgo(job.postedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

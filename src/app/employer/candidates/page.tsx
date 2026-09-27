import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, MapPin, Star } from "lucide-react"

export default async function CandidateSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; location?: string; experience?: string; visa?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  let query = supabase
    .from("candidate_profiles")
    .select(`
      id, full_name, current_title, location, experience_years,
      visa_type, topik_level, skills, languages, available_from
    `)
    .not("career_goals", "is", null)
    .limit(30)

  if (params.location) query = query.ilike("location", `%${params.location}%`)
  if (params.visa) query = query.ilike("visa_type", `%${params.visa}%`)

  const { data: candidates } = await query

  let filtered = candidates ?? []
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (c) => (c.current_title ?? "").toLowerCase().includes(kw) ||
             (c.skills ?? []).some((s: string) => s.toLowerCase().includes(kw))
    )
  }

  const ddlCls = "h-9 appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
          <p className="mt-1 text-sm text-gray-500">Browse international candidates looking for work in Korea.</p>
        </div>

        {/* Filters */}
        <form method="get" className="mb-6 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-4">
          <input
            name="keyword"
            defaultValue={params.keyword}
            placeholder="Skill or job title"
            className="h-9 flex-1 min-w-36 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
          />
          <input
            name="location"
            defaultValue={params.location}
            placeholder="Location in Korea"
            className="h-9 w-40 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
          />
          <select name="visa" defaultValue={params.visa} className={ddlCls}>
            <option value="">Any visa type</option>
            {["E-7", "E-9", "H-2", "F-4", "F-6", "D-10", "F-2", "F-5"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <button type="submit" className="h-9 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800">
            Search
          </button>
          {Object.values(params).some(Boolean) && (
            <Link href="/employer/candidates" className="h-9 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700">
              Clear
            </Link>
          )}
        </form>

        <p className="mb-4 text-sm text-gray-500">{filtered.length} candidate{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
            <Users className="mb-4 h-10 w-10 text-gray-200" />
            <h3 className="font-semibold text-gray-700">No candidates match your search</h3>
            <p className="mt-1 text-sm text-gray-400">Try broadening your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const langs = (c.languages as { lang: string; level: string }[] | null) ?? []
              return (
                <Link key={c.id} href={`/employer/candidates/${c.id}`}>
                  <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {(c.full_name ?? "?").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{c.current_title ?? "Job Seeker"}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          {c.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location.replace("Currently in Korea", "Korea").replace("Outside Korea (planning to move)", "Overseas")}</span>}
                          {c.experience_years !== null && <span>{c.experience_years}yr exp</span>}
                        </div>
                      </div>
                    </div>

                    {langs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {langs.slice(0, 3).map((l, i) => (
                          <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{l.lang}: {l.level}</span>
                        ))}
                      </div>
                    )}

                    {c.skills && c.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(c.skills as string[]).slice(0, 4).map((s: string) => (
                          <span key={s} className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500">{s}</span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs">
                      {c.visa_type && <span className="text-gray-500">{c.visa_type.split(" ")[0]}</span>}
                      {c.available_from && (
                        <span className="text-green-600 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Available {new Date(c.available_from) <= new Date() ? "now" : `from ${new Date(c.available_from).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                        </span>
                      )}
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

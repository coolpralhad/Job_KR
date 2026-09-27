import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft } from "lucide-react"

export default function CandidatesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
        <Link href="/employers" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" /> Back to Employers
        </Link>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4">
          <Users className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Find Candidates</h1>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          Search and filter international candidates by visa type, TOPIK level, and skills. Proactive candidate search coming soon.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
          🚧 Coming Soon
        </div>
        <div className="mt-8">
          <Link href="/auth/register?role=employer">
            <Button className="bg-blue-700 text-white hover:bg-blue-800">Create employer account</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

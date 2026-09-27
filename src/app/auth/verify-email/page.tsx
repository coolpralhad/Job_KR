import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mx-auto">
          <Mail className="h-10 w-10 text-blue-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
        <p className="mt-3 text-gray-500">
          We&apos;ve sent a verification link to your email address. Click the link to activate your account.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <Link href="/auth/register" className="text-blue-700 hover:underline">try again</Link>.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/auth/login" className="text-blue-700 hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}

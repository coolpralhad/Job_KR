"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Search, Eye, EyeOff, Loader2 } from "lucide-react"
import { useLang } from "@/lib/i18n/context"

type Role = "candidate" | "employer"

export default function RegisterPage() {
  const { t } = useLang()
  const router = useRouter()
  const [role, setRole] = useState<Role>("candidate")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPw) { setError(t.auth.register.errors.mismatch); return }
    if (password.length < 8) { setError(t.auth.register.errors.tooShort); return }
    if (!/[A-Z]/.test(password)) { setError(t.auth.register.errors.noUppercase); return }
    if (!/[0-9]/.test(password)) { setError(t.auth.register.errors.noNumber); return }

    setLoading(true)
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    if (data.user) {
      // Insert profile row
      await supabase.from("profiles").insert({ id: data.user.id, role })

      if (role === "candidate") {
        await supabase.from("candidate_profiles").insert({ id: data.user.id, full_name: fullName, onboarding_step: 0 })
      } else {
        await supabase.from("employer_profiles").insert({ id: data.user.id })
      }
    }

    router.push("/auth/verify-email")
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-extrabold text-gray-900">
            JOB<span className="text-blue-700">-KR</span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">{t.auth.register.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t.auth.register.haveAccount}{" "}
            <Link href="/auth/login" className="text-blue-700 hover:underline">{t.auth.register.signIn}</Link>
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Role selector */}
          <div className="mb-5 grid grid-cols-2 gap-2">
            {(["candidate", "employer"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  role === r ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {r === "candidate"
                  ? <Search className={`h-6 w-6 ${role === r ? "text-blue-700" : "text-gray-400"}`} />
                  : <Briefcase className={`h-6 w-6 ${role === r ? "text-blue-700" : "text-gray-400"}`} />}
                <div className="text-center">
                  <p className={`text-sm font-semibold ${role === r ? "text-blue-700" : "text-gray-700"}`}>
                    {r === "candidate" ? t.auth.register.seeker : t.auth.register.employer}
                  </p>
                  <p className="text-xs text-gray-400">{r === "candidate" ? t.auth.register.seekerSub : t.auth.register.employerSub}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleGoogle}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t.auth.register.google}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">{t.auth.register.orEmail}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">{t.auth.register.fullName}</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.auth.register.fullNamePlaceholder} required className="h-10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">{t.auth.register.email}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.auth.register.emailPlaceholder} required className="h-10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">{t.auth.register.password}</label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.register.passwordPlaceholder}
                  required
                  className="h-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">{t.auth.register.confirmPassword}</label>
              <Input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (role === "candidate" ? t.auth.register.createSeeker : t.auth.register.createEmployer)}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            {t.auth.register.terms}{" "}
            <Link href="/terms" className="text-blue-700 hover:underline">{t.auth.register.termsLink}</Link> {t.auth.register.and}{" "}
            <Link href="/privacy" className="text-blue-700 hover:underline">{t.auth.register.privacyLink}</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

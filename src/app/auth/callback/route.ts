import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { Role } from "@/lib/supabase/types"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Ensure profile exists (for OAuth sign-ups)
      const { data: existing } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .single()

      if (!existing) {
        const role = ((data.user.user_metadata?.role as string) ?? "candidate") as Role
        await supabase.from("profiles").insert({ id: data.user.id, role })
        if (role === "candidate") {
          await supabase.from("candidate_profiles").insert({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name ?? null,
            onboarding_step: 0,
          })
        } else {
          await supabase.from("employer_profiles").insert({ id: data.user.id })
        }
        // New OAuth user → go to onboarding
        return NextResponse.redirect(`${origin}/onboarding/1`)
      }

      if (existing.role === "employer") return NextResponse.redirect(`${origin}/employer/dashboard`)
      if (existing.role === "admin") return NextResponse.redirect(`${origin}/admin`)
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`)
}

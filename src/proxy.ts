import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Routes that require authentication
  const candidateRoutes = ["/dashboard", "/applications", "/saved-jobs", "/alerts", "/onboarding"]
  const employerRoutes = ["/employer"]
  const adminRoutes = ["/admin"]

  const isCandidate = candidateRoutes.some((r) => pathname.startsWith(r))
  const isEmployer = employerRoutes.some((r) => pathname.startsWith(r))
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r))
  const isProtected = isCandidate || isEmployer || isAdmin

  if (isProtected && !user) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && (isEmployer || isAdmin)) {
    // Fetch role and enforce access
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (isAdmin && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (isEmployer && profile?.role !== "employer" && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && pathname.startsWith("/auth/") &&
      !pathname.startsWith("/auth/callback") &&
      !pathname.startsWith("/auth/verify")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role === "employer") return NextResponse.redirect(new URL("/employer/dashboard", request.url))
    if (profile?.role === "admin") return NextResponse.redirect(new URL("/admin", request.url))
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

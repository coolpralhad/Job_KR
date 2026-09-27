"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Globe, ChevronDown, Briefcase, User, LayoutDashboard, LogOut, ShieldCheck, Settings } from "lucide-react"

type Props = {
  user: { id: string; email: string } | null
  role: "candidate" | "employer" | "admin" | null
}

const languages = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "ne", label: "नेपाली" },
]

const navLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/visa-guide", label: "Visa Guide" },
]

function dashboardHref(role: string | null) {
  if (role === "employer") return "/employer/dashboard"
  if (role === "admin") return "/admin"
  return "/dashboard"
}

export default function NavbarActions({ user, role }: Props) {
  const [lang, setLang] = useState("en")
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const candidateLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/applications", label: "My Applications", icon: Briefcase },
    { href: "/saved-jobs", label: "Saved Jobs", icon: Briefcase },
    { href: "/alerts", label: "Job Alerts", icon: Briefcase },
  ]

  const employerLinks = [
    { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employer/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/employer/candidates", label: "Find Candidates", icon: User },
    { href: "/employer/pipeline", label: "Pipeline", icon: Briefcase },
  ]

  const adminLinks = [
    { href: "/admin", label: "Admin Dashboard", icon: ShieldCheck },
    { href: "/admin/verification", label: "Verifications", icon: ShieldCheck },
    { href: "/admin/payments", label: "Payments", icon: ShieldCheck },
  ]

  const authLinks = role === "employer" ? employerLinks : role === "admin" ? adminLinks : candidateLinks

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}
            className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
            {link.label}
          </Link>
        ))}
        {role === "employer" && (
          <Link href="/employer/jobs/create" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">
            Post a Job
          </Link>
        )}
      </nav>

      {/* Right side */}
      <div className="hidden items-center gap-3 md:flex">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <Globe className="h-4 w-4" />
            {languages.find((l) => l.code === lang)?.label}
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((l) => (
              <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                {l.label} {lang === l.code && "✓"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-blue-300 transition-colors">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {user.email[0].toUpperCase()}
              </div>
              <span className="max-w-[140px] truncate">{user.email}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5">
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <p className="text-xs font-medium capitalize text-gray-600">{role ?? "user"}</p>
              </div>
              <DropdownMenuSeparator />
              {authLinks.map((link) => (
                <DropdownMenuItem key={link.href} onClick={() => router.push(link.href)} className="flex cursor-pointer items-center gap-2">
                  <link.icon className="h-4 w-4 text-gray-400" />
                  {link.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/account/settings")} className="flex cursor-pointer items-center gap-2">
                <Settings className="h-4 w-4 text-gray-400" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="flex cursor-pointer items-center gap-2 text-red-600">
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-gray-700">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">Get started</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-gray-100 transition-colors">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <div className="flex flex-col gap-6 pt-6">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">JOB<span className="text-blue-700">-KR</span></span>
            </Link>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-base font-medium text-gray-700 hover:text-blue-700" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="flex flex-col gap-2 border-t pt-4">
                <p className="text-xs text-gray-400 truncate mb-1">{user.email}</p>
                {authLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <link.icon className="h-4 w-4 text-gray-400" />
                    {link.label}
                  </Link>
                ))}
                <button onClick={signOut} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 border-t pt-4">
                <div className="mb-2 flex gap-2">
                  {languages.map((l) => (
                    <button key={l.code} onClick={() => setLang(l.code)}
                      className={`rounded px-2 py-1 text-xs font-medium ${lang === l.code ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

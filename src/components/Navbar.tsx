import { createClient } from "@/lib/supabase/server"
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: "candidate" | "employer" | "admin" | null = null
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    role = profile?.role ?? null
  }

  return (
    <NavbarClient
      user={user ? { id: user.id, email: user.email ?? "" } : null}
      role={role}
    />
  )
}

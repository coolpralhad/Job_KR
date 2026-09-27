import { createClient } from "@/lib/supabase/server"
import NavbarClient from "./NavbarClient"

export default async function Navbar() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return <NavbarClient user={null} role={null} />
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role: "candidate" | "employer" | "admin" | null = profile?.role ?? null

    return (
      <NavbarClient
        user={{ id: user.id, email: user.email ?? "" }}
        role={role}
      />
    )
  } catch {
    return <NavbarClient user={null} role={null} />
  }
}

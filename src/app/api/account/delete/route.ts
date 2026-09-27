import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createAdminClient()

  // Delete candidate profile, documents, applications
  await admin.from("applications").delete().eq("candidate_id", user.id)
  await admin.from("saved_jobs").delete().eq("candidate_id", user.id)
  await admin.from("job_alerts").delete().eq("candidate_id", user.id)
  await admin.from("documents").delete().eq("user_id", user.id)
  await admin.from("candidate_profiles").delete().eq("id", user.id)
  await admin.from("employer_profiles").delete().eq("id", user.id)
  await admin.from("profiles").delete().eq("id", user.id)

  // Delete auth user
  await admin.auth.admin.deleteUser(user.id)

  return NextResponse.json({ ok: true })
}

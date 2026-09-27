"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccountSettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? "")
    })
  }, [])

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return }
    setPwLoading(true)
    setError("")
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) setError(err.message)
    else { setSuccess("Password updated successfully"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("") }
    setPwLoading(false)
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone and all your data will be permanently removed."
    )
    if (!confirmed) return
    setLoading(true)
    await fetch("/api/account/delete", { method: "DELETE" })
    await supabase.auth.signOut()
    router.push("/")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Account Settings</h1>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />{success}
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-gray-900">Email Address</h2>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">{email}</p>
            <p className="mt-1 text-xs text-gray-400">To change your email address, contact support.</p>
          </div>
        </div>

        {/* Password */}
        <form onSubmit={updatePassword} className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-gray-900">Change Password</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Confirm new password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
          </div>
          <Button type="submit" disabled={pwLoading || !newPassword || !confirmPassword} className="mt-4 bg-blue-700 hover:bg-blue-800 text-white">
            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </Button>
        </form>

        {/* Danger zone */}
        <div className="rounded-xl border border-red-200 bg-white p-6">
          <h2 className="mb-2 font-semibold text-red-700">Danger Zone</h2>
          <p className="mb-4 text-sm text-gray-500">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="outline" onClick={deleteAccount} disabled={loading}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete account"}
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, Shield, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [profileForm, setProfileForm] = useState({ name: "", avatarUrl: "" })
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileForm.name },
      })
      if (error) throw error
      toast({ title: "Profile updated", description: "Your changes have been saved." })
    } catch (err) {
      console.error("Profile update error:", err)
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" })
      return
    }
    setSavingPassword(true)
    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword })
      if (error) throw error
      setPasswordForm({ newPassword: "", confirmPassword: "" })
      toast({ title: "Password changed", description: "Your password has been updated." })
    } catch (err) {
      console.error("Password change error:", err)
      toast({ title: "Error", description: "Failed to change password.", variant: "destructive" })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and workspace preferences.
        </p>
      </div>

      {/* Profile */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Display Name</Label>
              <Input
                id="settings-name"
                placeholder="Your name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <Button type="submit" size="sm" disabled={savingProfile}>
              {savingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            {theme === "dark" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            Appearance
          </CardTitle>
          <CardDescription>Switch between light and dark mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                theme === "system" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              System
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Security
          </CardTitle>
          <CardDescription>Change your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-new-password">New Password</Label>
              <Input
                id="settings-new-password"
                type="password"
                placeholder="Min. 8 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-confirm-password">Confirm New Password</Label>
              <Input
                id="settings-confirm-password"
                type="password"
                placeholder="Repeat new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <Button type="submit" variant="outline" size="sm" disabled={savingPassword || !passwordForm.newPassword}>
              {savingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Sign out</p>
          <p className="text-xs text-muted-foreground">Sign out of your account on this device.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

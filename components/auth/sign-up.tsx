"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Mail, User, Eye, EyeOff, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Logo } from "@/components/shared/Logo"

export function SignUp() {
  const { signUp, loading } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    const result = await signUp(formData.email, formData.password, formData.name)

    if (result.success) {
      window.location.assign('/auth/verify-email')
    } else {
      toast({
        title: "Registration Error",
        description: result.error || "User already exists or sign up failed.",
        variant: "destructive"
      })
    }
  }

  return (
    <div
      className="login-card bg-white dark:bg-slate-800 rounded-3xl w-full max-w-[1100px] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
      style={{ minHeight: "720px" }}
    >
      {/* ===== LEFT COLUMN: Sign Up Form ===== */}
      <div className="anim-left w-full lg:w-[46%] p-8 sm:p-12 xl:p-14 flex flex-col justify-center">
        {/* Logo */}
        <div className="anim-up flex items-center gap-3 mb-8">
          <Logo className="size-15" />
        </div>

        {/* Header */}
        <div className="anim-up-1 mb-7">
          <h1 className="text-3xl sm:text-[2.1rem] font-extrabold text-slate-900 dark:text-white mb-1.5 tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Join LockIn to boost your team productivity
          </p>
        </div>

        {/* Form Error */}
        {formError && (
          <div className="anim-up-2 mb-5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-sm">
            {formError}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="anim-up-3 space-y-1">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="name">
              Full Name
            </Label>
            <div className="relative">
              <Input
                className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 py-5 px-4 pl-4 pr-10 text-sm"
                id="name"
                name="name"
                placeholder="John Doe"
                type="text"
                disabled={loading}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <User className="size-4" />
              </div>
            </div>
          </div>

          {/* Email Input */}
          <div className="anim-up-4 space-y-1">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              Email
            </Label>
            <div className="relative">
              <Input
                className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 py-5 px-4 pl-4 pr-10 text-sm"
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                disabled={loading}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Mail className="size-4" />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="anim-up-5 space-y-1">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
              Password
            </Label>
            <div className="relative group">
              <Input
                className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 py-5 px-4 pr-10 text-sm"
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="anim-up-6 space-y-1">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <div className="relative group">
              <Input
                className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 py-5 px-4 pr-10 text-sm"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                disabled={loading}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button
            className="anim-up-7 w-full flex justify-center py-6 px-4 rounded-xl shadow-sm text-sm font-bold text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.01]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                CREATING ACCOUNT...
              </>
            ) : (
              "CREATE ACCOUNT"
            )}
          </Button>
        </form>

        {/* Sign In Footer */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?
          <Link
            className="font-bold text-primary hover:text-primary/80 transition-colors ml-1"
            href="/auth/sign-in"
          >
            Sign In
          </Link>
        </p>
      </div>

      {/* ===== RIGHT COLUMN: Decorative Image Panel ===== */}
      <div className="anim-right hidden lg:block w-[54%] p-4 bg-white dark:bg-slate-800">
        <div
          className="h-full w-full relative overflow-hidden"
          style={{ borderRadius: "1.8rem", minHeight: "580px" }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: 'url("/images/BG-Login.png")',
            }}
          ></div>

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(30, 20, 50, 0.65) 0%, rgba(30, 20, 50, 0.15) 40%, rgba(10, 5, 20, 0.75) 100%)",
            }}
          ></div>

          {/* Top text overlay */}
          <div className="absolute top-0 left-0 right-0 p-8">
            <p
              className="text-white/90 text-sm font-semibold text-right leading-relaxed drop-shadow-md"
              style={{ maxWidth: "280px", marginLeft: "auto" }}
            >
              Start your journey today. Manage your projects with precision and ease.
            </p>
          </div>

          {/* Bottom stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="w-12 h-0.5 bg-white/30 rounded-full mb-5"></div>
            <div className="flex gap-8 border-t border-white/20 pt-5">
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-xs text-white/70 mt-0.5">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold">500k+</p>
                <p className="text-xs text-white/70 mt-0.5">Tasks Done</p>
              </div>
              <div>
                <p className="text-2xl font-bold">20k+</p>
                <p className="text-xs text-white/70 mt-0.5">Projects</p>
              </div>
            </div>
          </div>

          {/* Floating location pill */}
          <div className="absolute top-7 left-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            Productivity Hub, Global
          </div>
        </div>
      </div>
    </div>
  )
}
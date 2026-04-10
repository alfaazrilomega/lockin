"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/shared/Logo"

export function SignIn() {
  const searchParams = useSearchParams()
  const { signIn, loading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please enter a valid email address')
      return
    }

    const result = await signIn(formData.email, formData.password)

    if (result.success) {
      window.location.assign(redirectUrl)
    } else {
      setFormError(result.error || 'Sign in failed')
    }
  }

  return (
    <div
      className="login-card bg-white dark:bg-slate-800 rounded-3xl w-full max-w-[1100px] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
      style={{ minHeight: "680px" }}
    >
      {/* ===== LEFT COLUMN: Login Form ===== */}
      <div className="anim-left w-full lg:w-[46%] p-8 sm:p-12 xl:p-14 flex flex-col justify-center">
        {/* Logo */}
        <div className="anim-up flex items-center gap-3 mb-8">
          <Logo className="size-15" />
        </div>

        {/* Header */}
        <div className="anim-up-1 mb-7">
          <h1 className="text-3xl sm:text-[2.1rem] font-extrabold text-slate-900 dark:text-white mb-1.5 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Let&apos;s login to grab amazing productivity
          </p>
        </div>

        {/* Form Error */}
        {formError && (
          <div className="anim-up-2 mb-5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-sm">
            {formError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="anim-up-3 space-y-1.5">
            <Label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="email"
            >
              Email
            </Label>
            <div className="relative">
              <Input
                className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-6 px-4 pl-4 pr-10 text-slate-900 dark:text-white placeholder-slate-400"
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                disabled={loading}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-green-500">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="anim-up-4 space-y-1.5">
            <Label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="password"
            >
              Password
            </Label>
            <div className="relative group">
              <Input
                className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900/50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-6 px-4 pr-10 text-slate-900 dark:text-white placeholder-slate-400"
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
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="anim-up-5 flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <Label
                className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                htmlFor="remember-me"
              >
                Remember me
              </Label>
            </div>
            <div className="text-sm">
              <Link
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                href="/auth/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <Button
            className="anim-up-6 w-full flex justify-center py-6 px-4 rounded-xl shadow-sm text-sm font-bold text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.01]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                SIGNING IN...
              </>
            ) : (
              "LOGIN"
            )}
          </Button>
        </form>

        {/* Sign Up Footer */}
        <p className="anim-up-7 mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?
          <Link
            className="font-bold text-primary hover:text-primary/80 transition-colors ml-1"
            href="/auth/sign-up"
          >
            Sign Up
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
              Organize your workflow, manage projects,<br />and boost your team productivity.
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
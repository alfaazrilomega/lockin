"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"

export function SignIn() {
  const router = useRouter()
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

    // Basic validation
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
      // Hard redirect to bypass Next.js soft-navigation router race conditions on Vercel
      window.location.assign(redirectUrl)
    } else {
      setFormError(result.error || 'Sign in failed')
    }
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your LockIn account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm">
            {formError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-10 pr-10"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="p-0 text-sm text-muted-foreground hover:text-foreground"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Forgot password?
          </Button>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Button
          variant="link"
          className="p-0 text-sm text-primary hover:text-primary/80"
          onClick={() => router.push('/auth/sign-up')}
          disabled={loading}
        >
          Sign up
        </Button>
      </div>
    </div>
  )
}
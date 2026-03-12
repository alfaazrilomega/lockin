"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Mail, AlertCircle } from "lucide-react"

export function ForgotPassword() {
  const router = useRouter()
  const { resetPassword, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Basic validation
    if (!email) {
      setFormError('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address')
      return
    }

    const result = await resetPassword(email)

    if (result.success) {
      setSuccess(true)
    } else {
      setFormError(result.error || 'Failed to send reset email')
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 border border-green-200 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent password reset instructions to {email}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => router.push('/auth/sign-in')}
          >
            Back to Sign In
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSuccess(false)
              setEmail('')
            }}
          >
            Try a different email
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive reset instructions
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset email...
            </>
          ) : (
            'Send Reset Email'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Button
          variant="link"
          className="p-0 text-sm text-primary hover:text-primary/80"
          onClick={() => router.push('/auth/sign-in')}
          disabled={loading}
        >
          Sign in
        </Button>
      </div>
    </div>
  )
}
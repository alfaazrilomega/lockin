"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [resent, setResent] = useState(false)

  const handleResendEmail = () => {
    // TODO: Implement resend verification email logic
    setResent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-background border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 border border-muted rounded-md p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Verification email sent</p>
                <p className="text-muted-foreground">Check your email and click the verification link</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => router.push('/dashboard')}
            >
              Continue to Dashboard
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resent}
            >
              {resent ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Verification email resent
                </>
              ) : (
                'Resend verification email'
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Button
              variant="link"
              className="p-0 text-sm text-primary hover:text-primary/80"
              onClick={() => router.push('/auth/sign-up')}
            >
              try a different email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
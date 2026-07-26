'use client'

import { useActionState, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const initialState = {
  error: null as string | null,
}

function LoginFormContent() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const checkEmailParam = searchParams.get('check_email')
  const confirmedParam = searchParams.get('confirmed')

  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null)

  useEffect(() => {
    if (errorParam) {
      setNotification({
        type: 'error',
        message: errorParam
      })
    } else if (checkEmailParam) {
      setNotification({
        type: 'info',
        message: 'Account created! Please check your email inbox to confirm your registration.'
      })
    } else if (confirmedParam) {
      setNotification({
        type: 'success',
        message: 'Email confirmed successfully! You can now sign in to your dashboard.'
      })
    }
  }, [errorParam, checkEmailParam, confirmedParam])

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    setNotification(null)
    const result = await login(formData)
    return result || { error: null }
  }, initialState)

  return (
    <Card className="w-full font-satoshi">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold font-satoshi">Task Manager</CardTitle>
        <CardDescription className="font-outfit">
          Enter your email and password to access your workspace dashboard.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4 font-satoshi">
          {notification && (
            <div
              className={`p-3 rounded-md text-xs font-semibold ${
                notification.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              {notification.message}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email" className="font-outfit text-xs font-semibold">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="text-xs" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-outfit text-xs font-semibold">Password</Label>
            <Input id="password" name="password" type="password" required className="text-xs" />
          </div>
          {state.error && (
            <div className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded border border-red-100 font-satoshi">
              {state.error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-semibold text-xs text-white" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <div className="text-center text-xs text-muted-foreground font-outfit">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-indigo-600 font-bold">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-gray-400">Loading form...</div>}>
      <LoginFormContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [status, setStatus] = useState('Memproses otentikasi...')

  useEffect(() => {
    const processAuth = async () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')

      // Case 1: PKCE code param in query
      if (code) {
        setStatus('Menukarkan token otentikasi...')
        const res = await fetch(`/api/auth/callback?code=${code}`)
        if (res.ok) {
          router.push('/dashboard')
          return
        }
      }

      // Case 2: Implicit hash fragment (#access_token=...&type=recovery)
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        if (accessToken && refreshToken) {
          setStatus('Mengaktifkan sesi pemulihan...')
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (!error) {
            if (type === 'recovery') {
              router.push('/auth/reset-password')
              return
            } else {
              router.push('/dashboard')
              return
            }
          }
        }
      }

      // Default fallback check session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/auth/sign-in')
      }
    }

    processAuth()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-satoshi">
      <div className="flex flex-col items-center gap-3 p-6">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}

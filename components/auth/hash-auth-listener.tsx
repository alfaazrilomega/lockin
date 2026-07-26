'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase/client'

export function HashAuthListener() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (!hash || !hash.includes('access_token')) return

    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }) => {
        if (!error) {
          // Clear hash from URL cleanly without full page reloads
          window.history.replaceState(null, '', window.location.pathname)

          if (type === 'recovery' || pathname.includes('reset-password')) {
            router.push('/auth/reset-password')
          } else {
            router.push('/dashboard')
          }
        }
      }).catch((err) => {
        console.error('Failed to set Supabase session from hash:', err)
      })
    }
  }, [router, pathname, supabase.auth])

  return null
}

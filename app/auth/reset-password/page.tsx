'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientComponentClient } from '@/lib/supabase/client'
import { Loader2, Lock, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Listen for recovery state or hash fragment on page load
  useEffect(() => {
    const handleRecoverySession = async () => {
      if (typeof window === 'undefined') return
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          window.history.replaceState(null, '', window.location.pathname)
        }
      }
    }
    handleRecoverySession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password) {
      setError('Password baru tidak boleh kosong.')
      return
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.')
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui password.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 font-satoshi">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Password Berhasil Diperbarui!
            </h1>
            <p className="text-sm text-muted-foreground">
              Password akun Anda telah berhasil diubah. Mengarahkan Anda ke Dashboard LockIn...
            </p>
          </div>
          <div className="pt-4 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-satoshi">
      <div className="w-full max-w-md space-y-6 p-8 rounded-xl bg-card border border-border shadow-lg">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set Password Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan password baru untuk akun LockIn Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memperbarui Password...
              </>
            ) : (
              'Simpan Password Baru'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

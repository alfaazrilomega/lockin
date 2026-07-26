'use client'

import { useState } from 'react'
import { inviteWorkspaceMember } from '@/actions/workspace'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { RiUserAddLine, RiLoader4Line, RiAlertLine, RiCheckLine } from '@remixicon/react'

export function InviteMemberModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'owner' | 'member'>('member')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    // TIME-SAVING HACK & SAFETY DEFENSE:
    // Block inviting as 'owner' and trigger required toast message
    if (role === 'owner') {
      const ownerWarningText = 'Mohon maaf saat ini belum bisa menambahkan orang ke mode role owner, mohon maaf'
      setErrorMessage(ownerWarningText)
      toast.error(ownerWarningText)
      return
    }

    try {
      setIsSubmitting(true)
      await inviteWorkspaceMember(email, 'member')
      setSuccessMessage(`Undangan berhasil dikirim ke ${email}!`)
      toast.success(`Undangan berhasil dikirim ke ${email}!`)
      setEmail('')
      setTimeout(() => {
        setIsOpen(false)
        setSuccessMessage(null)
      }, 1500)
    } catch (err: any) {
      const msg = err.message || 'Gagal mengundang anggota.'
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
          <RiUserAddLine className="size-4" /> Undang Anggota
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] bg-white border-gray-200 font-satoshi p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">Undang Anggota Tim</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Error Banner / Toast Fallback */}
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200 font-outfit flex items-start gap-2 animate-fade-in">
              <RiAlertLine className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-200 font-outfit flex items-center gap-2 animate-fade-in">
              <RiCheckLine className="size-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Field 1: Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 font-outfit block">
              Email Anggota *
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: budi@perusahaan.com"
              className="text-xs text-gray-900 font-medium placeholder:text-gray-400 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-200"
            />
          </div>

          {/* Field 2: Role Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 font-outfit block">
              Peran (Role) *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'owner' | 'member')}
              className="w-full h-9 px-3 text-xs text-gray-900 font-medium rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 cursor-pointer font-satoshi"
            >
              <option value="member">Member (Unlimited Access)</option>
              <option value="owner">Owner (Maksimal 2 Peran)</option>
            </select>
            <p className="text-[10px] text-gray-400 font-outfit">
              Member dapat melihat dan mengelola tugas HR. Peran Owner memiliki akses ubah profil workspace.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} className="text-xs border-gray-200">
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              {isSubmitting ? <RiLoader4Line className="size-3.5 animate-spin" /> : 'Kirim Undangan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

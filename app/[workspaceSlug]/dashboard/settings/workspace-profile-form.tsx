'use client'

import { useState } from 'react'
import { updateWorkspaceData } from '@/actions/workspace'
import { Card } from '@/components/tremor/Card'
import { Badge } from '@/components/tremor/Badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { RiRefreshLine, RiCheckLine, RiLoader4Line, RiLockLine } from '@remixicon/react'

interface WorkspaceProfileFormProps {
  initialWorkspace: {
    id: string
    name: string
    slug: string
  }
  userRole?: 'owner' | 'member'
}

export function WorkspaceProfileForm({ initialWorkspace, userRole = 'owner' }: WorkspaceProfileFormProps) {
  const isMember = userRole === 'member'
  const [name, setName] = useState(initialWorkspace.name)
  const [slug, setSlug] = useState(initialWorkspace.slug)
  const [showGenerateButton, setShowGenerateButton] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Generate standard 8-10 char unique random slug (CUID/NanoID style: alphanumeric lowercase)
  const generateUniqueSlug = () => {
    if (isMember) return
    const randomChars = Math.random().toString(36).substring(2, 10)
    const newSlug = `ws-${randomChars}`
    setSlug(newSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isMember) return

    setIsSaving(true)
    setSaveSuccess(false)
    setErrorMsg(null)

    try {
      const res = await updateWorkspaceData(name, slug)
      setSaveSuccess(true)
      setShowGenerateButton(false)

      // Instantly redirect browser to the brand new dynamic URL route
      setTimeout(() => {
        window.location.href = `/${res.slug}/dashboard/settings`
      }, 300)
    } catch (err: any) {
      console.error('Failed to update workspace profile:', err)
      setErrorMsg(err.message || 'Gagal menyimpan perubahan workspace.')
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6 space-y-6 bg-white border-gray-200 font-satoshi">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 font-satoshi">Profil Workspace</h3>
          <p className="text-xs text-gray-500 font-outfit">Informasi dasar dan rute identitas ruang kerja Anda</p>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 font-outfit animate-fade-in">
              <RiCheckLine className="size-4" /> Berhasil Disimpan & Mengalihkan...
            </span>
          )}
          <Badge variant={isMember ? 'neutral' : 'success'}>
            {isMember ? 'Member Access' : 'Owner Access'}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200 font-outfit">
            {errorMsg}
          </div>
        )}

        {/* Field 1: Nama Workspace (Disabled for Member role) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 font-outfit block">
            Nama Workspace
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isMember}
            required
            placeholder="Masukkan Nama Workspace..."
            className="text-xs text-gray-900 font-medium bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-200 font-satoshi disabled:bg-gray-100 disabled:text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Field 2: Slug Workspace (Read-Only + Right Pencil Icon + Generate Button) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 font-outfit block">
              Slug Workspace (Unique ID)
            </label>
            {showGenerateButton && !isMember && (
              <button
                type="button"
                onClick={generateUniqueSlug}
                className="text-xs font-semibold text-black hover:text-indigo-600 transition-colors flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded cursor-pointer font-outfit"
              >
                <RiRefreshLine className="size-3.5 text-black" /> Generate
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              readOnly
              value={slug}
              className="w-full p-2.5 pr-10 text-xs font-mono text-gray-900 bg-gray-50 rounded-md border border-gray-200 focus:outline-none select-all"
            />
            {/* Pencil Icon positioned in the right corner */}
            {!isMember && (
              <button
                type="button"
                onClick={() => setShowGenerateButton(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                title="Edit & Generate Unique Slug"
              >
                <Pencil className="w-4 h-4 text-gray-400 hover:text-gray-700" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-outfit">
            Slug unik ini digunakan sebagai penanda identitas keamanan workspace pada rute URL.
          </p>
        </div>

        {/* Action: Save Button with specific required styling */}
        <div className="pt-2 flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSaving || isMember}
            className="bg-blue-500 text-black hover:bg-black hover:text-white transition-colors duration-200 font-semibold text-xs px-4 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin" /> Menyimpan & Mengalihkan...
              </>
            ) : (
              'Save'
            )}
          </Button>

          {/* Member RBAC Warning Hint */}
          {isMember && (
            <span className="text-xs text-amber-600 font-medium font-outfit flex items-center gap-1">
              <RiLockLine className="size-3.5" /> Hanya Owner yang dapat mengubah profil workspace.
            </span>
          )}
        </div>
      </form>
    </Card>
  )
}

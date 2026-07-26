'use client'

import { useState } from 'react'
import { acceptWorkspaceInvitation, rejectWorkspaceInvitation } from '@/actions/workspace'
import { Button } from '@/components/ui/button'
import { RiCheckLine, RiCloseLine, RiMailUnreadLine, RiLoader4Line } from '@remixicon/react'

export interface PendingInvitationItem {
  id: string
  workspaceName: string
  workspaceSlug: string
  ownerEmail: string
  role: string
  created_at: Date
}

interface PendingInvitationBannerProps {
  invitations: PendingInvitationItem[]
}

export function PendingInvitationBanner({ invitations }: PendingInvitationBannerProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [items, setItems] = useState(invitations)

  if (!items || items.length === 0) return null

  const handleAccept = async (id: string) => {
    try {
      setLoadingId(id)
      const res = await acceptWorkspaceInvitation(id)
      setItems(prev => prev.filter(item => item.id !== id))
      window.location.href = `/${res.workspaceSlug}/dashboard`
    } catch (err: any) {
      alert(err.message || 'Failed to accept invitation')
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setLoadingId(id)
      await rejectWorkspaceInvitation(id)
      setItems(prev => prev.filter(item => item.id !== id))
      window.location.href = '/dashboard'
    } catch (err: any) {
      alert(err.message || 'Failed to decline invitation')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-3 font-satoshi mb-6">
      {items.map((inv) => (
        <div
          key={inv.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-200 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
              <RiMailUnreadLine className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900 font-satoshi">
                  Pending Team Invitation
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase tracking-wider font-outfit">
                  {inv.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5 font-outfit">
                Owner <strong className="text-gray-900 font-satoshi">{inv.ownerEmail}</strong> has invited you to join <strong className="text-indigo-700 font-satoshi">{inv.workspaceName}</strong> (/{inv.workspaceSlug}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={loadingId === inv.id}
              onClick={() => handleReject(inv.id)}
              className="h-8 text-xs gap-1 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
            >
              <RiCloseLine className="size-4" /> Decline (Reject)
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={loadingId === inv.id}
              onClick={() => handleAccept(inv.id)}
              className="h-8 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
            >
              {loadingId === inv.id ? (
                <RiLoader4Line className="size-4 animate-spin" />
              ) : (
                <>
                  <RiCheckLine className="size-4" /> Confirm (Accept)
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

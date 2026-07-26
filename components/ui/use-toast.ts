'use client'

import React from 'react'
import { toast as sonnerToast, Toaster } from 'sonner'

export function useToast() {
  return {
    toast: ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
      if (variant === 'destructive') {
        sonnerToast.error(title || 'Error', { description })
      } else {
        sonnerToast.success(title || 'Success', { description })
      }
    }
  }
}

export function ToastProvider({ children }: { children?: React.ReactNode }) {
  return React.createElement(
    React.Fragment,
    null,
    children,
    React.createElement(Toaster, { position: 'top-right', richColors: true })
  )
}

export const toast = sonnerToast

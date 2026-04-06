"use client"

import * as React from "react"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "./toast"
import { cn } from "@/lib/utils"

type ToastType = "default" | "destructive"

interface ToastItem {
  id: string
  title?: string
  description?: string
  variant: ToastType
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: (params: { title: string; description?: string; variant?: ToastType }) => void
  dismiss: (id: string) => void}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback(({ title, description, variant = "default" }: { title: string; description?: string; variant?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, title, description, variant }])

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant}>
            <div className="flex-1">
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
            <ToastClose onClick={() => dismiss(t.id)} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

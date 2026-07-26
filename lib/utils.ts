import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cx = cn

export function formatDate(date: Date | string | number) {
  return format(new Date(date), "MMM d, yyyy")
}

export function formatDateTime(date: Date | string | number) {
  return format(new Date(date), "MMM d, h:mm a")
}

export function getAppUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/$/, '')
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL.trim()
    return (url.startsWith('http') ? url : `https://${url}`).replace(/\/$/, '')
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL.trim()
    return (url.startsWith('http') ? url : `https://${url}`).replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}

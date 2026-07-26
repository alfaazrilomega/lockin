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

import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 font-satoshi animate-pulse p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-md" />
          <div className="h-4 w-72 bg-muted/60 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded-md" />
          <div className="h-9 w-32 bg-primary/20 rounded-md" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded-full" />
            </div>
            <div className="h-8 w-16 bg-muted/80 rounded" />
            <div className="h-3 w-28 bg-muted/50 rounded" />
          </div>
        ))}
      </div>

      {/* Main Board / Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm min-h-[350px]">
          <div className="flex justify-between items-center">
            <div className="h-6 w-36 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted/60 rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-muted/40 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm min-h-[350px]">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-muted/40 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

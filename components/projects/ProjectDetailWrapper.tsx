"use client"

import dynamic from "next/dynamic"

export const ProjectDetailWrapper = dynamic(
  () => import("@/components/projects/ProjectDetailClientViewer").then(m => ({ default: m.ProjectDetailClientViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-8 animate-pulse px-6 py-8">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-10 bg-muted rounded w-72" />
        <div className="flex gap-4 mt-6 min-h-[500px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 min-w-[260px] max-w-[310px] rounded-xl bg-muted/30 border border-border" />
          ))}
        </div>
      </div>
    )
  }
)

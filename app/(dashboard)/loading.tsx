import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 bg-border" />
        <Skeleton className="h-4 w-40 bg-border" />
      </div>

      {/* Statistics Cards Skeleton - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-background border border-border shadow-sm rounded-xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 bg-border" />
                <Skeleton className="h-6 w-6 rounded-full bg-border" />
              </div>
              <Skeleton className="h-8 w-16 bg-border" />
              <Skeleton className="h-3 w-20 bg-border" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton - Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Projects Skeleton */}
        <Card className="bg-background border border-border shadow-sm rounded-xl">
          <div className="p-6">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-border" />
                <Skeleton className="h-4 w-40 bg-border" />
              </div>
              
              {/* Project Cards Skeleton */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48 bg-border" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full bg-border" />
                          <Skeleton className="h-3 w-24 bg-border" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full bg-border" />
                          <Skeleton className="h-3 w-20 bg-border" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16 bg-border" />
                      <Skeleton className="h-3 w-12 bg-border" />
                    </div>
                    <Skeleton className="h-2 w-full bg-border" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16 bg-border" />
                      <Skeleton className="h-3 w-24 bg-border" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Column: My Tasks Skeleton */}
        <Card className="bg-background border border-border shadow-sm rounded-xl">
          <div className="p-6">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 bg-border" />
                <Skeleton className="h-4 w-16 bg-border" />
              </div>
              
              {/* Task Items Skeleton */}
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Skeleton className="h-4 w-4 rounded border-border" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16 bg-border" />
                      <Skeleton className="h-4 w-32 bg-border" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-border" />
                        <Skeleton className="h-3 w-16 bg-border" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-border" />
                        <Skeleton className="h-3 w-16 bg-border" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
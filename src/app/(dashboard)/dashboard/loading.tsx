import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px] max-w-full" />
        <Skeleton className="h-5 w-[250px] max-w-full" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="neo-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-[140px] mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Recent Courses Skeleton */}
        <Card className="neo-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-6 w-[200px]" />
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border-2 border-border/50">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-8 w-[60px] rounded-md" />
              </div>
            ))}
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>

        {/* Behavior Profile Skeleton */}
        <div className="space-y-6">
          <Card className="neo-card border-4">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-6 w-[80px] rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[84px] w-full rounded-lg" />
                ))}
              </div>
              
              <div className="space-y-3 mt-6">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

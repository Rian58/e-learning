import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-10 w-[300px] max-w-full" />
        <Skeleton className="h-5 w-[250px] max-w-full mt-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="neo-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-4 w-[120px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="neo-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-10 w-full sm:w-[250px]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="w-full border-b border-border/50 bg-muted/20 p-4 flex gap-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4 hidden sm:block" />
              <Skeleton className="h-5 w-1/4 hidden md:block" />
              <Skeleton className="h-5 w-1/4 hidden lg:block" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-full border-b border-border/50 p-4 flex gap-4 items-center">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4 hidden sm:block" />
                <Skeleton className="h-5 w-1/4 hidden md:block" />
                <Skeleton className="h-8 w-[80px] hidden lg:block rounded-full" />
                <Skeleton className="h-8 w-[80px] rounded-md" />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border/50 flex justify-between items-center">
            <Skeleton className="h-5 w-[150px]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

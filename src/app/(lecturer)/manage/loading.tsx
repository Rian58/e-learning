import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LecturerDashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Manajemen Mata Kuliah
          </h1>
          <Skeleton className="h-5 w-[300px] max-w-full mt-2" />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Skeleton className="h-10 w-full sm:w-[250px]" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="neo-card">
            <CardContent className="pt-6">
              <Skeleton className="h-10 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="neo-card">
            <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-3 flex-grow w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-5 w-[60px] rounded-full" />
                </div>
                <Skeleton className="h-4 w-[90%]" />
                <div className="flex flex-wrap gap-3 pt-1">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-10 w-full sm:w-[100px] shrink-0 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

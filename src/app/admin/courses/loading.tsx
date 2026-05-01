import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminCoursesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-[300px] max-w-full" />
          <Skeleton className="h-5 w-[250px] max-w-full mt-2" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[300px]" />
      </div>

      <Card className="neo-card">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="w-full border-b border-border/50 bg-muted/20 p-4 flex gap-4">
              <Skeleton className="h-5 w-[40%]" />
              <Skeleton className="h-5 w-[20%] hidden sm:block" />
              <Skeleton className="h-5 w-[20%] hidden md:block" />
              <Skeleton className="h-5 w-[20%]" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-full border-b border-border/50 p-4 flex gap-4 items-center">
                <div className="w-[40%] space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-[70%]" />
                </div>
                <Skeleton className="h-5 w-[20%] hidden sm:block" />
                <Skeleton className="h-5 w-[20%] hidden md:block" />
                <Skeleton className="h-8 w-[80px] rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

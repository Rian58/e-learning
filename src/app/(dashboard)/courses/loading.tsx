import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function CoursesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Katalog Mata Kuliah
          </h1>
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[250px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="neo-card flex flex-col overflow-hidden">
            <div className="h-48 w-full bg-muted/50 border-b-2 border-border/50 animate-pulse" />
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-5 w-[80px] rounded-full" />
                <Skeleton className="h-5 w-[100px] rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t-2 border-border/50 p-4">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

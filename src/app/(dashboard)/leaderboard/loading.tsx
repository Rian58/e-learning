import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function LeaderboardLoading() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-500">
      <div className="bg-primary/5 border-4 neo-border p-6 md:p-8 rounded-3xl neo-shadow relative overflow-hidden">
        <div className="absolute -top-8 -right-8 opacity-10">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-3">
          <Skeleton className="h-10 w-[250px] max-w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="neo-card border-3">
            <CardContent className="flex items-center gap-4 py-4 px-4 md:px-6">
              <Skeleton className="flex-shrink-0 w-10 h-10 rounded-xl" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-[150px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-[60px]" />
                  <Skeleton className="h-3 w-[60px]" />
                  <Skeleton className="h-3 w-[60px]" />
                </div>
              </div>

              <div className="text-right flex-shrink-0 space-y-1">
                <Skeleton className="h-8 w-[50px] ml-auto" />
                <Skeleton className="h-3 w-[30px] ml-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

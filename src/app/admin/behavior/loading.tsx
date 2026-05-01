import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function AdminBehaviorLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" /> Analitik AI
          </h1>
          <Skeleton className="h-5 w-[250px] max-w-full mt-2" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[200px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="neo-card border-4">
            <CardContent className="pt-6 text-center space-y-3 flex flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-10 w-[60px]" />
              <Skeleton className="h-4 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="neo-card">
        <CardHeader>
          <Skeleton className="h-6 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border neo-border overflow-hidden">
            <div className="w-full border-b border-border/50 bg-muted/20 p-4 flex justify-between">
              <Skeleton className="h-5 w-[20%]" />
              <Skeleton className="h-5 w-[20%]" />
              <Skeleton className="h-5 w-[15%]" />
              <Skeleton className="h-5 w-[15%]" />
              <Skeleton className="h-5 w-[15%]" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full border-b border-border/50 p-4 flex justify-between items-center">
                <Skeleton className="h-5 w-[20%]" />
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-6 w-[10%] rounded-full" />
                <Skeleton className="h-5 w-[10%]" />
                <Skeleton className="h-5 w-[10%]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

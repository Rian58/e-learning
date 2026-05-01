import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function LecturerStudentsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Progres Mahasiswa
        </h1>
        <Skeleton className="h-5 w-[350px] max-w-full mt-2" />
      </div>

      <Card className="neo-card">
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border neo-border overflow-hidden">
            <div className="w-full border-b border-border/50 bg-muted/20 p-4 flex gap-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/3" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full border-b border-border/50 p-4 flex gap-4 items-center">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="w-1/3 flex flex-wrap gap-1">
                  <Skeleton className="h-6 w-[80px] rounded-full" />
                  <Skeleton className="h-6 w-[100px] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

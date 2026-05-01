import { Skeleton } from "@/components/ui/skeleton";
import { KeyRound } from "lucide-react";

export default function EnrollLoading() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="bg-primary/5 border-4 neo-border p-8 rounded-3xl relative overflow-hidden mb-8 neo-shadow">
        <div className="absolute -top-12 -right-12 text-primary opacity-20">
          <KeyRound className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-[80%] space-y-4">
          <Skeleton className="h-10 w-[250px] max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>

      <div className="bg-background border-4 neo-border p-6 rounded-3xl neo-shadow-sm space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      <div className="mt-12 space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 p-4 rounded-xl border-2 neo-border flex justify-between items-center">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-6 w-[100px] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Pengaturan Profil
        </h1>
        <Skeleton className="h-4 w-[300px] mt-2" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <div className="flex flex-col items-center p-6 bg-accent/50 rounded-xl neo-border border-2 text-center">
            <Skeleton className="w-24 h-24 rounded-full border-2 neo-border mb-4" />
            <Skeleton className="h-6 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[160px] mb-4" />
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </div>
          
          <div className="p-4 bg-primary/5 rounded-xl neo-border border-2 space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 bg-background border-4 neo-border p-6 rounded-3xl">
          <Skeleton className="h-6 w-[150px] mb-6" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            
            <Skeleton className="h-12 w-[150px] rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

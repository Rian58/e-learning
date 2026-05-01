import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthLoading() {
  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
      <Card className="neo-card bg-card/90 backdrop-blur-sm shadow-xl border-[3px]">
        <CardHeader className="space-y-4 pb-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl mt-6" />
          
          <div className="flex items-center justify-center pt-4">
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

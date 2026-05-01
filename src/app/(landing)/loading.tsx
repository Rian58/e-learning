import { Skeleton } from "@/components/ui/skeleton";

export default function LandingLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-32 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge Skeleton */}
            <Skeleton className="h-8 w-[200px] rounded-full" />
            
            {/* Title Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-16 md:h-20 w-[90%]" />
              <Skeleton className="h-16 md:h-20 w-[70%]" />
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[85%]" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Skeleton className="h-14 w-full sm:w-[200px] rounded-xl" />
              <Skeleton className="h-14 w-full sm:w-[200px] rounded-xl" />
            </div>

            {/* Users Avatar Group Skeleton */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-full border-4 border-background" />
                ))}
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
          </div>
          
          {/* Right Image/Hero UI Skeleton */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <Skeleton className="aspect-square w-full rounded-full" />
            <Skeleton className="absolute top-1/4 -left-8 h-20 w-48 rounded-xl" />
            <Skeleton className="absolute bottom-1/4 -right-8 h-24 w-56 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

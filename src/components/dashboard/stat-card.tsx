import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  trend,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden neo-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-bold text-muted-foreground">{title}</p>
            <p className="text-3xl font-black text-foreground">{value}</p>
          </div>
          <div className="rounded-full bg-primary/20 p-3 neo-border">
            <Icon className="h-6 w-6 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        
        {(description || trend) && (
          <div className="mt-4 flex items-center space-x-2 text-sm">
            {trend && (
              <span
                className={cn(
                  "font-bold",
                  trend.value > 0 ? "text-emerald-500" : "text-destructive"
                )}
              >
                {trend.value > 0 ? "+" : ""}{trend.value}%
              </span>
            )}
            <span className="text-muted-foreground font-medium">
              {trend ? trend.label : description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

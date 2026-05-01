import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 neo-shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground bg-background",
        active: "border-transparent text-white font-bold tracking-wider",
        passive: "border-transparent text-white font-bold tracking-wider",
        procrastinator: "border-transparent text-white font-bold tracking-wider",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        badgeVariants({ variant }), 
        variant === 'active' && 'bg-[var(--cluster-active)]',
        variant === 'passive' && 'bg-[var(--cluster-passive)]',
        variant === 'procrastinator' && 'bg-[var(--cluster-procrastinator)]',
        className
      )} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }

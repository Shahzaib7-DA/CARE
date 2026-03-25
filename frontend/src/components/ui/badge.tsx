import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
      success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      destructive: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      secondary: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    }

    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }

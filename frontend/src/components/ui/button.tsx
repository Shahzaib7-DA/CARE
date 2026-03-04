import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      default:
        'bg-medical-blue text-white hover:bg-medical-blue/90 focus-visible:ring-medical-blue dark:bg-medical-blue dark:text-white dark:hover:bg-medical-blue/80',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-slate-600',
      destructive:
        'bg-risk-red text-white hover:bg-risk-red/90 focus-visible:ring-risk-red dark:bg-risk-red dark:hover:bg-risk-red/80',
      ghost:
        'hover:bg-slate-100 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-700',
      outline:
        'border border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

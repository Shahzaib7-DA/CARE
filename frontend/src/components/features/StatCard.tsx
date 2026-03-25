import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { useCountUp } from '@/hooks/useUI'

interface StatCardProps {
  label: string
  value: number | string
  icon: ReactNode
  variant?: 'default' | 'warning' | 'critical' | 'success'
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  isLoading?: boolean
}

export function StatCard({
  label,
  value,
  icon,
  variant = 'default',
  trend,
  trendValue,
  isLoading = false,
}: StatCardProps) {
  const animatedValue = useCountUp(typeof value === 'number' ? value : 0, 800)

  // Improved deep shadow gradients for SaaS depth
  const getVariantStyles = () => {
    switch (variant) {
      case 'critical':
        return {
          wrapper: 'border-danger/30 bg-gradient-to-br from-white/90 to-red-50/50 dark:border-danger/20 dark:from-slate-800/90 dark:to-red-950/20 shadow-[0_8px_30px_rgba(239,68,68,0.12)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)]',
          iconBg: 'bg-red-100 dark:bg-red-900/40 text-danger',
          glow: 'bg-danger/20',
        }
      case 'warning':
        return {
          wrapper: 'border-warning/30 bg-gradient-to-br from-white/90 to-amber-50/50 dark:border-warning/20 dark:from-slate-800/90 dark:to-amber-950/20 shadow-[0_8px_30px_rgba(245,158,11,0.12)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.2)]',
          iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-warning',
          glow: 'bg-warning/20',
        }
      case 'success':
        return {
          wrapper: 'border-success/30 bg-gradient-to-br from-white/90 to-green-50/50 dark:border-success/20 dark:from-slate-800/90 dark:to-green-950/20 shadow-[0_8px_30px_rgba(34,197,94,0.12)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.2)]',
          iconBg: 'bg-green-100 dark:bg-green-900/40 text-success',
          glow: 'bg-success/20',
        }
      default:
        return {
          wrapper: 'border-slate-200/60 bg-gradient-to-br from-white/90 to-slate-50/50 dark:border-slate-700/50 dark:from-slate-800/90 dark:to-slate-900/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]',
          iconBg: 'bg-blue-50 dark:bg-blue-900/40 text-medical-blue dark:text-blue-400',
          glow: 'bg-medical-blue/10',
        }
    }
  }

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full rounded-2xl backdrop-blur-md transition-shadow duration-300 border ${styles.wrapper}`}
    >
      <Card className="bg-transparent border-0 shadow-none">
        <CardContent className="p-6 relative overflow-hidden h-full flex flex-col justify-center">
          {/* Subtle decorative glow in top right */}
          <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-60 blur-3xl pointer-events-none ${styles.glow}`}></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                {label}
              </p>

              <motion.div
                className="mt-3 text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {isLoading ? (
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24" />
                ) : typeof value === 'string' ? (
                  <span className="flex items-baseline gap-1">
                    {value.includes(' ') ? (
                      <>
                        <span>{value.split(' ')[0]}</span>
                        <span className="text-lg font-medium text-slate-500 dark:text-slate-400">{value.substring(value.indexOf(' ') + 1)}</span>
                      </>
                    ) : (
                      value
                    )}
                  </span>
                ) : (
                  animatedValue
                )}
              </motion.div>

              {trend && trendValue && (
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                  {trend === 'up' ? (
                    <span className="text-danger flex items-center justify-center gap-1 bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-800/40 shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{trendValue}%
                    </span>
                  ) : trend === 'down' ? (
                    <span className="text-success flex items-center justify-center gap-1 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800/40 shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                      -{trendValue}%
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                      Stable
                    </span>
                  )}
                </div>
              )}
            </div>

            <motion.div
              animate={variant === 'critical' ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
              transition={
                variant === 'critical' ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}
              }
              className={`p-3.5 rounded-2xl ${styles.iconBg} shadow-inner flex shrink-0 items-center justify-center`}
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { useCountUp } from '@/hooks/useUI'

interface StatCardProps {
  label: string
  value: number
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
  const animatedValue = useCountUp(value, 800)

  const getVariantColor = () => {
    switch (variant) {
      case 'critical':
        return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/30'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/30'
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/30'
      default:
        return 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case 'critical':
        return 'text-risk-red'
      case 'warning':
        return 'text-risk-yellow'
      case 'success':
        return 'text-risk-green'
      default:
        return 'text-medical-blue'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`${getVariantColor()} ${
          variant === 'critical' ? 'border-2' : ''
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {label}
              </p>
              <motion.div
                className="mt-2 text-3xl font-bold text-slate-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isLoading ? (
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20" />
                ) : (
                  animatedValue
                )}
              </motion.div>

              {trend && trendValue && (
                <div className="mt-2 flex items-center gap-1 text-xs font-medium">
                  {trend === 'up' ? (
                    <span className="text-risk-red flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +{trendValue}%
                    </span>
                  ) : trend === 'down' ? (
                    <span className="text-risk-green flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3 rotate-180" />
                      -{trendValue}%
                    </span>
                  ) : (
                    <span className="text-slate-500">Stable</span>
                  )}
                </div>
              )}
            </div>

            <motion.div
              animate={variant === 'critical' ? { scale: [1, 1.1, 1] } : {}}
              transition={
                variant === 'critical' ? { duration: 2, repeat: Infinity } : {}
              }
              className={`${getIconColor()} opacity-80`}
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

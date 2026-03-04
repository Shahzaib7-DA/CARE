import { motion } from 'framer-motion'
import { RiskLevel } from '@/types'
import { getRiskBadgeColor, getRiskTextColor } from '@/lib/utils'
import { AlertCircle, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface RiskBadgeProps {
  level: RiskLevel
  score: number
  animated?: boolean
}

export function RiskBadge({ level, score, animated = true }: RiskBadgeProps) {
  const isCritical = level === 'RED'

  return (
    <motion.div
      initial={animated ? { scale: 0.8, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      whileHover={animated ? { scale: 1.05 } : {}}
      className={`relative inline-block ${isCritical ? 'animate-risk-pulse' : ''}`}
    >
      <Badge className={getRiskBadgeColor(level)}>
        <div className="flex items-center gap-2">
          {isCritical && <AlertCircle className="w-3 h-3" />}
          <span className="font-semibold">{level}</span>
          <span className="opacity-75">{(score * 100).toFixed(0)}%</span>
        </div>
      </Badge>
    </motion.div>
  )
}

interface RiskIndicatorProps {
  level: RiskLevel
  score: number
  showTrend?: boolean
  trendDirection?: 'up' | 'down' | 'stable'
}

export function RiskIndicator({
  level,
  score,
  showTrend = false,
  trendDirection,
}: RiskIndicatorProps) {
  const getIndicatorColor = () => {
    switch (level) {
      case 'RED':
        return 'bg-risk-red'
      case 'YELLOW':
        return 'bg-risk-yellow'
      case 'GREEN':
        return 'bg-risk-green'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={level === 'RED' ? { scale: [1, 1.2, 1] } : {}}
        transition={level === 'RED' ? { duration: 2, repeat: Infinity } : {}}
        className={`w-4 h-4 rounded-full ${getIndicatorColor()}`}
      />
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {level}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300">
          {(score * 100).toFixed(0)}% risk
        </div>
      </div>
      {showTrend && trendDirection && (
        <TrendingUp
          className={`w-4 h-4 ${
            trendDirection === 'up' ? 'text-risk-red' : 'text-risk-green'
          }`}
        />
      )}
    </div>
  )
}

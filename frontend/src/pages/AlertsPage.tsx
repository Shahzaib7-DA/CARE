import { useState } from 'react'
import { usePatientStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { RiskBadge } from '@/components/features/RiskBadge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTimeAgo } from '@/lib/utils'

export function AlertsPage() {
  const alerts = usePatientStore((s) => s.alerts)
  const acknowledgeAlert = usePatientStore((s) => s.acknowledgeAlert)
  const [filter, setFilter] = useState<'all' | 'critical' | 'unacknowledged'>('all')

  const filtered = alerts.filter((alert) => {
    if (filter === 'critical') return alert.risk_level === 'RED'
    if (filter === 'unacknowledged') return !alert.acknowledged
    return true
  })

  const sortedAlerts = [...filtered].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Alerts & Notifications</h1>
        <p className="text-slate-500 mt-2">
          Clinical alerts and high-risk escalations
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(['all', 'critical', 'unacknowledged'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-medical-blue text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {filterType === 'all' && `All (${alerts.length})`}
            {filterType === 'critical' && `Critical (${alerts.filter(a => a.risk_level === 'RED').length})`}
            {filterType === 'unacknowledged' && `Unacknowledged (${alerts.filter(a => !a.acknowledged).length})`}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        <AnimatePresence>
          {sortedAlerts.length > 0 ? (
            sortedAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`overflow-hidden border-l-4 ${
                    alert.risk_level === 'RED'
                      ? 'border-l-risk-red bg-red-50'
                      : alert.risk_level === 'YELLOW'
                      ? 'border-l-risk-yellow bg-yellow-50'
                      : 'border-l-risk-green'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-risk-red" />
                          <h3 className="font-semibold text-slate-900">
                            {alert.patient_name}
                          </h3>
                          <RiskBadge
                            level={alert.risk_level}
                            score={alert.risk_level === 'RED' ? 0.85 : 0.45}
                            animated={!alert.acknowledged}
                          />
                        </div>
                        <p className="text-sm text-slate-700 mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>ID: {alert.patient_id}</span>
                          <span>{getTimeAgo(alert.timestamp)}</span>
                          {alert.acknowledged && (
                            <span className="flex items-center gap-1 text-risk-green">
                              <Check className="w-3 h-3" />
                              Acknowledged
                            </span>
                          )}
                        </div>
                      </div>

                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="ml-4 flex-shrink-0"
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-12 text-center">
                <div className="text-risk-green text-4xl mb-2">✓</div>
                <p className="font-semibold text-slate-900">No alerts</p>
                <p className="text-slate-500 text-sm">All patients within safe parameters</p>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

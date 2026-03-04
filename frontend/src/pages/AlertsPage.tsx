import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientStore } from '@/store'
import { usePatients } from '@/hooks/useApi'
import { Card, CardContent } from '@/components/ui/card'
import { RiskBadge } from '@/components/features/RiskBadge'
import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTimeAgo } from '@/lib/utils'

export function AlertsPage() {
  const navigate = useNavigate()
  const alerts = usePatientStore((s) => s.alerts)
  const resolvedPatientIds = usePatientStore((s) => s.resolvedPatientIds)
  const markPatientResolved = usePatientStore((s) => s.markPatientResolved)
  const { data: patients = [] } = usePatients()
  const [filter, setFilter] = useState<'all' | 'critical' | 'unacknowledged'>('all')
  
  // Get high-risk patients (RED and YELLOW) that are not resolved
  const highRiskPatients = patients.filter(
    (p) =>
      (p.risk_level === 'RED' || p.risk_level === 'YELLOW') &&
      !resolvedPatientIds.includes(p.patient_id)
  )

  const criticalCount = alerts.filter((a) => a.risk_level === 'RED').length

  const filtered = alerts.filter((alert) => {
    if (filter === 'critical') return alert.risk_level === 'RED'
    if (filter === 'unacknowledged') return true
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Alerts & Notifications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Clinical alerts and high-risk escalations
        </p>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-x-3">
          <span className="font-semibold">All: {alerts.length}</span>
          <span>Critical: {criticalCount}</span>
          <span>Unacknowledged: {alerts.length}</span>
        </div>
      </div>

      {/* High-Risk Patients Section */}
      {highRiskPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {highRiskPatients.map((patient) => {
            const isRed = patient.risk_level === 'RED'
            return (
            <Card
              key={patient.patient_id}
              className={`border-l-4 bg-gradient-to-br
                ${
                  isRed
                    ? 'border-l-risk-red from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 dark:border-red-800'
                    : 'border-l-risk-yellow from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 dark:border-yellow-800'
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${isRed ? 'text-risk-red' : 'text-risk-yellow'}`} />
                    <h3 className="font-bold text-slate-900 dark:text-white">{patient.name}</h3>
                  </div>
                  <RiskBadge level={patient.risk_level} score={patient.sepsis_risk} animated={true} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">ID: {patient.patient_id}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Bed: {patient.bed_number}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/50 dark:bg-slate-700/50 p-2 rounded">
                    <p className="text-slate-500 dark:text-slate-400">HR</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{patient.vitals.HR}</p>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-700/50 p-2 rounded">
                    <p className="text-slate-500 dark:text-slate-400">O2</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{patient.vitals.O2Sat}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </motion.div>
      )}

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(['all', 'critical', 'unacknowledged'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-gradient-to-r from-medical-blue to-blue-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {filterType === 'all' && `All (${alerts.length})`}
            {filterType === 'critical' && `Critical (${criticalCount})`}
            {filterType === 'unacknowledged' && `Unacknowledged (${alerts.length})`}
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
                      ? 'border-l-risk-red bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/20 dark:border-red-800'
                      : alert.risk_level === 'YELLOW'
                      ? 'border-l-risk-yellow bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20 dark:border-yellow-800'
                      : 'border-l-risk-green bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 dark:border-green-800'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-risk-red" />
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {alert.patient_name}
                          </h3>
                          <RiskBadge
                            level={alert.risk_level}
                            score={alert.risk_level === 'RED' ? 0.85 : 0.45}
                            animated={true}
                          />
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span>ID: {alert.patient_id}</span>
                          <span>{getTimeAgo(alert.timestamp)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/dashboard/patients/${alert.patient_id}`)
                          }
                        >
                          View patient
                        </Button>
                        {!resolvedPatientIds.includes(alert.patient_id) && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => markPatientResolved(alert.patient_id)}
                          >
                            Treated
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : highRiskPatients.length === 0 ? (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-12 text-center">
                <div className="text-risk-green text-4xl mb-2">✓</div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  No alerts
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  All patients within safe parameters
                </p>
              </CardContent>
            </Card>
          ) : null}
        </AnimatePresence>
      </div>

    </motion.div>
  )
}

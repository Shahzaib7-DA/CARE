import { useNavigate } from 'react-router-dom'
import { usePatientContext, Patient } from '@/context/PatientContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CheckCircle, Clock } from 'lucide-react'
import { getTimeAgo } from '@/lib/utils'
import { useLiveTimer } from '@/hooks/useLiveTimer'

function AlertCard({ patient, onTreat, onView }: { patient: Patient; onTreat: () => void; onView: () => void }) {
  const { formattedTime } = useLiveTimer(patient.alertStartTime)

  return (
    <Card
      className={`border rounded-xl transition-shadow hover:shadow-md ${patient.riskLevel === 'HIGH'
        ? 'border-l-4 border-l-red-500'
        : 'border-l-4 border-l-yellow-500'
        }`}
    >
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {patient.name}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Risk Level: {patient.riskLevel}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Risk Score: {patient.riskScore}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
            <Clock className="w-3.5 h-3.5" />
            Alert triggered: {getTimeAgo(patient.last_updated)}
          </p>
          {patient.alertStartTime && (
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
              Response timer: {formattedTime}
            </p>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={onView}
          >
            View Details
          </Button>
          <button
            onClick={onTreat}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            ✓ Treated
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export function AlertsPage() {
  const navigate = useNavigate()
  const { patients, markPatientTreated } = usePatientContext()

  // alerts page only shows genuinely active patients that are not low risk (excludes recovering/stable)
  // Sort HIGH risk first, then MEDIUM, then newest
  const activePatients = patients
    .filter((p) => p.status === 'active' && p.riskLevel !== 'LOW')
    .sort((a, b) => {
      // 1. Sort by Risk Level priority
      const riskPriority = { HIGH: 2, MEDIUM: 1, LOW: 0 }
      const riskDiff = riskPriority[b.riskLevel] - riskPriority[a.riskLevel]
      if (riskDiff !== 0) return riskDiff

      // 2. Fallback: Sort by freshest prediction time
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
    })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Alerts
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Patients currently active and awaiting treatment
        </p>
      </div>

      {activePatients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
        >
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No active alerts</h3>
          <p className="text-slate-500 dark:text-slate-400">All monitored patients are stable.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePatients.map((patient) => (
            <AlertCard
              key={patient.id}
              patient={patient}
              onView={() => navigate(`/dashboard/patients/${patient.id}`)}
              onTreat={() => markPatientTreated(patient.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

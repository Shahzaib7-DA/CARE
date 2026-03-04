import { useNavigate } from 'react-router-dom'
import { usePatients, useDashboardStats } from '@/hooks/useApi'
import { usePatientStore } from '@/store'
import { StatCard } from '@/components/features/StatCard'
import { PatientTable } from '@/components/features/PatientTable'
import { AlertCircle, Users, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: patients = [], isLoading: patientsLoading } = usePatients()
  const { data: stats } = useDashboardStats()
  const setSelectedPatient = usePatientStore((s) => s.setSelectedPatient)
  const resolvedPatientIds = usePatientStore((s) => s.resolvedPatientIds)

  const activePatients = patients.filter(
    (p) => !resolvedPatientIds.includes(p.patient_id)
  )

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    navigate(`/dashboard/patients/${patient.patient_id}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/30 min-h-screen"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-medical-blue to-cyan-500 dark:from-blue-900 dark:to-cyan-900 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-4xl font-bold mb-2">
          Clinical Risk Dashboard
        </h1>
        <p className="text-blue-100 dark:text-blue-200">
          Real-time sepsis risk monitoring and patient triage
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Patients"
          value={stats?.total_patients || 0}
          icon={<Users className="w-6 h-6" />}
          variant="default"
          isLoading={!stats}
        />
        <StatCard
          label="Critical (RED)"
          value={stats?.critical_patients || 0}
          icon={<AlertCircle className="w-6 h-6" />}
          variant="critical"
          isLoading={!stats}
        />
        <StatCard
          label="Warnings (YELLOW)"
          value={stats?.warning_patients || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="warning"
          isLoading={!stats}
        />
        <StatCard
          label="Stable (GREEN)"
          value={stats?.stable_patients || 0}
          icon={<Activity className="w-6 h-6" />}
          variant="success"
          isLoading={!stats}
        />
      </div>

      {/* Patient Table */}
      <PatientTable
        patients={activePatients}
        onPatientSelect={handlePatientSelect}
        isLoading={patientsLoading}
        sortBy="risk"
      />

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-900 dark:text-blue-100 shadow-md"
      >
        <p className="font-semibold mb-1">💡 Demo Mode Active</p>
        <p className="text-blue-800 dark:text-blue-200">
          This dashboard is running in demo mode with simulated patient data. Connect your backend API in settings.
        </p>
      </motion.div>
    </motion.div>
  )
}

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
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Clinical Risk Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Real-time sepsis risk monitoring and patient triage
        </p>
      </div>

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
        patients={patients}
        onPatientSelect={handlePatientSelect}
        isLoading={patientsLoading}
        sortBy="risk"
      />

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg p-4 text-sm text-blue-900 dark:text-slate-200"
      >
        <p className="font-medium mb-1">💡 Demo Mode Active</p>
        <p className="text-blue-800 dark:text-slate-300">
          This dashboard is running in demo mode with simulated patient data. Connect your backend API in settings.
        </p>
      </motion.div>
    </motion.div>
  )
}

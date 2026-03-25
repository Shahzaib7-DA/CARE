import { useNavigate } from 'react-router-dom'

import { usePatientContext } from '@/context/PatientContext'
import { StatCard } from '@/components/features/StatCard'
import { PatientTable } from '@/components/features/PatientTable'
import { AlertCircle, Users, TrendingUp, Activity, Clock, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export function DashboardPage() {
  const navigate = useNavigate()
  const { patients } = usePatientContext()

  // calculate average response time using treated patients with valid timestamps
  const resolvedAlerts = patients.filter(
    (p) => p.alertStartTime && p.resolvedTime
  )
  let avgResponseTimeDisplay = '0 min'

  if (resolvedAlerts.length > 0) {
    const totalMs = resolvedAlerts.reduce((acc, p) => acc + (p.resolvedTime! - p.alertStartTime!), 0)
    const avgMs = totalMs / resolvedAlerts.length
    const avgMinutes = Math.round(avgMs / 60000)
    avgResponseTimeDisplay = `${avgMinutes} min`
  }

  // Calculate stats dynamically from context to ensure they perfectly match the table below
  const stats = {
    total_patients: patients.length,
    critical_patients: patients.filter((p) => p.riskLevel === 'HIGH').length,
    warning_patients: patients.filter((p) => p.riskLevel === 'MEDIUM').length,
    stable_patients: patients.filter((p) => p.riskLevel === 'LOW').length,
  }

  // show active and recovering patients that need attention (exclude LOW risk)
  const activePatients = patients.filter(
    (p) => (p.status === 'active' || p.status === 'recovering') && p.riskLevel !== 'LOW'
  )

  // table component still expects legacy Patient type; map accordingly for display
  const tablePatients = activePatients.map((p) => {
    const v = p.vitals || { heartRate: 72, oxygenLevel: 98, temperature: 37, bloodPressure: '120/80' }
    return {
      patient_id: p.id,
      name: p.name,
      age: p.age,
      bed_number: p.bed_number || 'N/A',
      pattern_score: (p as any).patternScore ?? 0.5,
      reasons: [],
      trend: [],
      risk_level:
        p.riskLevel === 'HIGH' ? 'RED' : p.riskLevel === 'MEDIUM' ? 'YELLOW' : 'GREEN',
      sepsis_risk: p.riskScore,
      status: p.status,
      last_updated: p.last_updated,
      vitals: {
        HR: v.heartRate,
        O2Sat: v.oxygenLevel,
        Temp: v.temperature,
        SBP: parseInt(v.bloodPressure.split('/')[0] || '120'),
        DBP: parseInt(v.bloodPressure.split('/')[1] || '80'),
        MAP: 90,
        Resp: 16
      }
    }
  })

  const handlePatientSelect = (patient: any) => {
    const id = patient.id ?? patient.patient_id
    navigate(`/dashboard/patients/${id}`)
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
      className="p-4 md:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen relative overflow-hidden"
    >
      {/* Background Atmosphere - Animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-medical-blue/10 dark:bg-medical-blue/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-accent/10 dark:bg-accent/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8">
        {/* Dashboard Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden bg-gradient-ai rounded-3xl p-8 md:p-10 text-white shadow-[0_20px_60px_rgba(37,99,235,0.15)] dark:shadow-[0_20px_60px_rgba(37,99,235,0.05)] border border-white/20 animate-bg-pan bg-[length:200%_200%]"
        >
          {/* Soft lighting effects within Hero */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-20 -mb-20 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 drop-shadow-sm">
                Clinical Risk Dashboard
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
                Real-time sepsis risk monitoring and proactive patient triage
              </p>
            </div>
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-inner self-start md:self-auto">
              <div className="flex items-center justify-center w-3 h-3 relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_8px_rgba(20,184,166,1)]"></span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white/95">LIVE MONITORING</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            label="Total Patients"
            value={stats?.total_patients || 0}
            icon={<Users className="w-6 h-6" />}
            variant="default"
            isLoading={!stats}
          />
          <StatCard
            label="Critical"
            value={stats?.critical_patients || 0}
            icon={<AlertCircle className="w-6 h-6 text-danger" />}
            variant="critical"
            isLoading={!stats}
          />
          <StatCard
            label="Warnings"
            value={stats?.warning_patients || 0}
            icon={<TrendingUp className="w-6 h-6 text-warning" />}
            variant="warning"
            isLoading={!stats}
          />
          <StatCard
            label="Stable"
            value={stats?.stable_patients || 0}
            icon={<Activity className="w-6 h-6 text-success" />}
            variant="success"
            isLoading={!stats}
          />
          <StatCard
            label="Avg Response"
            value={avgResponseTimeDisplay}
            icon={<Clock className="w-6 h-6" />}
            variant="default"
            isLoading={!stats}
          />
        </div>

        {/* Patient Table with subtle container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm overflow-hidden p-1">
          <PatientTable
            patients={tablePatients as any}
            onPatientSelect={handlePatientSelect}
            sortBy="risk"
          />
        </div>

        {/* Info card */}
        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-cyan-50/50 dark:from-blue-950/40 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-5 text-sm shadow-sm backdrop-blur-md"
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2">
              Demo Mode Active
            </p>
            <p className="text-blue-700/80 dark:text-blue-200/70 font-medium">
              This dashboard is running in demo mode with simulated patient data. Connect your backend API in settings for live electronic health record (EHR) integration.
            </p>
          </div>
        </motion.div>
      </div> {/* <-- This closes the relative z-10 container */}
    </motion.div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientContext, Patient as ContextPatient } from '@/context/PatientContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { AddPatientMenu } from '@/components/features/AddPatientMenu'
import { PatientFormData } from '@/components/features/PatientAddForm'
import { Search } from 'lucide-react'

const API_BASE = (((import.meta as any).env.VITE_API_URL as string | undefined) || 'http://localhost:8000') + '/api'

type ToastType = { type: 'success' | 'error'; message: string; detail?: string } | null

function riskLevelFromAPI(apiLevel: string): ContextPatient['riskLevel'] {
  if (apiLevel === 'RED') return 'HIGH'
  if (apiLevel === 'YELLOW') return 'MEDIUM'
  return 'LOW'
}

export function PatientsPage() {
  const navigate = useNavigate()
  const { patients, setPatients } = usePatientContext()
  const [filterRisk, setFilterRisk] = useState<ContextPatient['riskLevel'] | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastType>(null)

  const showToast = (t: NonNullable<ToastType>) => {
    setToast(t)
    setTimeout(() => setToast(null), 5000)
  }

  const filtered = patients.filter((p) => {
    const matchesRisk = filterRisk ? p.riskLevel === filterRisk : true
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRisk && matchesSearch
  })

  const handlePatientSelect = (patient: ContextPatient) => {
    navigate(`/dashboard/patients/${patient.id}`)
  }

  const handleAddPatient = async (data: PatientFormData) => {
    setIsSubmitting(true)
    try {
      const payload = {
        patient_id: data.patientId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        bed_number: data.bedNumber,
        status: 'active',
        vitals: {
          HR: data.heartRate,
          O2Sat: data.spo2,
          Temp: data.temperature,
          SBP: data.systolicBP,
          DBP: data.diastolicBP,
          Resp: data.respiratoryRate,
        },
        // trendHR: newest → oldest (index 0 = 10s ago → index 4 = 1.5min ago)
        trend_hr: data.trendHR,
      }

      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.detail || json.error || 'Failed to add patient')
      }

      const { patient: p, prediction } = json.data

      // Map backend document → PatientContext shape
      const newPatient: ContextPatient = {
        id: p.patient_id,
        name: p.name,
        age: p.age,
        bed_number: p.bed_number,
        riskLevel: riskLevelFromAPI(p.risk_level),
        riskScore: p.sepsis_risk,
        patternScore: p.pattern_score,
        status: p.status as any,
        last_updated: p.last_updated,
        vitals: p.vitals ? {
          heartRate: p.vitals.HR,
          oxygenLevel: p.vitals.O2Sat,
          temperature: p.vitals.Temp,
          bloodPressure: `${p.vitals.SBP}/${p.vitals.DBP}`,
        } : undefined,
        reasons: p.reasons ?? [],
        riskHistory: p.trend ?? [],
      }

      setPatients((prev) => [newPatient, ...prev])

      const risk = p.risk_level
      const score = (p.sepsis_risk * 100).toFixed(0)
      showToast({
        type: risk === 'RED' ? 'error' : 'success',
        message: `${p.name} added successfully`,
        detail: `Sepsis Risk: ${score}% (${risk}) — ${prediction?.reasons?.[0] ?? 'All vitals assessed'}`,
      })
    } catch (err: any) {
      showToast({
        type: 'error',
        message: 'Failed to add patient',
        detail: err.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-sm border ${toast.type === 'success'
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
              }`}
          >
            {toast.type === 'success'
              ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              : <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            }
            <div className="flex-1">
              <p className={`font-bold text-sm ${toast.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {toast.message}
              </p>
              {toast.detail && (
                <p className={`text-xs mt-0.5 ${toast.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {toast.detail}
                </p>
              )}
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage and monitor all patients in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddPatientMenu
            onAddText={handleAddPatient}
            isSubmitting={isSubmitting}
            onAddVoice={() => alert('voice mode selected')}
            onAddImage={() => alert('image mode selected')}
            onUploadDataset={(files) => console.log('files selected', files)}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilterRisk(undefined)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!filterRisk
              ? 'bg-gradient-to-r from-medical-blue to-cyan-500 text-white shadow-lg'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
          >
            <Filter className="w-4 h-4" />
            All Patients ({patients.length})
          </button>

          {(['HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterRisk === level
                ? 'bg-gradient-to-r from-medical-blue to-cyan-500 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              {level.charAt(0) + level.slice(1).toLowerCase()} ({
                patients.filter((p) => p.riskLevel === level).length
              })
            </button>
          ))}
        </div>

        {/* Patient Status Table */}
        <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Risk Level</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Risk Score</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => {
                const isRecovered = patient.status === 'stable' || patient.status === 'treated'
                const isRecovering = patient.status === 'recovering'
                return (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-100 font-medium">{patient.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{patient.id}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${patient.riskLevel === 'HIGH'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : patient.riskLevel === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        }`}>
                        {patient.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {(patient.riskScore * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isRecovered
                          ? 'bg-green-100 text-green-700'
                          : isRecovering
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                        {isRecovered ? 'Recovered' : isRecovering ? 'Stabilizing' : 'Active'}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

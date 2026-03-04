import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '@/hooks/useApi'
import { usePatientStore } from '@/store'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Filter, RotateCcw } from 'lucide-react'
import { AddPatientMenu } from '@/components/features/AddPatientMenu'
import { PatientFormData } from '@/components/features/PatientAddForm'
import type { Patient } from '@/types'

export function PatientsPage() {
  const navigate = useNavigate()
  const { data: patients = [], isLoading, refetch } = usePatients()
  const setSelectedPatient = usePatientStore((s) => s.setSelectedPatient)
  const addPatient = usePatientStore((s) => s.addPatient)
  const storePatients = usePatientStore((s) => s.patients)
  const resolvedPatientIds = usePatientStore((s) => s.resolvedPatientIds)
  const [filterRisk, setFilterRisk] = useState<string | undefined>()

  // Merge API patients with store patients (store patients appear first)
  const allPatients = [
    ...storePatients,
    ...patients.filter(
      (p) => !storePatients.some((sp) => sp.patient_id === p.patient_id)
    ),
  ]

  const filtered = filterRisk
    ? allPatients.filter((p) => p.risk_level === filterRisk)
    : allPatients

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    navigate(`/dashboard/patients/${patient.patient_id}`)
  }

  const handleAddPatient = (data: PatientFormData) => {
    // TODO: Send to backend API
    console.log('New patient data:', data)
    
    // Create a new patient object for the store
    const newPatient: Patient = {
      patient_id: data.patientId,
      name: `Patient ${data.patientId}`,
      age: data.age,
      bed_number: 'N/A',
      sepsis_risk: 0.2, // Default low risk for new patients
      pattern_score: 0.1,
      risk_level: 'GREEN', // Default to green for new patients
      reasons: ['New patient added to system'],
      trend: [],
      vitals: {
        HR: data.heartRate,
        O2Sat: data.spo2,
        Temp: data.temperature,
        SBP: data.systolicBP,
        DBP: data.diastolicBP,
        MAP: Math.round((data.systolicBP + 2 * data.diastolicBP) / 3),
        Resp: data.respiratoryRate,
      },
      last_updated: new Date().toISOString(),
    }
    
    // Add patient to store immediately for instant UI feedback
    addPatient(newPatient)
    
    // Show success message
    alert(`Patient ${data.patientId} added successfully!`)
    
    // Refetch patients list from API
    refetch()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage and monitor all patients in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddPatientMenu
            onAddText={handleAddPatient}
            onAddVoice={() => alert('voice mode selected')}
            onAddImage={() => alert('image mode selected')}
            onUploadDataset={(files) => console.log('files selected', files)}
          />
          <Button
            onClick={() => refetch()}
            variant="secondary"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterRisk(undefined)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !filterRisk
              ? 'bg-gradient-to-r from-medical-blue to-cyan-500 text-white shadow-lg'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <Filter className="w-4 h-4" />
          All Patients ({allPatients.length})
        </button>

        <button
          onClick={() => setFilterRisk('RED')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterRisk === 'RED'
              ? 'bg-gradient-to-r from-risk-red to-orange-500 text-white shadow-lg'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50'
          }`}
        >
          Critical ({allPatients.filter((p) => p.risk_level === 'RED').length})
        </button>

        <button
          onClick={() => setFilterRisk('YELLOW')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterRisk === 'YELLOW'
              ? 'bg-gradient-to-r from-risk-yellow to-amber-500 text-white shadow-lg'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
          }`}
        >
          Warning ({allPatients.filter((p) => p.risk_level === 'YELLOW').length})
        </button>

        <button
          onClick={() => setFilterRisk('GREEN')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterRisk === 'GREEN'
              ? 'bg-gradient-to-r from-risk-green to-emerald-500 text-white shadow-lg'
              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50'
          }`}
        >
          Stable ({allPatients.filter((p) => p.risk_level === 'GREEN').length})
        </button>
      </div>

      {/* Patient Status Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                Patient ID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                Bed
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => {
              const treated = resolvedPatientIds.includes(patient.patient_id)
              return (
                <tr
                  key={patient.patient_id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-100">
                    {patient.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {patient.patient_id}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {patient.bed_number}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        treated
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                      }`}
                    >
                      {treated ? 'Treated' : 'Not treated'}
                    </span>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && !isLoading && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 px-4 text-center text-slate-500 dark:text-slate-400 text-sm"
                >
                  No patients found
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-4 px-4">
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

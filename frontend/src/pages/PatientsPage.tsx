import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatients } from '@/hooks/useApi'
import { usePatientStore } from '@/store'
import { PatientTable } from '@/components/features/PatientTable'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Filter, RotateCcw } from 'lucide-react'
import { AddPatientMenu } from '@/components/features/AddPatientMenu'
import { PatientFormData } from '@/components/features/PatientAddForm'

export function PatientsPage() {
  const navigate = useNavigate()
  const { data: patients = [], isLoading, refetch } = usePatients()
  const setSelectedPatient = usePatientStore((s) => s.setSelectedPatient)
  const [filterRisk, setFilterRisk] = useState<string | undefined>()

  const filtered = filterRisk
    ? patients.filter((p) => p.risk_level === filterRisk)
    : patients

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    navigate(`/dashboard/patients/${patient.patient_id}`)
  }

  const handleAddPatient = (data: PatientFormData) => {
    // TODO: Send to backend API
    console.log('New patient data:', data)
    // Show success message
    alert(`Patient ${data.patientId} added successfully!`)
    // Refetch patients list
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
          <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-2">
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filterRisk
              ? 'bg-medical-blue text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          All Patients ({patients.length})
        </button>

        <button
          onClick={() => setFilterRisk('RED')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterRisk === 'RED'
              ? 'bg-risk-red text-white'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          Critical ({patients.filter((p) => p.risk_level === 'RED').length})
        </button>

        <button
          onClick={() => setFilterRisk('YELLOW')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterRisk === 'YELLOW'
              ? 'bg-risk-yellow text-white'
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          Warning ({patients.filter((p) => p.risk_level === 'YELLOW').length})
        </button>

        <button
          onClick={() => setFilterRisk('GREEN')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterRisk === 'GREEN'
              ? 'bg-risk-green text-white'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          Stable ({patients.filter((p) => p.risk_level === 'GREEN').length})
        </button>
      </div>

      {/* Patient Table */}
      <PatientTable
        patients={filtered}
        onPatientSelect={handlePatientSelect}
        isLoading={isLoading}
        sortBy="risk"
      />
    </motion.div>
  )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface PatientAddFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PatientFormData) => void
  isLoading?: boolean
}

export interface PatientFormData {
  patientId: string
  age: number
  gender: string
  heartRate: number
  systolicBP: number
  diastolicBP: number
  respiratoryRate: number
  temperature: number
  spo2: number
}

export function PatientAddForm({ isOpen, onClose, onSubmit, isLoading = false }: PatientAddFormProps) {
  const [formData, setFormData] = useState<any>({
    patientId: `P${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`,
    age: '',
    gender: '',
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    respiratoryRate: '',
    temperature: '',
    spo2: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'patientId' || name === 'gender' ? value : parseFloat(value) || '',
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.age ||
      !formData.gender ||
      !formData.heartRate ||
      !formData.systolicBP ||
      !formData.diastolicBP ||
      !formData.respiratoryRate ||
      !formData.temperature ||
      !formData.spo2
    ) {
      alert('Please fill in all fields')
      return
    }

    onSubmit(formData as PatientFormData)
  }

  const handleRegenerate = () => {
    setFormData((prev: any) => ({
      ...prev,
      patientId: `P${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`,
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-medical-blue to-blue-400 px-6 py-6">
              <h2 className="text-2xl font-bold text-white">Add Patient</h2>
              <p className="text-blue-100 text-sm mt-1">Enter patient information and current vitals</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* Basic Patient Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  🔹 Basic Patient Information
                </h3>

                {/* Patient ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Patient ID (Auto-generated)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        disabled
                        className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium text-sm"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Age (years) *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g., 65"
                      min="0"
                      max="150"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Vitals Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  🔹 Current Vitals (Required)
                </h3>

                {/* Heart Rate & Temp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Heart Rate (bpm) *
                    </label>
                    <input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleChange}
                      placeholder="e.g., 72"
                      min="0"
                      max="300"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Temperature (°C) *
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      placeholder="e.g., 36.5"
                      min="32"
                      max="45"
                      step="0.1"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Systolic & Diastolic BP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Systolic BP (mmHg) *
                    </label>
                    <input
                      type="number"
                      name="systolicBP"
                      value={formData.systolicBP}
                      onChange={handleChange}
                      placeholder="e.g., 120"
                      min="0"
                      max="300"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Diastolic BP (mmHg) *
                    </label>
                    <input
                      type="number"
                      name="diastolicBP"
                      value={formData.diastolicBP}
                      onChange={handleChange}
                      placeholder="e.g., 80"
                      min="0"
                      max="200"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>
                </div>

                {/* Respiratory Rate & SpO2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Respiratory Rate (breaths/min) *
                    </label>
                    <input
                      type="number"
                      name="respiratoryRate"
                      value={formData.respiratoryRate}
                      onChange={handleChange}
                      placeholder="e.g., 16"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      SpO₂ (%) *
                    </label>
                    <input
                      type="number"
                      name="spo2"
                      value={formData.spo2}
                      onChange={handleChange}
                      placeholder="e.g., 98"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-medical-blue text-white rounded-lg font-semibold hover:bg-medical-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Add Patient'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

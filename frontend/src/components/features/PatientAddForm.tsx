import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw, Activity, Heart, Thermometer, Wind, Droplets, TrendingUp } from 'lucide-react'

export interface PatientFormData {
  patientId: string
  name: string
  age: number
  gender: string
  bedNumber: string
  heartRate: number
  systolicBP: number
  diastolicBP: number
  respiratoryRate: number
  temperature: number
  spo2: number
  // Historical HR at: 10s ago, 20s ago, 50s ago, 1min ago, 1.5min ago
  trendHR: [number, number, number, number, number]
}

interface PatientAddFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PatientFormData) => void
  isLoading?: boolean
}

const TREND_LABELS = [
  { label: '10s ago', key: 0 },
  { label: '20s ago', key: 1 },
  { label: '50s ago', key: 2 },
  { label: '1 min ago', key: 3 },
  { label: '1.5 min ago', key: 4 },
]

function generateId() {
  return `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
}

export function PatientAddForm({ isOpen, onClose, onSubmit, isLoading = false }: PatientAddFormProps) {
  const [formData, setFormData] = useState<any>({
    patientId: generateId(),
    name: '',
    age: '',
    gender: '',
    bedNumber: '',
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    respiratoryRate: '',
    temperature: '',
    spo2: '',
    trendHR: ['', '', '', '', ''],
  })

  const [activeSection, setActiveSection] = useState<'basic' | 'vitals' | 'trend'>('basic')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const isText = ['patientId', 'name', 'gender', 'bedNumber'].includes(name)
    setFormData((prev: any) => ({
      ...prev,
      [name]: isText ? value : (parseFloat(value) || ''),
    }))
  }

  const handleTrendHRChange = (index: number, value: string) => {
    setFormData((prev: any) => {
      const updated = [...prev.trendHR]
      updated[index] = parseFloat(value) || ''
      return { ...prev, trendHR: updated }
    })
  }

  // Auto-fill trend HR with current HR ± small random variation
  const autoFillTrend = () => {
    const base = parseFloat(formData.heartRate) || 80
    setFormData((prev: any) => ({
      ...prev,
      trendHR: Array.from({ length: 5 }, () =>
        Math.round(base + (Math.random() - 0.5) * 8)
      ),
    }))
  }

  const sectionComplete = {
    basic: formData.name && formData.age && formData.gender && formData.bedNumber,
    vitals: formData.heartRate && formData.systolicBP && formData.diastolicBP &&
      formData.respiratoryRate && formData.temperature && formData.spo2,
    trend: formData.trendHR.every((v: any) => v !== ''),
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!sectionComplete.basic || !sectionComplete.vitals) {
      alert('Please fill in all required fields in Basic Info and Vitals sections.')
      return
    }

    // If trend HR not filled, auto-generate from current HR
    const trendHR = formData.trendHR.map((v: any) => {
      if (v !== '' && !isNaN(v)) return Number(v)
      const base = Number(formData.heartRate)
      return Math.round(base + (Math.random() - 0.5) * 8)
    }) as [number, number, number, number, number]

    onSubmit({
      patientId: formData.patientId,
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      bedNumber: formData.bedNumber,
      heartRate: Number(formData.heartRate),
      systolicBP: Number(formData.systolicBP),
      diastolicBP: Number(formData.diastolicBP),
      respiratoryRate: Number(formData.respiratoryRate),
      temperature: Number(formData.temperature),
      spo2: Number(formData.spo2),
      trendHR,
    })
  }

  const inputCls = 'w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all text-sm font-medium placeholder:text-slate-400 placeholder:font-normal'

  const sections = [
    { id: 'basic', label: 'Patient Info', icon: Activity },
    { id: 'vitals', label: 'Vitals', icon: Heart },
    { id: 'trend', label: 'HR History', icon: TrendingUp },
  ] as const

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-8 py-7 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Add New Patient</h2>
                <p className="text-blue-100/80 text-sm mt-1 font-medium">
                  Enter patient info, vitals, and historical heart rate for AI risk assessment
                </p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/70 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${activeSection === id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {sectionComplete[id] && (
                    <span className="w-2 h-2 rounded-full bg-green-500 ml-0.5" />
                  )}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit}>
              <div className="p-8 max-h-[55vh] overflow-y-auto space-y-5">

                {/* ── Section 1: Basic Info ──────────────────────────── */}
                {activeSection === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    {/* Patient ID */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Patient ID <span className="text-slate-400 font-normal">(auto-generated)</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.patientId}
                          disabled
                          className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((p: any) => ({ ...p, patientId: generateId() }))}
                          className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., John Doe"
                        className={inputCls}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Age */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Age (years) *
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="e.g., 62"
                          min={0} max={150}
                          className={inputCls}
                        />
                      </div>

                      {/* Bed Number */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Bed Number *
                        </label>
                        <input
                          type="text"
                          name="bedNumber"
                          value={formData.bedNumber}
                          onChange={handleChange}
                          placeholder="e.g., ICU-04"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputCls}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* ── Section 2: Vitals ────────────────────────────────── */}
                {activeSection === 'vitals' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    {/* Auto-fill header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Vital Signs</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Enter the patient's current readings or auto-fill with sample values.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // Generate slightly-elevated vitals (mild sepsis concern range)
                          setFormData((prev: any) => ({
                            ...prev,
                            heartRate: Math.round(88 + Math.random() * 20),          // 88–108 bpm
                            temperature: parseFloat((37.5 + Math.random() * 1.2).toFixed(1)), // 37.5–38.7°C
                            systolicBP: Math.round(105 + Math.random() * 25),          // 105–130 mmHg
                            diastolicBP: Math.round(60 + Math.random() * 20),           // 60–80 mmHg
                            respiratoryRate: Math.round(18 + Math.random() * 8),            // 18–26 breaths/min
                            spo2: Math.round(91 + Math.random() * 7),            // 91–98%
                          }))
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800 whitespace-nowrap"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Auto-fill
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-red-500" /> Heart Rate (bpm) *</span>
                        </label>
                        <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange}
                          placeholder="e.g., 88" min={0} max={300} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-orange-500" /> Temperature (°C) *</span>
                        </label>
                        <input type="number" name="temperature" value={formData.temperature} onChange={handleChange}
                          placeholder="e.g., 37.2" min={32} max={45} step={0.1} className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Systolic BP (mmHg) *
                        </label>
                        <input type="number" name="systolicBP" value={formData.systolicBP} onChange={handleChange}
                          placeholder="e.g., 125" min={0} max={300} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Diastolic BP (mmHg) *
                        </label>
                        <input type="number" name="diastolicBP" value={formData.diastolicBP} onChange={handleChange}
                          placeholder="e.g., 82" min={0} max={200} className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-blue-500" /> Resp. Rate (breaths/min) *</span>
                        </label>
                        <input type="number" name="respiratoryRate" value={formData.respiratoryRate} onChange={handleChange}
                          placeholder="e.g., 18" min={0} max={100} className={inputCls} />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-cyan-500" /> SpO₂ (%) *</span>
                        </label>
                        <input type="number" name="spo2" value={formData.spo2} onChange={handleChange}
                          placeholder="e.g., 97" min={0} max={100} className={inputCls} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Section 3: HR Trend ───────────────────────────────── */}
                {activeSection === 'trend' && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Historical Heart Rate Readings
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          These readings are used to build a realistic time-series for the LSTM model.
                          Leave blank to auto-generate from current HR.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={autoFillTrend}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800 whitespace-nowrap"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Auto-fill
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {TREND_LABELS.map(({ label, key }) => (
                        <div key={key} className="flex items-center gap-4">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-20 shrink-0 text-right">
                            {label}
                          </span>
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              value={formData.trendHR[key]}
                              onChange={(e) => handleTrendHRChange(key, e.target.value)}
                              placeholder={formData.heartRate ? `~${Math.round(Number(formData.heartRate))} bpm` : 'e.g., 85'}
                              min={0} max={300}
                              className={inputCls}
                            />
                          </div>
                          <span className="text-xs text-slate-400 shrink-0">bpm</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
                {/* Section Navigation */}
                <div className="flex gap-2 mr-auto">
                  {activeSection !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => setActiveSection(activeSection === 'trend' ? 'vitals' : 'basic')}
                      className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                  {activeSection !== 'trend' && (
                    <button
                      type="button"
                      onClick={() => setActiveSection(activeSection === 'basic' ? 'vitals' : 'trend')}
                      className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running AI analysis...
                    </>
                  ) : (
                    '+ Add Patient'
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

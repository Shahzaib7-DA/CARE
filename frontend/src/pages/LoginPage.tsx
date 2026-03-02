import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const currentUser = useAuthStore((s) => s.user)

  // if already authenticated, skip login
  useEffect(() => {
    if (currentUser?.isAuthenticated) {
      navigate('/dashboard')
    }
  }, [currentUser, navigate])

  const [step, setStep] = useState(1) // 1: Hospital, 2: Doctor
  const [loading, setLoading] = useState(false)

  const [hospital, setHospital] = useState({
    hospitalName: '',
    address: '',
    city: '',
    country: '',
    hospitalId: '',
  })

  const [doctor, setDoctor] = useState({
    name: '',
    email: '',
    licenseNumber: '',
    specialization: '',
    department: '',
  })

  const handleHospitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value })
  }

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value })
  }

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hospital.hospitalName || !hospital.address || !hospital.city || !hospital.country) {
      alert('Please fill in all hospital fields')
      return
    }
    setStep(2)
  }

  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctor.name || !doctor.email || !doctor.licenseNumber || !doctor.specialization) {
      alert('Please fill in all doctor fields')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    setUser({
      hospital,
      doctor,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    })

    // show message then navigate
    setStatusMessage('Logged in successfully. Fetching latest data...')
    setTimeout(() => {
      navigate('/dashboard')
    }, 1200)

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center gap-2 justify-center hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">Care</h1>
                <p className="text-xs text-medical-blue font-semibold">Mind</p>
              </div>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome to CareMind</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {step === 1 ? 'Hospital Information' : 'Doctor Information'}
          </p>
        </div>

        <div className="flex gap-2 mb-8">
          <motion.div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step >= 1 ? 'bg-medical-blue' : 'bg-slate-200'
            }`}
          />
          <motion.div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step >= 2 ? 'bg-medical-blue' : 'bg-slate-200'
            }`}
          />
        </div>

        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-100 dark:border-slate-700"
        >
          {step === 1 ? (
            <form onSubmit={handleHospitalSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-medical-blue" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={hospital.hospitalName}
                  onChange={handleHospitalChange}
                  placeholder="Enter hospital name"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hospital ID
                </label>
                <input
                  type="text"
                  name="hospitalId"
                  value={hospital.hospitalId}
                  onChange={handleHospitalChange}
                  placeholder="e.g., HOSP-001"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={hospital.address}
                  onChange={handleHospitalChange}
                  placeholder="Street address"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={hospital.city}
                  onChange={handleHospitalChange}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={hospital.country}
                  onChange={handleHospitalChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-8 px-6 py-3 bg-medical-blue text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-medical-blue/90 transition-colors"
              >
                Next: Doctor Information
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleDoctorSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-medical-blue" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={doctor.name}
                  onChange={handleDoctorChange}
                  placeholder="Dr. John Smith"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={doctor.email}
                  onChange={handleDoctorChange}
                  placeholder="doctor@hospital.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Medical License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={doctor.licenseNumber}
                  onChange={handleDoctorChange}
                  placeholder="LIC-123456"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={doctor.specialization}
                  onChange={handleDoctorChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                >
                  <option value="">Select specialization</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Intensive Care">Intensive Care (ICU)</option>
                  <option value="Infectious Disease">Infectious Disease</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={doctor.department}
                  onChange={handleDoctorChange}
                  placeholder="e.g., ICU, Emergency Ward"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:bg-white dark:focus:bg-slate-600 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div className="flex gap-3 pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-medical-blue text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-medical-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="text-center pt-4">
                <Link to="/" className="text-sm text-slate-600 hover:text-medical-blue transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </form>
          )}
        </motion.div>

        {statusMessage && (
          <div className="mt-6 text-center text-green-600 font-medium">
            {statusMessage}
          </div>
        )}

        <p className="text-center text-xs text-slate-500 mt-6">
          This is a demo access portal. For support, contact admin@caremind.com
        </p>
      </motion.div>
    </div>
  )
}

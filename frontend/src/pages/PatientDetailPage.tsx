import { useParams, useNavigate } from 'react-router-dom'
import { usePatientContext, Patient as ContextPatient } from '@/context/PatientContext'
import { RiskIndicator, RiskBadge } from '@/components/features/RiskBadge'
import { TrendChart } from '@/components/features/TrendChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Droplets, Thermometer } from 'lucide-react'
import { getTimeAgo } from '@/lib/utils'
import { Vitals } from '@/lib/vitalsGenerator'

export function PatientDetailPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { patients } = usePatientContext()

  // Find local patient instead of API 
  const found = patients.find(p => p.id === patientId || (p as any).patient_id === patientId)
  const patient = found ? (found as ContextPatient & { trend?: number[] }) : undefined
  const isLoading = false // Context is synchronous

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
        {/* Vital Signs */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Current Vitals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate('/dashboard/patients')} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Patient not found</p>
      </div>
    )
  }

  // In a real app the backend records continuous trends. Build a smoother simulated downward curve
  // representing post-treatment stabilization for 'recovering' and 'stable' patients.
  const isRecovering = patient.status === 'recovering' || patient.status === 'stable'

  const safeTrend = (patient as any).trend || [0]
  const trendData = safeTrend.map((value: number, i: number) => {
    const count = safeTrend.length
    const minutesPerStep = 5
    const baseTime = new Date(patient.last_updated).getTime()
    const offset = (count - i - 1) * minutesPerStep * 60000
    const time = new Date(baseTime - offset)
    const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Simulate smoothed trailing drop by blending actual value with current descending riskScore
    let finalValue = value;
    if (isRecovering && i === count - 1) {
      finalValue = patient.riskScore * 100 // Last point is precise current score
    } else if (isRecovering && i > count - 4) {
      // Create a smooth arc from the peak value down to the current recovering score
      const distance = count - i; // 1 to 3
      const peak = safeTrend[count - distance - 1] || value;
      finalValue = peak - ((peak - (patient.riskScore * 100)) / distance);
    }

    return { time: label, value: finalValue }
  })

  // Safe vitals extraction (the context populates this, but fallback just in case)
  const currentVitals = (patient.vitals as any) as Vitals || { heartRate: 0, oxygenLevel: 0, temperature: 0, bloodPressure: '0/0' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard/patients')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{patient.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Bed {patient.bed_number || 'N/A'} • Age {patient.age || 'Unknown'} • <span className="text-medical-blue font-medium">AI Mode: Continuous Monitoring</span>
            </p>
          </div>
        </div>
        {isRecovering ? (
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-full font-semibold border border-green-200 dark:border-green-800">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              {patient.status === 'stable' ? 'Recovered' : 'Stabilizing'}
            </span>
          </div>
        ) : (
          <RiskBadge
            level={patient.riskLevel === 'HIGH' ? 'RED' : patient.riskLevel === 'MEDIUM' ? 'YELLOW' : 'GREEN'}
            score={patient.riskScore}
          />
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Risk Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-2"
        >
          <Card
            className={
              patient.riskLevel === 'HIGH'
                ? 'border-2 border-red-300 dark:border-red-800'
                : ''
            }
          >
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Current sepsis risk and pattern analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RiskIndicator
                level={patient.riskLevel === 'HIGH' ? 'RED' : patient.riskLevel === 'MEDIUM' ? 'YELLOW' : 'GREEN'}
                score={patient.riskScore}
                showTrend
                trendDirection={
                  safeTrend[safeTrend.length - 1] >
                    safeTrend[0]
                    ? 'up'
                    : 'down'
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Clinical Assessment
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(patient.riskScore * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">
                    Pattern Score
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(patient.patternScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Status
                </span>
                <div>
                  {isRecovering ? (
                    <div className="w-full max-w-[150px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-600 dark:text-green-400 font-medium">Recovery</span>
                        <span className="text-slate-500">
                          {Math.min(100, Math.round(((100 - (patient.riskScore * 100)) / 80) * 100))}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.round(((100 - (patient.riskScore * 100)) / 80) * 100))}% ` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 text-left">Vitals returning to normal</p>
                    </div>
                  ) : (
                    <RiskBadge
                      level={patient.riskLevel === 'HIGH' ? 'RED' : patient.riskLevel === 'MEDIUM' ? 'YELLOW' : 'GREEN'}
                      score={patient.riskScore}
                      animated={false}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Last Updated
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {getTimeAgo(patient.last_updated)}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-300 mb-2 font-semibold uppercase tracking-wider">
                  Risk Factors
                </p>
                <div className="space-y-2">
                  {(!patient.reasons || patient.reasons.length === 0) ? (
                    <p className="text-sm text-risk-green flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-risk-green" />
                      No active risk factors
                    </p>
                  ) : (
                    patient.reasons.map((reason, i) => (
                      <p key={i} className="text-sm text-red-500 flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        {reason}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TrendChart data={trendData} title="Risk Trend" variant="area" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Current Vitals</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last vitals update: {getTimeAgo(patient.last_updated)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Heart className="w-5 h-5 text-medical-blue mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Heart Rate
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentVitals.heartRate}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        bpm
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Droplets className="w-5 h-5 text-medical-blue mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      O2 Saturation
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentVitals.oxygenLevel}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        %
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Thermometer className="w-5 h-5 text-medical-blue mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Temperature
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentVitals.temperature.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        °C
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      BP (Sys/Dia)
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentVitals.bloodPressure}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        mmHg
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={patient.riskLevel === 'HIGH' ? "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 text-xs text-red-900 dark:text-red-100" : patient.riskLevel === 'MEDIUM' ? "bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-100" : "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-100"}>
                <p className="font-medium mb-1">Clinical Assessment</p>
                <p>
                  {patient.riskLevel === 'HIGH'
                    ? 'Patient is presenting with critical vital parameters indicating a high risk of sepsis. Immediate clinical review is required.'
                    : patient.riskLevel === 'MEDIUM'
                      ? 'Patient is presenting with abnormal vitals that elevate sepsis risk. Continuous monitoring recommended.'
                      : 'Patient presenting with normal vital parameters with stable sepsis risk.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Clinical Events Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-slate-900 dark:text-white">Clinical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 ml-2">
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Alert Triggered
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  High Risk Sepsis Alert
                </p>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Clinical Review
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Doctor Accessed File
                </p>
              </div>
              {patient.status !== 'active' && (
                <>
                  <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                      Treatment Initiated
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Medication / Fluids administered
                    </p>
                  </div>
                  <div className="relative pl-6">
                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${patient.status === 'stable' ? 'bg-green-500' : 'bg-green-400 animate-pulse'} border-2 border-white dark:border-slate-900 shadow-sm`} />
                    <p className="text-sm text-green-600 dark:text-green-500 mb-1">
                      {patient.status === 'stable' ? 'Patient Stable' : 'Vitals Improving'}
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Risk parameters returning to normal range
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

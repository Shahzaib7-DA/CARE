import { useParams, useNavigate } from 'react-router-dom'
import { usePatient } from '@/hooks/useApi'
import { RiskIndicator, RiskBadge } from '@/components/features/RiskBadge'
import { TrendChart } from '@/components/features/TrendChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Droplets, Thermometer } from 'lucide-react'
import { getTimeAgo } from '@/lib/utils'

export function PatientDetailPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { data: patient, isLoading } = usePatient(patientId || '')

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          ))}
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

  // build chart data using the patient's last_updated timestamp
  const trendData = patient.trend.map((value, i) => {
    const count = patient.trend.length
    const minutesPerStep = 5
    const baseTime = new Date(patient.last_updated).getTime()
    const offset = (count - i - 1) * minutesPerStep * 60000
    const time = new Date(baseTime - offset)
    const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return { time: label, value }
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
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
              Bed {patient.bed_number} • Age {patient.age}
            </p>
          </div>
        </div>
        <RiskBadge level={patient.risk_level} score={patient.sepsis_risk} />
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Risk Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-2"
        >
          <Card
            className={
              patient.risk_level === 'RED'
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
                level={patient.risk_level}
                score={patient.sepsis_risk}
                showTrend
                trendDirection={
                  patient.trend[patient.trend.length - 1] >
                  patient.trend[0]
                    ? 'up'
                    : 'down'
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">
                    Sepsis Risk
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(patient.sepsis_risk * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">
                    Pattern Score
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(patient.pattern_score * 100).toFixed(1)}%
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Status
                </span>
                <RiskBadge
                  level={patient.risk_level}
                  score={patient.sepsis_risk}
                  animated={false}
                />
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Last Updated
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {getTimeAgo(patient.last_updated)}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-300 mb-2 font-semibold">
                  Clinical Factors
                </p>
                <div className="space-y-1">
                  {patient.reasons.map((reason, i) => (
                    <p
                      key={i}
                      className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-risk-red" />
                      {reason}
                    </p>
                  ))}
                  {patient.reasons.length === 0 && (
                    <p className="text-xs text-risk-green">No risk factors</p>
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
            <CardHeader>
              <CardTitle className="text-base">Current Vitals</CardTitle>
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
                      {patient.vitals.HR}{' '}
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
                      {patient.vitals.O2Sat}{' '}
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
                      {patient.vitals.Temp.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        °C
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      MAP
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {patient.vitals.MAP.toFixed(0)}{' '}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        mmHg
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Clinical Assessment</p>
                <p>
                  Patient presenting with {patient.reasons.length > 0 ? `${patient.reasons.length} risk factor(s): ${patient.reasons.join(', ')}` : 'normal vital parameters with stable sepsis risk'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

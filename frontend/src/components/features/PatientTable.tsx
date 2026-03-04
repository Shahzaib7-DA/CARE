import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Patient } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from './RiskBadge'
import { ChevronRight, Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useUI'
import { cn, getTimeAgo } from '@/lib/utils'

interface PatientTableProps {
  patients: Patient[]
  onPatientSelect?: (patient: Patient) => void
  isLoading?: boolean
  sortBy?: 'risk' | 'time' | 'name'
}

export function PatientTable({
  patients,
  onPatientSelect,
  isLoading = false,
  sortBy = 'risk',
}: PatientTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery)

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.bed_number.includes(debouncedSearch)
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'risk') {
      return b.sepsis_risk - a.sepsis_risk
    } else if (sortBy === 'time') {
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Triage</CardTitle>
        <CardDescription>Risk-prioritized patient monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, ID, or bed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Table header */}
        {sorted.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    Bed
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    Risk Level
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    HR
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    O2/Temp
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    Last Updated
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((patient, index) => (
                    <motion.tr
                      key={patient.patient_id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                        patient.risk_level === 'RED' &&
                          'bg-red-50 dark:bg-red-900/20',
                        patient.risk_level === 'YELLOW' &&
                          'bg-yellow-50 dark:bg-yellow-900/20'
                      )}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {patient.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {patient.patient_id}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {patient.bed_number}
                      </td>
                      <td className="py-4 px-4">
                        <RiskBadge
                          level={patient.risk_level}
                          score={patient.sepsis_risk}
                          animated={false}
                        />
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {patient.vitals.HR} bpm
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        <div className="text-xs">
                          <p>{patient.vitals.O2Sat}%</p>
                          <p>{patient.vitals.Temp.toFixed(1)}°C</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {getTimeAgo(patient.last_updated)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => onPatientSelect?.(patient)}
                          className="inline-flex items-center justify-center p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {sorted.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No patients found
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

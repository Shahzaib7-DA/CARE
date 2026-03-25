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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-6 py-5">
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Patient Triage</CardTitle>
        <CardDescription className="font-medium text-slate-500">Risk-prioritized monitoring and active alerts</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {/* Search bar */}
        <div className="mb-6 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, ID, or bed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Table header */}
        {sorted.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50">
                  <th className="text-left py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    Patient
                  </th>
                  <th className="text-left py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    Bed
                  </th>
                  <th className="text-left py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    Risk Level
                  </th>
                  <th className="text-left py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    HR
                  </th>
                  <th className="text-left py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    O2/Temp
                  </th>
                  <th className="text-left py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    Last Updated
                  </th>
                  <th className="text-center py-4 px-5 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((patient, index) => {
                    // Refined Risk Visual Language System
                    const getRiskStyles = (risk: string) => {
                      switch (risk) {
                        case 'RED':
                          return 'bg-danger/5 hover:bg-danger/10 dark:bg-danger/10 dark:hover:bg-danger/20 border-danger/20 shadow-[inset_4px_0_0_rgba(239,68,68,1)]';
                        case 'YELLOW':
                          return 'bg-warning/5 hover:bg-warning/10 dark:bg-warning/10 dark:hover:bg-warning/20 border-warning/20 shadow-[inset_4px_0_0_rgba(245,158,11,1)]';
                        case 'GREEN':
                          return 'bg-success/5 hover:bg-success/10 dark:bg-success/10 dark:hover:bg-success/20 border-success/20 shadow-[inset_4px_0_0_rgba(34,197,94,1)]';
                        default:
                          return 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50';
                      }
                    }

                    return (
                      <motion.tr
                        key={patient.patient_id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onPatientSelect?.(patient)}
                        className={cn(
                          'border-b border-slate-100 dark:border-slate-800 transition-all duration-300 cursor-pointer group',
                          getRiskStyles(patient.risk_level)
                        )}
                      >
                        <td className="py-4 px-5 relative z-10">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-medical-blue dark:group-hover:text-blue-400 transition-colors">
                              {patient.name}
                            </p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {patient.patient_id}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700 dark:text-slate-300 relative z-10">
                          {patient.bed_number}
                        </td>
                        <td className="py-4 px-5 relative z-10">
                          <RiskBadge
                            level={patient.risk_level}
                            score={patient.sepsis_risk}
                            animated={patient.risk_level === 'RED'}
                          />
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-700 dark:text-slate-300 relative z-10">
                          {patient.vitals.HR} <span className="text-xs text-slate-400 font-normal">bpm</span>
                        </td>
                        <td className="py-4 px-5 text-slate-700 dark:text-slate-300 font-semibold relative z-10">
                          <div className="flex items-center gap-2">
                            <span>{patient.vitals.O2Sat}%</span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span>{patient.vitals.Temp.toFixed(1)}°C</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10">
                          {getTimeAgo(patient.last_updated)}
                        </td>
                        <td className="py-4 px-5 text-center relative z-10">
                          <div className="inline-flex items-center justify-center p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-medical-blue dark:group-hover:border-blue-500/50 group-hover:bg-medical-blue/5 dark:group-hover:bg-blue-900/30 transition-all shadow-sm">
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-medical-blue dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {sorted.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No patients match your search
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

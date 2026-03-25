export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

export interface Vital {
  HR: number
  O2Sat: number
  Temp: number
  SBP: number
  DBP: number
  MAP: number
  Resp: number
}

export interface Patient {
  patient_id: string
  sepsis_risk: number
  pattern_score: number
  risk_level: RiskLevel
  reasons: string[]
  trend: number[]
  vitals: Vital
  last_updated: string
  name: string
  age: number
  bed_number: string
  /**
   * Tracks whether patient is still active, treated, or recovering to stability.
   */
  status?: 'active' | 'treated' | 'recovering' | 'stable'
}

export interface PredictionResponse {
  patient_id: string
  sepsis_risk: number
  pattern_score: number
  risk_level: RiskLevel
  reasons: string[]
  trend: number[]
}

export interface Alert {
  id: string
  patient_id: string
  patient_name: string
  risk_level: RiskLevel
  message: string
  timestamp: string
  acknowledged: boolean
  treatmentNotes?: string
}

export interface DashboardStats {
  total_patients: number
  critical_patients: number
  warning_patients: number
  stable_patients: number
}

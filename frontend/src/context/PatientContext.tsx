import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { usePatients as useApiPatients } from '@/hooks/useApi'
import { generateSafeVitals, Vitals } from '@/lib/vitalsGenerator'

// simplified patient shape for the prototype
export type RiskLevelSimple = 'LOW' | 'MEDIUM' | 'HIGH'
export interface Patient {
  id: string
  name: string
  age: number
  bed_number: string
  riskLevel: RiskLevelSimple
  riskScore: number
  patternScore: number
  status: 'active' | 'treated' | 'recovering' | 'stable'
  last_updated: string
  alertStartTime?: number
  resolvedTime?: number
  vitals?: Vitals
  reasons?: string[]
  riskHistory?: number[]
}

interface PatientContextValue {
  patients: Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
  markPatientTreated: (id: string) => void
}

const PatientContext = createContext<PatientContextValue | undefined>(
  undefined
)

export const PatientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: apiPatients = [] } = useApiPatients()
  const [patients, setPatients] = useState<Patient[]>([])

  // map incoming API data to simplified shape
  useEffect(() => {
    if (apiPatients.length) {
      setPatients(prevPatients =>
        apiPatients.map((p) => {
          // Check if patient already exists and has been modified locally
          const existing = prevPatients.find(prev => prev.id === p.patient_id);

          if (existing && existing.status !== 'active') {
            // Preserve local state for treated/recovering/stable patients to prevent resets
            return { ...existing, last_updated: p.last_updated };
          }

          const riskLevel = p.risk_level === 'RED'
            ? 'HIGH'
            : p.risk_level === 'YELLOW'
              ? 'MEDIUM'
              : 'LOW';

          const status = (p as any).status ?? 'active'

          // If patient is active and high/medium risk, assign a simulated alertStartTime 
          // derived from when they were last updated to ensure existing prototype data works
          let alertStartTime: number | undefined = undefined;
          if (status === 'active' && riskLevel !== 'LOW') {
            alertStartTime = new Date(p.last_updated).getTime()
          }

          // Force generate safe vitals for prototype realism (never 00)
          const vitals = generateSafeVitals(riskLevel, p.vitals as any)

          // Check if API provided reasons, otherwise fallback or generate them
          const reasons = p.reasons || []
          if (reasons.length === 0 && riskLevel !== 'LOW') {
            if (vitals.heartRate > 100) reasons.push("High Heart Rate")
            if (vitals.oxygenLevel < 92) reasons.push("Low Oxygen Saturation")
            const sbp = parseInt((p.vitals as any)?.bloodPressure?.split('/')?.[0] || '120')
            if (sbp < 90) reasons.push("Low Blood Pressure")
            if (vitals.temperature > 38) reasons.push("High Temperature")
            if (reasons.length === 0) reasons.push("Elevated risk patterns")
          }

          return {
            id: p.patient_id,
            name: p.name,
            age: p.age,
            bed_number: p.bed_number,
            riskLevel,
            riskScore: p.sepsis_risk,
            patternScore: p.pattern_score ?? 0.5,
            status,
            last_updated: p.last_updated,
            alertStartTime,
            vitals,
            reasons,
          }
        })
      )
    }
  }, [apiPatients])

  // Realistic Recovery Simulation Loop (3s updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prev => prev.map(p => {
        if (p.status !== 'recovering') return p;

        let newRiskLevel = p.riskLevel;
        let newScore = Math.max(0, p.riskScore - 0.02); // grad decrease 
        let newPatternScore = Math.max(0.10, p.patternScore - 0.01);
        let newStatus: Patient['status'] = p.status;
        let updatedVitals = { ...p.vitals } as Vitals;

        // Decrease Risk Tier based on Score
        if (newScore < 0.60 && newScore >= 0.30) newRiskLevel = 'MEDIUM';
        if (newScore < 0.30) newRiskLevel = 'LOW';

        // Stabilize Vitals Smoothly
        if (newRiskLevel === 'LOW' && newScore < 0.20) {
          newStatus = 'stable';
          newScore = Math.max(newScore, 0.05); // floor at 5%
          newPatternScore = Math.max(newPatternScore, 0.05);
          updatedVitals.heartRate = 72;
          updatedVitals.oxygenLevel = 98;
          updatedVitals.temperature = 37.0;
        } else {
          // Inch closer to normal 
          if (updatedVitals.heartRate > 90) updatedVitals.heartRate -= 2;
          if (updatedVitals.oxygenLevel < 98) updatedVitals.oxygenLevel += 1;
          if (updatedVitals.temperature > 37.5) updatedVitals.temperature = Number((updatedVitals.temperature - 0.2).toFixed(1));
        }

        // Clamp Vitals to realistic constraints
        updatedVitals.heartRate = Math.min(180, Math.max(50, updatedVitals.heartRate));
        updatedVitals.oxygenLevel = Math.min(100, Math.max(80, updatedVitals.oxygenLevel));
        updatedVitals.temperature = Math.min(41, Math.max(35, updatedVitals.temperature));

        return {
          ...p,
          riskScore: newScore,
          patternScore: newPatternScore,
          riskLevel: newRiskLevel,
          status: newStatus,
          vitals: updatedVitals,
          last_updated: new Date().toISOString()
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const markPatientTreated = (id: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'recovering', resolvedTime: Date.now() } : p))
    )
  }

  return (
    <PatientContext.Provider
      value={{ patients, setPatients, markPatientTreated }}
    >
      {children}
    </PatientContext.Provider>
  )
}

export const usePatientContext = () => {
  const ctx = useContext(PatientContext)
  if (!ctx) {
    throw new Error('usePatientContext must be used within PatientProvider')
  }
  return ctx
}

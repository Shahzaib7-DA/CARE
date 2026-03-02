import { create } from 'zustand'
import type { Patient, Alert, RiskLevel } from '@/types'

interface SettingsStore {
  demoMode: boolean
  riskThresholds: {
    green: number
    yellow: number
  }
  alertsEnabled: boolean
  darkMode: boolean
  autoRefresh: boolean
  refreshInterval: number

  setDemoMode: (enabled: boolean) => void
  setThresholds: (green: number, yellow: number) => void
  setAlertsEnabled: (enabled: boolean) => void
  setDarkMode: (enabled: boolean) => void
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  demoMode: true,
  riskThresholds: {
    green: 0.3,
    yellow: 0.6,
  },
  alertsEnabled: true,
  darkMode: false,
  autoRefresh: true,
  refreshInterval: 5000,

  setDemoMode: (enabled) => set({ demoMode: enabled }),
  setThresholds: (green, yellow) =>
    set({ riskThresholds: { green, yellow } }),
  setAlertsEnabled: (enabled) => set({ alertsEnabled: enabled }),
  setDarkMode: (enabled) => set({ darkMode: enabled }),
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
}))

interface PatientStore {
  patients: Patient[]
  selectedPatient: Patient | null
  alerts: Alert[]

  setPatients: (patients: Patient[]) => void
  addPatient: (patient: Patient) => void
  updatePatient: (patientId: string, patient: Partial<Patient>) => void
  setSelectedPatient: (patient: Patient | null) => void
  setAlerts: (alerts: Alert[]) => void
  addAlert: (alert: Alert) => void
  acknowledgeAlert: (alertId: string) => void
}

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  selectedPatient: null,
  alerts: [],

  setPatients: (patients) => set({ patients }),
  addPatient: (patient) =>
    set((state) => ({
      patients: [patient, ...state.patients],
    })),
  updatePatient: (patientId, updates) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.patient_id === patientId ? { ...p, ...updates } : p
      ),
    })),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),
  acknowledgeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    })),
}))

import type { Patient, PredictionResponse, DashboardStats } from '@/types'

const API_BASE_URL = ((import.meta as any).env.VITE_API_URL as string | undefined) || 'http://localhost:8000'
const API_TIMEOUT = 30000 // 30 seconds

// Error types for better error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Helper function to make API calls with timeout and error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData?.detail || `API Error: ${response.statusText}`,
        response.status
      )
    }

    return await response.json() as T
  } catch (error) {
    if (error instanceof APIError) throw error

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new APIError(
        `Cannot reach API server at ${API_BASE_URL}. Is the backend running?`,
        undefined,
        error
      )
    }

    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      error instanceof Error ? error : undefined
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

// Health check endpoints
export const healthService = {
  async check(): Promise<{ status: string; version: string; services: Record<string, string> }> {
    return fetchAPI('/api/health')
  },

  async ping(): Promise<{ message: string }> {
    return fetchAPI('/api/ping')
  },
}

// Type definitions for prediction request
export interface PredictionRequest {
  patient_id: string
  heart_rate: number
  spo2: number
  temperature: number
  bp_sys: number
  bp_dia: number
  resp_rate: number
}

export interface BatchPredictionRequest {
  patients: PredictionRequest[]
}

// Predictions endpoints
export const predictionService = {
  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    return fetchAPI('/api/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async batchPredict(data: BatchPredictionRequest): Promise<{
    predictions: PredictionResponse[]
    total: number
  }> {
    return fetchAPI('/api/batch-predict', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getPatientHistory(patientId: string): Promise<{
    patient_id: string
    history: number[]
    count: number
  }> {
    return fetchAPI(`/api/patients/${patientId}/history`)
  },
}

// Mock patient data for demo (used when backend is unavailable)
const MOCK_PATIENTS: Patient[] = [
  {
    patient_id: 'P001',
    name: 'James Mitchell',
    age: 67,
    bed_number: '301',
    sepsis_risk: 0.78,
    pattern_score: 0.82,
    risk_level: 'RED',
    reasons: ['High Temperature', 'Elevated Heart Rate', 'Low Blood Pressure'],
    trend: [0.45, 0.52, 0.68, 0.75, 0.78],
    vitals: {
      HR: 118,
      O2Sat: 91,
      Temp: 39.2,
      SBP: 95,
      DBP: 62,
      MAP: 73,
      Resp: 24,
    },
    last_updated: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    patient_id: 'P002',
    name: 'Margaret Chen',
    age: 54,
    bed_number: '302',
    sepsis_risk: 0.52,
    pattern_score: 0.48,
    risk_level: 'YELLOW',
    reasons: ['Elevated Heart Rate', 'High Respiratory Rate'],
    trend: [0.32, 0.38, 0.45, 0.50, 0.52],
    vitals: {
      HR: 102,
      O2Sat: 94,
      Temp: 37.8,
      SBP: 112,
      DBP: 74,
      MAP: 87,
      Resp: 20,
    },
    last_updated: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    patient_id: 'P003',
    name: 'Robert Johnson',
    age: 72,
    bed_number: '303',
    sepsis_risk: 0.85,
    pattern_score: 0.88,
    risk_level: 'RED',
    reasons: ['Low Oxygen', 'High Temperature', 'Low Blood Pressure', 'High Heart Rate'],
    trend: [0.62, 0.70, 0.77, 0.82, 0.85],
    vitals: {
      HR: 125,
      O2Sat: 88,
      Temp: 39.5,
      SBP: 92,
      DBP: 58,
      MAP: 69,
      Resp: 26,
    },
    last_updated: new Date(Date.now() - 60000).toISOString(),
  },
  {
    patient_id: 'P004',
    name: 'Sarah Williams',
    age: 45,
    bed_number: '304',
    sepsis_risk: 0.22,
    pattern_score: 0.18,
    risk_level: 'GREEN',
    reasons: [],
    trend: [0.18, 0.19, 0.20, 0.21, 0.22],
    vitals: {
      HR: 78,
      O2Sat: 98,
      Temp: 36.8,
      SBP: 128,
      DBP: 82,
      MAP: 97,
      Resp: 16,
    },
    last_updated: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    patient_id: 'P005',
    name: 'David Brown',
    age: 58,
    bed_number: '305',
    sepsis_risk: 0.41,
    pattern_score: 0.35,
    risk_level: 'YELLOW',
    reasons: ['Elevated Temperature'],
    trend: [0.28, 0.32, 0.36, 0.39, 0.41],
    vitals: {
      HR: 92,
      O2Sat: 96,
      Temp: 38.3,
      SBP: 118,
      DBP: 76,
      MAP: 90,
      Resp: 18,
    },
    last_updated: new Date(Date.now() - 7 * 60000).toISOString(),
  },
  {
    patient_id: 'P006',
    name: 'Linda Garcia',
    age: 62,
    bed_number: '306',
    sepsis_risk: 0.28,
    pattern_score: 0.24,
    risk_level: 'GREEN',
    reasons: [],
    trend: [0.15, 0.18, 0.22, 0.25, 0.28],
    vitals: {
      HR: 72,
      O2Sat: 97,
      Temp: 37.2,
      SBP: 132,
      DBP: 84,
      MAP: 100,
      Resp: 15,
    },
    last_updated: new Date(Date.now() - 9 * 60000).toISOString(),
  },
]

// Data service (real backend with mock fallback)
export const dataService = {
  async getPatients(riskLevel?: string): Promise<Patient[]> {
    try {
      // Call real backend endpoint
      const response = await fetchAPI<{ success: boolean; data: Patient[] }>('/api/patients' + (riskLevel ? `?risk_level=${riskLevel}` : ''))
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Invalid response format')
    } catch (error) {
      // Fallback to mock data when backend is unavailable
      console.warn('Backend unavailable, using mock patient data:', error)
      if (riskLevel) {
        return MOCK_PATIENTS.filter((p) => p.risk_level === riskLevel)
      }
      return MOCK_PATIENTS
    }
  },

  async getPatient(patientId: string): Promise<Patient | null> {
    try {
      const response = await fetchAPI<{ success: boolean; data: Patient }>(`/api/patients/${patientId}`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Invalid response format')
    } catch (error) {
      console.warn('Backend unavailable, using mock patient:', error)
      const patient = MOCK_PATIENTS.find((p) => p.patient_id === patientId)
      return patient || null
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetchAPI<{ success: boolean; data: DashboardStats }>('/api/dashboard/stats')
      if (response.success && response.data) {
        return response.data
      }
      throw new Error('Invalid response format')
    } catch (error) {
      console.warn('Backend unavailable, computing stats from mock data:', error)
      const patients = MOCK_PATIENTS
      return {
        total_patients: patients.length,
        critical_patients: patients.filter((p) => p.risk_level === 'RED').length,
        warning_patients: patients.filter((p) => p.risk_level === 'YELLOW').length,
        stable_patients: patients.filter((p) => p.risk_level === 'GREEN').length,
      }
    }
  },
}

// Export API service for backward compatibility
export const apiService = {
  healthService,
  predictionService,
  dataService,
}

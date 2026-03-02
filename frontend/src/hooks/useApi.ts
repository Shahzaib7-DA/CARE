import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import type { Patient, DashboardStats } from '@/types'

export const QUERY_KEYS = {
  patients: ['patients'],
  patient: (id: string) => ['patient', id],
  stats: ['dashboard-stats'],
}

export function usePatients(riskLevel?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.patients, riskLevel],
    queryFn: () => apiService.dataService.getPatients(riskLevel),
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 2000,
  })
}

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patient(patientId),
    queryFn: () => apiService.dataService.getPatient(patientId),
    enabled: !!patientId,
    refetchInterval: 5000, // poll every 5 seconds so the detail view stays fresh
    staleTime: 2000,
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => apiService.dataService.getDashboardStats(),
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    staleTime: 5000,
  })
}

export function useRefreshPatients() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients })
}

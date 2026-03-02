import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { predictionService, PredictionRequest, APIError } from '@/services/api'
import type { PredictionResponse } from '@/types'

// Query keys for caching
export const predictionKeys = {
  all: ['predictions'] as const,
  list: () => [...predictionKeys.all, 'list'] as const,
  history: (patientId: string) => [...predictionKeys.all, 'history', patientId] as const,
}

/**
 * Hook for fetching patient prediction history
 */
export const usePredictionHistory = (patientId: string) => {
  return useQuery({
    queryKey: predictionKeys.history(patientId),
    queryFn: () => predictionService.getPatientHistory(patientId),
    enabled: !!patientId, // Only run if patientId is provided
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  })
}

/**
 * Hook for making a single prediction
 */
export const usePrediction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PredictionRequest) => predictionService.predict(data),
    onSuccess: (data) => {
      // Invalidate history for this patient
      queryClient.invalidateQueries({
        queryKey: predictionKeys.history(data.patient_id),
      })
    },
    onError: (error: Error) => {
      console.error('Prediction error:', error)
    },
  })
}

/**
 * Hook for batch predictions
 */
export const useBatchPrediction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patients: PredictionRequest[]) =>
      predictionService.batchPredict({ patients }),
    onSuccess: (_data) => {
      // Invalidate all prediction queries
      queryClient.invalidateQueries({
        queryKey: predictionKeys.all,
      })
    },
  })
}

/**
 * Hook for handling prediction with loading and error states
 */
export const usePredictionWithState = (
  onSuccess?: (data: PredictionResponse) => void,
  onError?: (error: APIError) => void
) => {
  const mutation = useMutation({
    mutationFn: (data: PredictionRequest) => predictionService.predict(data),
    onSuccess: (data) => {
      onSuccess?.(data)
    },
    onError: (error: any) => {
      const apiError = error instanceof APIError 
        ? error 
        : new APIError('Unknown error occurred')
      onError?.(apiError)
    },
  })

  return {
    predict: mutation.mutate,
    predictAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as APIError | null,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
  }
}

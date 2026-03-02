import { useState, useEffect } from 'react'
import { healthService, APIError } from '@/services/api'

export interface ConnectionStatus {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  backendUrl: string
  lastChecked: Date | null
}

export const useBackendConnection = (autoCheck = true) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isLoading: false,
    error: null,
    backendUrl: ((import.meta as any).env.VITE_API_URL as string | undefined) || 'http://localhost:8000',
    lastChecked: null,
  })

  const checkConnection = async () => {
    setStatus((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await healthService.check()
      setStatus({
        isConnected: true,
        isLoading: false,
        error: null,
        backendUrl: status.backendUrl,
        lastChecked: new Date(),
      })
      return true
    } catch (error) {
      const message =
        error instanceof APIError
          ? error.message
          : 'Failed to connect to backend'

      setStatus({
        isConnected: false,
        isLoading: false,
        error: message,
        backendUrl: status.backendUrl,
        lastChecked: new Date(),
      })
      return false
    }
  }

  useEffect(() => {
    if (autoCheck) {
      // Check connection on mount
      checkConnection()

      // Set up periodic checks every 30 seconds
      const interval = setInterval(checkConnection, 30000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [autoCheck])

  return { ...status, checkConnection }
}

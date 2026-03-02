import React from 'react'
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import { useBackendConnection } from '@/hooks/useBackendConnection'

/**
 * Backend Connection Status Component
 * 
 * Displays the connection status to the FastAPI backend.
 * Shows real-time health check results.
 */
export const BackendStatus: React.FC = () => {
  const connection = useBackendConnection(true)

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
      {connection.isLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-slate-600">Checking...</span>
        </>
      ) : connection.isConnected ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Backend Online</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">Backend Offline</span>
        </>
      )}

      {connection.error && (
        <div className="ml-2 text-xs text-slate-500">
          {connection.error}
        </div>
      )}

      <button
        onClick={() => connection.checkConnection()}
        disabled={connection.isLoading}
        className="ml-auto text-xs text-slate-600 hover:text-slate-900 disabled:opacity-50"
      >
        Retry
      </button>
    </div>
  )
}

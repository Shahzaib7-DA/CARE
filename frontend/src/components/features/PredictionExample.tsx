import React, { useState } from 'react'
import { predictionService, APIError } from '@/services/api'
import type { PredictionResponse } from '@/types'
import { AlertCircle, Loader, Send } from 'lucide-react'

/**
 * Example component showing how to use the prediction service
 * Demonstrates:
 * - API calls with error handling
 * - Loading states
 * - Error display
 */
export const PredictionExample: React.FC = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await predictionService.predict({
        patient_id: 'P001',
        heart_rate: 118,
        spo2: 91,
        temperature: 39.2,
        bp_sys: 95,
        bp_dia: 62,
        resp_rate: 24,
      })

      setResult(response)
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Prediction failed'
      setError(message)
      console.error('Prediction error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-lg mb-4">Test Prediction API</h3>

        <button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Test Prediction
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Risk Level:</span>
              <span
                className={`font-semibold ${
                  result.risk_level === 'RED'
                    ? 'text-red-600'
                    : result.risk_level === 'YELLOW'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }`}
              >
                {result.risk_level}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Sepsis Risk:</span>
              <span className="font-semibold">{(result.sepsis_risk * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Pattern Score:</span>
              <span className="font-semibold">{(result.pattern_score * 100).toFixed(1)}%</span>
            </div>
            {result.reasons.length > 0 && (
              <div className="text-sm">
                <span className="text-slate-600">Reasons:</span>
                <ul className="mt-1 space-y-1">
                  {result.reasons.map((reason) => (
                    <li key={reason} className="text-slate-700 ml-2">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

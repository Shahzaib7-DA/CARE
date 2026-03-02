import { useState } from 'react'
import { useSettingsStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Toggle, Sliders } from 'lucide-react'

export function SettingsPage() {
  const {
    demoMode,
    riskThresholds,
    alertsEnabled,
    darkMode,
    autoRefresh,
    setDemoMode,
    setThresholds,
    setAlertsEnabled,
    setDarkMode,
    setAutoRefresh,
  } = useSettingsStore()

  const [greenThreshold, setGreenThreshold] = useState(riskThresholds.green)
  const [yellowThreshold, setYellowThreshold] = useState(riskThresholds.yellow)

  const handleApplyThresholds = () => {
    setThresholds(greenThreshold, yellowThreshold)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">
          Configure system behavior and risk thresholds
        </p>
      </div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>General system settings and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Mode */}
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-slate-900">Demo Mode</p>
                <p className="text-sm text-slate-500">
                  Use simulated patient data for testing
                </p>
              </div>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  demoMode ? 'bg-medical-blue' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    demoMode ? 'translate-x-7' : 'translate-x-1'
                  } mt-1`}
                />
              </button>
            </div>

            {/* Auto Refresh */}
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border-t border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Auto Refresh</p>
                <p className="text-sm text-slate-500">
                  Automatically update patient data
                </p>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  autoRefresh ? 'bg-medical-blue' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    autoRefresh ? 'translate-x-7' : 'translate-x-1'
                  } mt-1`}
                />
              </button>
            </div>

            {/* Alerts */}
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border-t border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Alerts Enabled</p>
                <p className="text-sm text-slate-500">
                  Receive high-risk patient notifications
                </p>
              </div>
              <button
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`relative inline-flex h-8 w-14 rounded-full transition-colors ${
                  alertsEnabled ? 'bg-medical-blue' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    alertsEnabled ? 'translate-x-7' : 'translate-x-1'
                  } mt-1`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Risk Thresholds</CardTitle>
            <CardDescription>
              Adjust the risk score cutoffs for patient classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Green Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-slate-900">
                  <span className="inline-block w-3 h-3 bg-risk-green rounded-full mr-2" />
                  Green Risk Threshold
                </label>
                <span className="text-lg font-bold text-slate-900">
                  {(greenThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={greenThreshold}
                onChange={(e) => setGreenThreshold(Number(e.target.value))}
                className="w-full accent-risk-green"
              />
              <p className="text-xs text-slate-500">
                Score below this level = Stable
              </p>
            </div>

            {/* Yellow Threshold */}
            <div className="space-y-3 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <label className="font-medium text-slate-900">
                  <span className="inline-block w-3 h-3 bg-risk-yellow rounded-full mr-2" />
                  Yellow Risk Threshold
                </label>
                <span className="text-lg font-bold text-slate-900">
                  {(yellowThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={yellowThreshold}
                onChange={(e) => setYellowThreshold(Number(e.target.value))}
                className="w-full accent-risk-yellow"
              />
              <p className="text-xs text-slate-500">
                Score between Green and Yellow = Warning
              </p>
              <p className="text-xs text-slate-500">
                Score above Yellow = Critical
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button onClick={handleApplyThresholds} variant="default">
                Apply Changes
              </Button>
              <Button variant="outline" onClick={() => {
                setGreenThreshold(0.3)
                setYellowThreshold(0.6)
              }}>
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Connect your backend inference server</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Backend API URL
              </label>
              <input
                type="url"
                placeholder="http://localhost:8000"
                defaultValue="http://localhost:8000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue"
              />
              <p className="text-xs text-slate-500 mt-1">
                Set environment variable VITE_API_URL
              </p>
            </div>
            <Button variant="secondary">Test Connection</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">CareMind Clinical Risk Dashboard</h3>
            <p className="text-sm text-slate-600">
              Version 1.0.0 • AI-powered sepsis risk monitoring system
            </p>
            <p className="text-xs text-slate-500 mt-3">
              © 2026 CareMind Health Systems. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

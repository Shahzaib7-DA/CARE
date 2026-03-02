import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { testAPIIntegration, stressTest, generateTestPatient, DebugPanel, logEnvironmentInfo } from './lib/apiDebugUtils'

// Expose debug utilities to window for development
if ((import.meta as any).env.DEV) {
  const w = window as any
  w.testAPIIntegration = testAPIIntegration
  w.stressTest = stressTest
  w.generateTestPatient = generateTestPatient
  w.DebugPanel = DebugPanel
  w.logEnvironmentInfo = logEnvironmentInfo
  
  console.log('🧪 Debug utilities available:')
  console.log('  • DebugPanel.open()')
  console.log('  • await testAPIIntegration()')
  console.log('  • await stressTest(50)')
  console.log('  • generateTestPatient()')
  console.log('  • logEnvironmentInfo()')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

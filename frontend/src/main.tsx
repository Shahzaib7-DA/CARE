import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { testAPIIntegration, stressTest, generateTestPatient, DebugPanel, logEnvironmentInfo } from './lib/apiDebugUtils'

// Create React Query client
const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
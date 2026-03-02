/**
 * API Development Utilities
 * 
 * Helpers for testing and debugging API integration
 */

import { predictionService, healthService } from '@/services/api'

/**
 * Test the complete API integration
 */
export async function testAPIIntegration() {
  console.log('🧪 Testing API Integration...\n')

  try {
    // 1. Test health check
    console.log('1️⃣ Testing health check...')
    const health = await healthService.check()
    console.log('✅ Health check passed:', health)

    // 2. Test single prediction
    console.log('\n2️⃣ Testing single prediction...')
    const prediction = await predictionService.predict({
      patient_id: 'TEST_P001',
      heart_rate: 118,
      spo2: 91,
      temperature: 39.2,
      bp_sys: 95,
      bp_dia: 62,
      resp_rate: 24,
    })
    console.log('✅ Prediction successful:', prediction)

    // 3. Test batch prediction
    console.log('\n3️⃣ Testing batch prediction...')
    const batch = await predictionService.batchPredict({
      patients: [
        {
          patient_id: 'TEST_P001',
          heart_rate: 118,
          spo2: 91,
          temperature: 39.2,
          bp_sys: 95,
          bp_dia: 62,
          resp_rate: 24,
        },
        {
          patient_id: 'TEST_P002',
          heart_rate: 92,
          spo2: 96,
          temperature: 37.5,
          bp_sys: 120,
          bp_dia: 75,
          resp_rate: 18,
        },
      ],
    })
    console.log('✅ Batch prediction successful:', batch)

    // 4. Test patient history
    console.log('\n4️⃣ Testing patient history...')
    const history = await predictionService.getPatientHistory('TEST_P001')
    console.log('✅ Patient history retrieved:', history)

    console.log('\n✨ All tests passed!')
    return { success: true }
  } catch (error) {
    console.error('❌ Test failed:', error)
    return { success: false, error }
  }
}

/**
 * Generate test patient data
 */
export function generateTestPatient(index: number = 1) {
  return {
    patient_id: `TEST_P${String(index).padStart(3, '0')}`,
    heart_rate: 75 + Math.random() * 50,
    spo2: 94 + Math.random() * 5,
    temperature: 36.8 + Math.random() * 3,
    bp_sys: 110 + Math.random() * 30,
    bp_dia: 70 + Math.random() * 20,
    resp_rate: 16 + Math.random() * 10,
  }
}

/**
 * Generate batch of test patients
 */
export function generateTestPatientBatch(count: number = 5) {
  return Array.from({ length: count }, (_, i) => generateTestPatient(i + 1))
}

/**
 * Format API response for debugging
 */
export function formatPredictionResult(result: any): string {
  return `
Patient: ${result.patient_id}
Risk Level: ${result.risk_level}
Sepsis Risk: ${(result.sepsis_risk * 100).toFixed(1)}%
Pattern Score: ${(result.pattern_score * 100).toFixed(1)}%
Reasons: ${result.reasons.join(', ') || 'None'}
Trend (last 5): ${result.trend.map((r: number) => (r * 100).toFixed(0)).join('% → ')}%
  `.trim()
}

/**
 * Test with stress load
 */
export async function stressTest(numRequests: number = 10) {
  console.log(`🔥 Starting stress test with ${numRequests} concurrent requests...\n`)

  const start = performance.now()
  const promises = Array.from({ length: numRequests }, async (_, i) => {
    try {
      return await predictionService.predict(generateTestPatient(i))
    } catch (error) {
      return { error: true, message: (error as Error).message }
    }
  })

  const results = await Promise.all(promises)
  const end = performance.now()

  const successful = results.filter((r) => r && typeof r === 'object' && 'sepsis_risk' in r).length
  const failed = results.filter((r) => r && typeof r === 'object' && 'error' in r).length

  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏱️ Total time: ${(end - start).toFixed(2)}ms`)
  console.log(`📊 Average time per request: ${((end - start) / numRequests).toFixed(2)}ms`)

  return { successful, failed, totalTime: end - start }
}

/**
 * Log API environment info
 */
export function logEnvironmentInfo() {
  const apiUrl = ((import.meta as any).env.VITE_API_URL as string | undefined) || 'http://localhost:8000'
  const env = ((import.meta as any).env.MODE as string | undefined)

  console.log('📋 Environment Configuration:')
  console.log(`  API URL: ${apiUrl}`)
  console.log(`  Mode: ${env}`)
  console.log(`  Timeout: 30000ms`)
  console.log('')
}

/**
 * Create a debug panel (for development)
 */
export const DebugPanel = {
  open() {
    console.log(`
╔════════════════════════════════════════════════════════╗
║          CareMind API Debug Panel                       ║
╠════════════════════════════════════════════════════════╣
║ Available commands:                                     ║
║  • testAPIIntegration() - Run all API tests            ║
║  • generateTestPatient(i) - Create test patient        ║
║  • stressTest(n) - Run stress test with n requests     ║
║  • logEnvironmentInfo() - Show config                  ║
║                                                         ║
║ Examples:                                               ║
║  > await testAPIIntegration()                          ║
║  > const p = generateTestPatient()                     ║
║  > await stressTest(50)                                ║
╚════════════════════════════════════════════════════════╝
    `)

    // Make functions globally available during development
    if (window instanceof Window) {
      const w = window as any
      w.testAPIIntegration = testAPIIntegration
      w.generateTestPatient = generateTestPatient
      w.stressTest = stressTest
      w.logEnvironmentInfo = logEnvironmentInfo
      w.formatPredictionResult = formatPredictionResult
    }
  },
}

// Auto-open in development
if (((import.meta as any).env.DEV as boolean | undefined)) {
  console.log('💡 Tip: Open debug panel with: DebugPanel.open()')
}

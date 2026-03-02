import { type RiskLevel } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(
  riskLevel: RiskLevel
): 'green' | 'yellow' | 'red' | 'slate' {
  switch (riskLevel) {
    case 'GREEN':
      return 'green'
    case 'YELLOW':
      return 'yellow'
    case 'RED':
      return 'red'
    default:
      return 'slate'
  }
}

export function getRiskBgColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'GREEN':
      return 'bg-green-50'
    case 'YELLOW':
      return 'bg-yellow-50'
    case 'RED':
      return 'bg-red-50'
    default:
      return 'bg-slate-50'
  }
}

export function getRiskBadgeColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'GREEN':
      return 'bg-green-100 text-green-800'
    case 'YELLOW':
      return 'bg-yellow-100 text-yellow-800'
    case 'RED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

export function getRiskTextColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'GREEN':
      return 'text-green-700'
    case 'YELLOW':
      return 'text-yellow-700'
    case 'RED':
      return 'text-red-700'
    default:
      return 'text-slate-700'
  }
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'short') {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.round((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function formatRiskScore(score: number): string {
  return `${(score * 100).toFixed(0)}%`
}

export function formatVitalValue(
  value: number,
  unit: string,
  precision: number = 1
): string {
  return `${value.toFixed(precision)} ${unit}`
}

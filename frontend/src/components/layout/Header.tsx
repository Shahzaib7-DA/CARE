import { Bell, Settings, Menu } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { usePatientStore } from '@/store'

export function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const alerts = usePatientStore((s) => s.alerts)
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Care<span className="text-medical-blue">Mind</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Alerts button */}
          <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {unacknowledgedAlerts > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-risk-red text-white text-xs">
                {unacknowledgedAlerts}
              </Badge>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* User avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-medical-blue flex items-center justify-center text-white text-sm font-semibold">
            CM
          </div>
        </div>
      </div>
    </header>
  )
}

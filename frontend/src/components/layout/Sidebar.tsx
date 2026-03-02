import { useLocation, useNavigate } from 'react-router-dom'
import { Activity, Users, AlertCircle, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: Activity, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Patients', path: '/dashboard/patients' },
  { icon: AlertCircle, label: 'Alerts', path: '/dashboard/alerts' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Care</h2>
            <p className="text-xs text-medical-blue font-semibold">Mind</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                isActive
                  ? 'bg-medical-blue text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className="font-semibold mb-1">System Status</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-risk-green rounded-full animate-pulse" />
            Connected
          </p>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

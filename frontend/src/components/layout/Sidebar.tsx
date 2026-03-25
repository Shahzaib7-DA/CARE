import { useLocation, useNavigate } from 'react-router-dom'
import { Activity, Users, AlertCircle, Settings, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 shadow-2xl z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-white/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-ai rounded-xl flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.5)]">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg tracking-tight leading-tight">Care<span className="text-accent font-semibold relative"><span className="absolute inset-0 bg-accent blur-md opacity-40"></span>Mind</span></h2>
            <p className="text-xs text-slate-400 font-medium">Risk Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium relative group overflow-hidden',
                isActive
                  ? 'bg-medical-blue/10 dark:bg-medical-blue/20 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              )}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-accent rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.8)]"
                />
              )}

              <Icon className={cn("w-5 h-5 transition-colors duration-300", isActive ? "text-accent drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" : "group-hover:text-slate-300")} />
              <span className="tracking-wide">{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 dark:border-white/5 space-y-4">
        {/* System Status Pill */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-xl border border-white/5 shadow-inner backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            </span>
            <span className="text-xs font-semibold text-slate-300">System Online</span>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

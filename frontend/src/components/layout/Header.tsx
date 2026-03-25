import { Bell, Settings, Menu, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { usePatientStore } from '@/store'
import { useAuthStore } from '@/store/authStore'

export function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const alerts = usePatientStore((s) => s.alerts)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length

  // Get user initials
  const userInitials = user?.doctor?.name
    ? user.doctor.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
    : 'CM'

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-md dark:shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white md:hidden">
            Care<span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue to-cyan-500">Mind</span>
          </h1>
        </div>

        {/* Global AI Status Bar */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300">
              AI Engine: <span className="font-semibold text-slate-900 dark:text-white">Active</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span>Last Prediction: 2m ago</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span>Data Stream: <span className="text-green-600 dark:text-green-400 font-medium">Connected</span></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Alerts button */}
          <button
            onClick={() => navigate('/dashboard/alerts')}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
            title="Alerts and Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {unacknowledgedAlerts > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-risk-red to-orange-500 text-white text-xs font-bold shadow-lg">
                {unacknowledgedAlerts}
              </Badge>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* User avatar with dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-blue to-cyan-500 flex items-center justify-center text-white text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
              title={user?.doctor?.name || 'User'}
            >
              {userInitials}
            </button>

            {/* User menu dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-600 bg-gradient-to-r from-medical-blue to-cyan-500 text-white">
                  <p className="text-sm font-semibold">
                    {user?.doctor?.name || 'User'}
                  </p>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Role: {user?.doctor?.specialization || 'Doctor'}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2 border-t border-slate-200 dark:border-slate-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

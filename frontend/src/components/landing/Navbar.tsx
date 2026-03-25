import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Menu, X, LogOut, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useDarkMode } from '@/hooks/useDarkMode'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { isDark, toggle } = useDarkMode()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Care</span>
            <span className="text-medical-blue font-bold">Mind</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/roadmap" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Roadmap</Link>
          </div>
          <div className="flex items-center gap-3">
            {/* theme toggle */}
            <button
              onClick={toggle}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <p className="font-medium text-slate-900 dark:text-white">{user.doctor.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.hospital.hospitalName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className="w-6 h-6 text-slate-900 dark:text-white" />
          ) : (
            <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200/50 p-4 space-y-4">
          {/* Page links */}
          <div className="space-y-1">
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium">
              About
            </Link>
            <Link to="/roadmap" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium">
              Roadmap
            </Link>
          </div>

          {/* theme toggle */}
          <button
            onClick={() => { toggle(); setMobileOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div className="space-y-2 pt-4 border-t">
            <Link to="/login" className="block">
              <Button size="sm" className="w-full">
                Sign In / Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

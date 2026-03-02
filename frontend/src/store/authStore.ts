import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HospitalInfo {
  hospitalName: string
  address: string
  city: string
  country: string
  hospitalId: string
}

export interface DoctorInfo {
  name: string
  email: string
  licenseNumber: string
  specialization: string
  department: string
}

export interface AuthUser {
  hospital: HospitalInfo
  doctor: DoctorInfo
  isAuthenticated: boolean
  loginTime: string
}

interface AuthStore {
  user: AuthUser | null
  setUser: (user: AuthUser) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: AuthUser) => {
        set({
          user: {
            ...user,
            isAuthenticated: true,
            loginTime: new Date().toISOString(),
          },
        })
      },
      logout: () => set({ user: null }),
      isAuthenticated: () => {
        const state = get()
        return state.user?.isAuthenticated ?? false
      },
    }),
    {
      name: 'caremind-auth',
    }
  )
)

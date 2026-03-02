# Quick Reference Guide

## 🚀 Start Development

```bash
# First time setup
npm install
npm run dev

# Open browser at http://localhost:5173
```

## 📦 Available Commands

```bash
npm run dev       # Start dev server (hot reload)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## ⚙️ Configuration

### API URL
Edit `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

### Port (if 5173 is in use)
```bash
npm run dev -- --port 3000
```

### Risk Thresholds
In `src/store/index.ts`:
```typescript
riskThresholds: {
  green: 0.3,    // Change to 0.4
  yellow: 0.6,   // Change to 0.7
}
```

### Colors
In `tailwind.config.js`:
```javascript
colors: {
  'risk-green': '#10b981',
  'risk-red': '#ef4444',
}
```

## 📁 Project Layout Quick Links

| Path | Purpose |
|------|---------|
| `src/pages/` | Page components (Dashboard, Settings, etc) |
| `src/components/` | Reusable UI components |
| `src/hooks/` | Custom React hooks |
| `src/store/` | Zustand global state |
| `src/services/` | API client + mock data |
| `src/lib/` | Utilities & helpers |
| `src/types/` | TypeScript interfaces |

## 🔌 API Endpoints (Mock)

Current mock implementation. Switch to real endpoints in `src/services/api.ts`.

```
GET /patients                    → Patient list
GET /patients/:patientId         → Single patient
GET /dashboard-stats             → Stats
POST /predict                    → Single prediction
POST /batch_predict              → Batch predictions
POST /summary                    → Clinical summary
```

## 🎨 UI Components

### Pre-built Components
- `Button` - Interactive button
- `Card` - Content container
- `Badge` - Status label
- `RiskBadge` - Risk level indicator
- `StatCard` - KPI display
- `PatientTable` - Patient roster
- `TrendChart` - Line chart

### Example Usage
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onClick={handleClick}>Click Me</Button>
  </CardContent>
</Card>
```

## 🪝 Hooks

### Data Fetching
```tsx
import { usePatients, usePatient, useDashboardStats } from '@/hooks'

const { data: patients, isLoading } = usePatients()
const { data: patient } = usePatient(patientId)
const { data: stats } = useDashboardStats()
```

### UI
```tsx
import { useCountUp, useModal, useDebounce } from '@/hooks'

const count = useCountUp(100)  // Animate to 100
const { isOpen, open, close } = useModal()
const debouncedValue = useDebounce(value, 500)
```

### State
```tsx
import { useSettingsStore, usePatientStore } from '@/store'

const { demoMode, setDemoMode } = useSettingsStore()
const { patients, selectedPatient } = usePatientStore()
```

## 🎨 Styling

### Using Tailwind
```tsx
<div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
  <h2 className="text-lg font-bold text-slate-900">Title</h2>
  <p className="text-sm text-slate-600">Description</p>
</div>
```

### Risk Colors
```
Green:  bg-risk-green / text-risk-green
Yellow: bg-risk-yellow / text-risk-yellow
Red:    bg-risk-red / text-risk-red
Blue:   bg-medical-blue / text-medical-blue
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col mobile, 2 col tablet, 4 col desktop */}
</div>
```

### Animation Classes
```tsx
<div className="animate-fade-in">Fades in</div>
<div className="animate-risk-pulse">Pulses when critical</div>
<div className="animate-pulse">Standard pulse</div>
```

## 🔧 Common Tasks

### Add New Mock Patient
Edit `src/services/api.ts`:
```typescript
MOCK_PATIENTS.push({
  patient_id: 'P007',
  name: 'New Patient',
  age: 55,
  bed_number: '307',
  sepsis_risk: 0.45,
  pattern_score: 0.40,
  risk_level: 'YELLOW',
  reasons: ['High Temperature'],
  trend: [0.25, 0.30, 0.40, 0.42, 0.45],
  vitals: {
    HR: 95,
    O2Sat: 95,
    Temp: 38.2,
    SBP: 115,
    DBP: 75,
    MAP: 88,
    Resp: 18,
  },
  last_updated: new Date().toISOString(),
})
```

### Add New Page
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add nav item in `src/components/layout/Sidebar.tsx`

### Add New Store State
Edit `src/store/index.ts`:
```typescript
interface MyStore {
  myValue: string
  setMyValue: (value: string) => void
}

export const useMyStore = create<MyStore>((set) => ({
  myValue: 'default',
  setMyValue: (value) => set({ myValue: value }),
}))
```

### Update Risk Thresholds
In `src/store/index.ts`:
```typescript
riskThresholds: {
  green: 0.3,   // 0-30% = Green
  yellow: 0.6,  // 30-60% = Yellow
                 // 60%+ = Red
}
```

## 🐛 Debug Mode

### Enable Query Logging
In `src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query'
import { notifyManager } from '@tanstack/react-query'

notifyManager.setNotifyFunction((notification) => {
  console.log('[React Query]', notification)
})
```

### Inspect Zustand Store
Open browser console:
```javascript
window?.useSettingsStore?.getState()
window?.usePatientStore?.getState()
```

### View Network Requests
DevTools → Network tab
Filter by `/predict`, `/batch_predict`

## 📈 Performance Tips

- ✅ Rebuild: `npm run build` checks bundle size
- ✅ Lazy load pages using React.lazy()
- ✅ Memoize expensive components
- ✅ Use React Query for caching
- ✅ Debounce search inputs (already done)

## 🚢 Deploy to Production

### Build
```bash
npm run build
```

### Deploy Folder
Upload contents of `dist/` folder to:
- Vercel
- Netlify
- AWS S3
- Any static host

### Environment Variables
Set in production hosting:
```
VITE_API_URL=https://your-api.com
```

## 💡 Pro Tips

### Speed Up Dev
```bash
npm run dev -- --watch  # Faster rebuilds
```

### Kill Port Process
```bash
# Mac/Linux
lsof -ti :5173 | xargs kill

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Clear Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Update Dependencies
```bash
npm outdated              # See what's outdated
npm update               # Update to compatible versions
npm update --save-dev    # Update dev dependencies
```

## 📞 Support Resources

- React: https://react.dev/learn
- Vite: https://vitejs.dev/guide/
- TailwindCSS: https://tailwindcss.com/docs
- React Query: https://tanstack.com/query/latest
- Zustand: https://github.com/pmndrs/zustand

---

**Remember: The project is fully typed and configured. Just focus on building features! 🎉**

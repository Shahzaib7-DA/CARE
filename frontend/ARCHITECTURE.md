# CareMind Architecture & Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Hierarchy](#component-hierarchy)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Adding Features](#adding-features)
6. [Styling System](#styling-system)
7. [Performance Optimization](#performance-optimization)

---

## Architecture Overview

### High-Level Flow
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐      ┌──────────────────┐         │
│  │   Components     │      │   Pages          │         │
│  │  (UI Primitives) │      │ (Feature Screens)│         │
│  └────────┬─────────┘      └────────┬─────────┘         │
│           │                          │                   │
│  ┌────────▼──────────────────────────▼─────────┐        │
│  │            Custom Hooks (useApi, useUI)     │        │
│  └────────┬───────────────────────────┬────────┘        │
│           │                           │                  │
│  ┌────────▼──────┐     ┌──────────────▼───────┐         │
│  │ React Query   │     │ Zustand Store        │         │
│  │ (Server)      │     │ (Client)             │         │
│  └────────┬──────┘     └──────────────┬───────┘         │
│           │                           │                  │
│  ┌────────▼───────────────────────────▼─────────┐       │
│  │      API Service Layer                       │       │
│  │  - Mock data (development)                   │       │
│  │  - Real backend calls (production)           │       │
│  └────────┬───────────────────────────┬─────────┘       │
│           │                           │                  │
│  ┌────────▼───────────────────────────▼─────────┐       │
│  │      External Services                       │       │
│  │  - Healthcare API (production)               │       │
│  │  - Monitoring/Analytics (optional)           │       │
│  └──────────────────────────────────────────────┘       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Principles
- **Layered Architecture** - Clear separation of concerns
- **Type Safety** - Full TypeScript coverage
- **Mock-Driven** - Develop without backend
- **Query-Centric** - React Query for server state
- **Composable** - Small, reusable components

---

## Component Hierarchy

### Layout Components
```tsx
Layout
├── Sidebar (navigation)
├── Header
│   ├── AlertsButton
│   ├── SettingsButton
│   └── UserMenu
└── Page Content (Outlet)
```

### Feature Components
```
Pages
├── DashboardPage
│   ├── StatCard (x4)
│   └── PatientTable
├── PatientsPage
│   └── PatientTable (with filters)
├── PatientDetailPage
│   ├── RiskBadge
│   ├── RiskIndicator
│   ├── TrendChart
│   └── VitalsChart
├── AlertsPage
│   └── AlertCard (x many)
└── SettingsPage
    ├── ToggleSwitch
    └── RangeSlider
```

### UI Components (Base)
```
ui/
├── Button (variants: default, secondary, ghost, outline, destructive)
├── Card (with Header, Title, Description, Content, Footer)
├── Badge (variants: default, success, warning, destructive)
└── (Can add: Modal, Dialog, Dropdown, Tabs, etc.)
```

---

## State Management

### Zustand (Client State)

#### SettingsStore
```typescript
interface SettingsStore {
  demoMode: boolean
  riskThresholds: { green: number; yellow: number }
  alertsEnabled: boolean
  darkMode: boolean
  autoRefresh: boolean
  refreshInterval: number
}
```
**Usage:**
```tsx
const { demoMode, setDemoMode } = useSettingsStore()
```

#### PatientStore
```typescript
interface PatientStore {
  patients: Patient[]
  selectedPatient: Patient | null
  alerts: Alert[]
  // Methods...
}
```
**Usage:**
```tsx
const patients = usePatientStore((s) => s.patients)
```

### React Query (Server State)

#### Query Keys
```typescript
QUERY_KEYS = {
  patients: ['patients'],
  patient: (id) => ['patient', id],
  stats: ['dashboard-stats'],
}
```

#### Usage Examples
```typescript
// List with auto-refresh
const { data: patients } = usePatients()

// Single item
const { data: patient } = usePatient(patientId)

// Stats
const { data: stats } = useDashboardStats()

// Invalidate on update
const refresh = useRefreshPatients()
refresh()
```

---

## API Integration

### Mock Data Flow (Development)
```
Component
  ↓
usePatients() hook
  ↓
React Query
  ↓
apiService.getPatients()  ← Returns mock data
  ↓
Component receives data
```

### Real API Flow (Production)
```
Component
  ↓
usePatients() hook
  ↓
React Query
  ↓
apiService.getPatients()
  ↓
fetch(VITE_API_URL + '/batch_predict')
  ↓
Backend AI Model
  ↓
Response with predictions
  ↓
Component receives data
```

### Adding New API Endpoint

1. **Add to service layer** (`src/services/api.ts`):
```typescript
export const apiService = {
  async getSpecialData(param: string): Promise<SpecialType> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/special-endpoint`,
        { method: 'POST', body: JSON.stringify({ param }) }
      )
      return await response.json()
    } catch (error) {
      console.error('Failed:', error)
      throw error
    }
  }
}
```

2. **Create hook** (`src/hooks/useApi.ts`):
```typescript
export function useSpecialData(param: string) {
  return useQuery({
    queryKey: ['special', param],
    queryFn: () => apiService.getSpecialData(param),
  })
}
```

3. **Use in component**:
```tsx
const { data, isLoading } = useSpecialData('value')
```

---

## Adding Features

### Example: Add a new page

**1. Create page component** (`src/pages/NewPage.tsx`):
```typescript
export function NewPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold">New Feature</h1>
      {/* Content */}
    </motion.div>
  )
}
```

**2. Add route** (`src/App.tsx`):
```typescript
<Route path="/new-feature" element={<NewPage />} />
```

**3. Add nav button** (`src/components/layout/Sidebar.tsx`):
```typescript
NAV_ITEMS.push({
  icon: SomeIcon,
  label: 'New Feature',
  path: '/new-feature',
})
```

### Example: Add a new component

**1. Create component** (`src/components/features/NewComponent.tsx`):
```typescript
interface NewComponentProps {
  title: string
  data: any[]
  onAction: (item: any) => void
}

export function NewComponent({
  title,
  data,
  onAction,
}: NewComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your JSX */}
      </CardContent>
    </Card>
  )
}
```

**2. Use in page**:
```typescript
<NewComponent 
  title="My Data"
  data={items}
  onAction={handleAction}
/>
```

---

## Styling System

### TailwindCSS Classes

#### Spacing
```
p-4 = padding: 1rem
m-2 = margin: 0.5rem
gap-3 = gap: 0.75rem
```

#### Colors (Medical Palette)
```
text-risk-green / bg-risk-green
text-risk-yellow / bg-risk-yellow
text-risk-red / bg-risk-red
text-medical-blue / bg-medical-blue
text-slate-600 / bg-slate-100
```

#### Responsive
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
flex md:flex-row flex-col
hidden md:flex
```

### Combining Classes

Use `cn()` utility for conditional styling:
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base classes',
  isActive && 'active classes',
  variant === 'special' && 'special classes'
)}>
```

### Creating Styled Components

Instead of styled-components, use Tailwind utility composition:
```typescript
const StatCardClasses = "rounded-lg border border-slate-200 bg-white shadow-sm p-6"

// Or use cn() for conditional
const riskClasses = cn(
  'p-4 rounded-lg',
  level === 'RED' && 'bg-red-50 border-l-4 border-red-500',
  level === 'YELLOW' && 'bg-yellow-50 border-l-4 border-yellow-500',
  level === 'GREEN' && 'bg-green-50 border-l-4 border-green-500',
)
```

---

## Performance Optimization

### Already Implemented
- ✅ Code splitting (Vite automatically)
- ✅ Lazy loading (React Router)
- ✅ Query caching (React Query)
- ✅ Memoization (Recharts auto-memoizes)
- ✅ Image optimization (None currently, ready to add)

### Further Improvements

#### 1. Memoize Components
```typescript
import { memo } from 'react'

export const PatientCard = memo(function PatientCard({
  patient,
}: { patient: Patient }) {
  return <div>{patient.name}</div>
})
```

#### 2. Lazy Load Pages
```typescript
import { lazy, Suspense } from 'react'

const SettingsPage = lazy(() => 
  import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage }))
)

<Route path="/settings" element={
  <Suspense fallback={<Loading />}>
    <SettingsPage />
  </Suspense>
} />
```

#### 3. Debounce Search
Already implemented in `PatientTable` via `useDebounce` hook.

#### 4. Virtual Scrolling (for large lists)
```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={patients.length}
  itemSize={100}
>
  {Row}
</FixedSizeList>
```

---

## Debugging Tips

### Local Storage
```typescript
// Inspect React Query cache
localStorage.setItem('debug', 'true')

// View Zustand store
window.store.getState()
```

### Network
- Open DevTools Network tab
- Check `/predict` and `/batch_predict` calls
- Verify request/response format

### Console  
```typescript
// Log component renders
console.log('Component rendered', propValue)

// React Query logging
import { QueryClient } from '@tanstack/react-query'
new QueryClient({
  logger: console
})
```

### Performance
```typescript
// Track re-renders
import { Profiler } from 'react'

<Profiler>
  <YourComponent />
</Profiler>
```

---

## Common Patterns

### Form Handling
```typescript
const [formData, setFormData] = useState({ name: '' })

<input
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
```

### Error Handling
```typescript
const { data, isLoading, error } = usePatients()

if (error) {
  return <div>Error: {error.message}</div>
}
```

### Loading States
```typescript
if (isLoading) {
  return <div className="animate-pulse">Loading...</div>
}
```

### Search/Filter
```typescript
const debouncedSearch = useDebounce(searchQuery, 500)
const filtered = items.filter(item => 
  item.name.includes(debouncedSearch)
)
```

---

## Testing (Future)

Structure ready for Jest + React Testing Library:
```bash
npm install --save-dev @testing-library/react vitest
```

Example test:
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

---

## Deployment Checklist

Before deploying:
- [ ] Remove console.logs
- [ ] Set production API URL
- [ ] Run `npm run build`
- [ ] Check for TypeScript errors
- [ ] Test on mobile (responsive)
- [ ] Verify all external APIs work
- [ ] Update README with deployment URL
- [ ] Set up monitoring (Sentry)
- [ ] Configure CORS on backend
- [ ] Enable gzip compression

---

## Troubleshooting Reference

| Problem | Solution |
|---------|----------|
| Styles not applying | Restart dev server |
| API calls 404 | Check VITE_API_URL in .env.local |
| Component not re-rendering | Ensure state changes trigger re-render |
| TypeScript errors | Run `npm run build` to see full errors |
| Memory leaks | Check useEffect cleanup functions |

---

## Resources

- [React Docs](https://react.dev) - React fundamentals
- [Vite Docs](https://vitejs.dev) - Build tool
- [TailwindCSS Docs](https://tailwindcss.com) - Styling classes
- [React Query Docs](https://tanstack.com/query) - Server state
- [Zustand Docs](https://github.com/pmndrs/zustand) - Client state
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

**Happy building! 🚀**

Questions? Check the README.md or SETUP.md files.

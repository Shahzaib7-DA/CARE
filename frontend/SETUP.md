# Frontend Setup Guide

## Installation & Running

### Quick Start (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:5173
```

### Environment Setup

Copy the example env file:
```bash
cp .env.example .env.local
```

Configure your API endpoint (optional):
```env
VITE_API_URL=http://localhost:8000
```

## Docker Setup

### Build Image
```bash
docker build -t caremind-frontend .
```

### Run Container
```bash
docker run -p 3000:3000 caremind-frontend
```

## Available Scripts

```bash
npm run dev       # Start development server (port 5173)
npm run build     # Build for production (creates 'dist' folder)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project File Structure Explained

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx        # Main app wrapper
│   │   │   ├── Header.tsx        # Top bar with alerts
│   │   │   └── Sidebar.tsx       # Navigation sidebar
│   │   │
│   │   ├── ui/                   # Base UI components (shadcn-style)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   │
│   │   └── features/             # Business components
│   │       ├── RiskBadge.tsx     # Risk level badge
│   │       ├── StatCard.tsx      # KPI cards
│   │       ├── TrendChart.tsx    # Recharts visualizations
│   │       └── PatientTable.tsx  # Patient roster
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx     # Main dashboard
│   │   ├── PatientDetailPage.tsx # Patient view
│   │   ├── AlertsPage.tsx        # Alerts list
│   │   └── SettingsPage.tsx      # Configuration
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useApi.ts             # React Query hooks
│   │   ├── useUI.ts              # UI/animation hooks
│   │   └── index.ts              # Barrel export
│   │
│   ├── store/                    # Zustand stores
│   │   └── index.ts              # Settings & patient store
│   │
│   ├── services/
│   │   └── api.ts                # API client + mock data
│   │
│   ├── lib/
│   │   ├── utils.ts              # Utility functions
│   │   └── queryClient.ts        # React Query config
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   ├── index.css                 # Global styles + animations
│   ├── main.tsx                  # React entry point
│   └── App.tsx                   # Routing config
│
├── index.html                    # HTML entry
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .gitignore
├── .env.example
└── README.md
```

## Key Components

### Layout System
- **Layout** - Wraps entire app with Sidebar + Header
- **Sidebar** - Navigation and status indicator
- **Header** - Alerts button and settings access

### Feature Components

#### RiskBadge
Shows risk level with score percentage. Animated when critical.
```tsx
<RiskBadge level="RED" score={0.85} animated={true} />
```

#### StatCard
KPI display with auto-counting animation.
```tsx
<StatCard 
  label="Critical Patients"
  value={5}
  icon={<AlertCircle />}
  variant="critical"
/>
```

#### PatientTable
Searchable, sortable patient roster with risk indicators.
```tsx
<PatientTable 
  patients={patients}
  onPatientSelect={(p) => navigate(`/patients/${p.id}`)}
  sortBy="risk"
/>
```

#### TrendChart
Recharts line/area chart for risk progression.
```tsx
<TrendChart 
  data={trendData}
  title="Risk Trend"
  variant="area"
/>
```

## API Integration

### Current: Mock Mode
Default runs with simulated patient data. Edit mock data in `/src/services/api.ts`:

```typescript
const MOCK_PATIENTS: Patient[] = [
  {
    patient_id: 'P001',
    name: 'James Mitchell',
    // ... more fields
  },
  // ... add more patients
]
```

### Production: Real API
Updated service layer automatically calls:

```
Backend API Endpoints:
POST /predict          → Single patient risk prediction
POST /batch_predict    → Batch patient predictions  
POST /summary          → Clinical text summary
```

The API type is defined in `/src/types/index.ts` as `PredictionResponse`.

## State Management

### Zustand Stores
Global state with simple API:

```typescript
// Settings store
const { demoMode, setDemoMode } = useSettingsStore()

// Patient store  
const { patients, selectedPatient, setSelectedPatient } = usePatientStore()
```

### React Query
Server state with auto-caching:

```typescript
// Auto-refreshes every 5 seconds
const { data: patients } = usePatients()

// Single patient with caching
const { data: patient } = usePatient(patientId)
```

## Styling Approach

### TailwindCSS Utilities
All styling uses Tailwind utility classes:
```tsx
<div className="px-6 py-4 bg-slate-50 rounded-lg border border-slate-200">
```

### Color System
Medical-themed palette:
- `bg-risk-green` / `text-risk-green`
- `bg-risk-yellow` / `text-risk-yellow`
- `bg-risk-red` / `text-risk-red`
- `bg-medical-blue` / `text-medical-blue`

### Animations via Framer Motion
```tsx
<motion.div
  animate={{ scale: isCritical ? [1, 1.2, 1] : 1 }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Critical Patient Indicator
</motion.div>
```

## Customization Guide

### Add New Patient
Edit `/src/services/api.ts`:
```typescript
MOCK_PATIENTS.push({
  patient_id: 'P007',
  name: 'New Patient',
  age: 55,
  // ... required fields
})
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'risk-green': '#10b981',  // Change here
  'medical-blue': '#0ea5e9', // Change here
}
```

### Adjust Animations
In `src/index.css`:
```css
@keyframes risk-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}
```

### Change Refresh Interval
In `/src/lib/queryClient.ts`:
```typescript
queryFn: () => apiService.getPatients(),
refetchInterval: 10000, // Change from 5000ms
```

## Performance Optimization

### Already Configured:
- ✅ Code splitting via Vite
- ✅ Lazy loading with React Router
- ✅ Query caching with React Query
- ✅ Memoization on charts
- ✅ Virtual scrolling ready

### Further Optimization:
```bash
npm run build  # Generate optimized build
# Check output in 'dist' folder
```

## Troubleshooting

### npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Dev server won't start
```bash
# Port 5173 might be in use
lsof -ti :5173 | xargs kill -9
npm run dev
```

### Styles not applying
```bash
# Restart dev server
# Ctrl+C
npm run dev
```

### TypeScript errors
```bash
# Rebuild types
npm run build
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

1. **Customize branding** - Update logo/colors in `tailwind.config.js`
2. **Connect backend** - Update `VITE_API_URL` in `.env.local`
3. **Add real patient data** - Replace mock data in `api.ts`
4. **Deploy** - Run `npm run build` and deploy `dist/` folder
5. **Monitor** - Add analytics/error reporting (Sentry, etc.)

## Support

For issues or questions:
- Check README.md for more info
- Review demo data in `/src/services/api.ts`
- Inspect browser console for errors
- Check network tab for API issues

---

**Happy coding! Your healthcare dashboard is ready to deploy. 🏥**

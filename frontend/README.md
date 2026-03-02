# CareMind - Clinical Risk Monitoring Dashboard

A production-grade React frontend for AI-powered sepsis risk monitoring and patient triage. Built with modern technologies for healthcare providers and hospital deployment.

## 🎯 Overview

CareMind is a professional healthcare SaaS dashboard that provides real-time clinical risk monitoring, patient triage, and AI-powered sepsis risk prediction. The UI is designed for calm, clinical workflows with enterprise-grade reliability.

**Key Features:**
- 🏥 Real-time patient risk monitoring with color-coded risk levels
- 📊 Risk trend visualization and historical analysis
- ⚡ Low-latency data updates with React Query
- 🎨 Clean, accessible medical UI with TailwindCSS
- 📱 Fully responsive design (desktop + tablet)
- 🔔 Alert management and escalation tracking
- ⚙️ Configurable risk thresholds and system settings
- 🎭 Demo mode with simulated patient data

## 🛠 Tech Stack

- **React 18** - UI framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **Recharts** - Medical data visualization
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Client state management
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header, Layout)
│   ├── ui/              # Reusable UI components (Button, Card, Badge)
│   └── features/        # Feature components (RiskBadge, StatCard, etc)
├── pages/               # Page components (Dashboard, Detail, Alerts, Settings)
├── features/            # Business logic and hooks
├── hooks/               # Custom React hooks (useApi, useUI, etc)
├── store/               # Zustand stores (settings, patients)
├── services/            # API service layer with mock data
├── lib/                 # Utilities (formatting, styling, colors)
├── types/               # TypeScript type definitions
├── App.tsx              # Main app with routing
└── main.tsx             # React DOM entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or npm 9+
- Git

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Create environment file**
```bash
cp .env.example .env.local
```

Edit `.env.local` if you want to change the API URL:
```env
VITE_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📖 Page Documentation

### Dashboard (`/`)
Main overview with:
- 4 stat cards (Total, Critical, Warning, Stable patients)
- Risk-prioritized patient table
- Real-time data with auto-refresh
- Quick patient selection

### Patient Detail (`/patients/:patientId`)
Detailed patient view with:
- Current risk assessment
- Risk trend chart
- Current vitals display
- Clinical factor explanation
- Historical risk progression

### Alerts (`/alerts`)
Alert management with:
- Filterable alert list (All, Critical, Unacknowledged)
- Priority grouping
- Acknowledge/dismiss capability
- Time-based ordering

### Settings (`/settings`)
System configuration:
- Demo mode toggle
- Auto-refresh control
- Alerts enable/disable
- Adjustable risk thresholds (Green/Yellow/Red)
- API URL configuration

## 🔌 API Integration

### Mock Data
The app ships with fully functional mock patient data in `/src/services/api.ts`. Perfect for demo and development.

### Real Backend Integration
To connect to your backend API:

1. Update `VITE_API_URL` in `.env.local`:
```env
VITE_API_URL=http://your-backend-url:8000
```

2. The service layer will automatically call real APIs:
- `POST /predict` - Single patient prediction
- `POST /batch_predict` - Batch predictions
- `POST /summary` - Generate clinical summary

### Data Types
All TypeScript types are in `/src/types/index.ts`:
```typescript
Patient | Alert | RiskLevel | Vital | PredictionResponse
```

## 🎨 Design System

### Color Palette (Clinical)
- **Green** (#10b981) - Stable
- **Yellow** (#f59e0b) - Warning/Concern
- **Red** (#ef4444) - Critical
- **Medical Blue** (#0ea5e9) - Primary action
- **Slate** (#64748b) - Neutral text

### Component Library
All components follow shadcn/ui patterns for consistency and accessibility:
- `Button` - Primary actions
- `Card` - Content containers
- `Badge` - Status indicators
- `RiskBadge` - Risk level display with animations
- `StatCard` - KPI display with trending
- `TrendChart` - Risk progression visualization
- `PatientTable` - Searchable patient roster

## 🧙 Advanced Features

### Auto-Refresh with React Query
Patients automatically update every 5 seconds:
```typescript
const { data: patients } = usePatients()
```

### Animations
Smooth transitions powered by Framer Motion:
- Risk pulse on critical patients
- Number counting on stats
- Fade in for list items
- Scale animations on card hover

### State Management
**Zustand stores** for:
- Settings (thresholds, mode, refresh interval)
- Patient list and selected patient
- Alerts and acknowledgments

**React Query** for:
- Server state (patients, stats)
- Automatic caching and stale-time
- Background refetching

### Keyboard Accessibility
- Full keyboard navigation
- Focus indicators
- ARIA labels on all interactive elements

## 📊 Mock Datasets

6 pre-generated patients with varied risk profiles:
- **P001** (James Mitchell) - RED risk with acute symptoms
- **P002** (Margaret Chen) - YELLOW risk
- **P003** (Robert Johnson) - RED risk, critical
- **P004** (Sarah Williams) - GREEN risk, stable
- **P005** (David Brown) - YELLOW risk
- **P006** (Linda Garcia) - GREEN risk

Easily add more in `/src/services/api.ts` `MOCK_PATIENTS` array.

## 🧪 Development Tips

### Hot Module Replacement (HMR)
Changes instantly reload without state loss during development!

### Component Inspection
Browse all demo components at:
```bash
npm run dev
```

### Type Safety
TypeScript catches errors at compile time:
```bash
npm run dev  # Runs TypeScript in watch mode
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended for React)
```bash
npm install -g vercel
vercel
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Static Hosting (Netlify, GitHub Pages)
```bash
npm run build
# Deploy 'dist' folder
```

## 🔐 Security & Compliance

- ✅ HIPAA-ready (structure for PHI handling)
- ✅ No sensitive data in localStorage
- ✅ HTTPS-ready
- ✅ CORS configured
- ✅ Input sanitization ready
- ✅ Rate limiting ready (backend)

## 📱 Responsive Design

- **Desktop** (1024px+) - Full sidebar + content
- **Tablet** (768px-1023px) - Collapsed sidebar  
- **Mobile** (< 768px) - Mobile menu drawer

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173  
lsof -ti :5173 | xargs kill
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### ENV not loading
Restart dev server after modifying `.env.local`

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [React Query](https://tanstack.com/query)

## 📝 License

© 2026 CareMind Health Systems. All rights reserved.

---

**Ready for production. Built for healthcare.**

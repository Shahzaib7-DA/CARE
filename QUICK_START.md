# 🚀 Quick Start Guide - CareMind AI Integration

## 5-Minute Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run backend
python main.py
```

✅ Backend should show: `Uvicorn running on http://0.0.0.0:8000`

### Step 2: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Run frontend
npm run dev
```

✅ Frontend should show: `Local: http://localhost:5173`

### Step 3: Test Connection

Open `http://localhost:5173` in your browser. You should see:
- Backend connection indicator showing ✅ or ❌
- Dashboard with patient data

### Verify Backend Health

Open another terminal and test:

```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Expected response:
# {"status":"ok","version":"1.0.0","services":{"api":"healthy","models":"loaded","database":"connected"}}

# View API docs
# Visit: http://localhost:8000/docs
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI app with CORS |
| `backend/routes/health.py` | Health check endpoint |
| `backend/routes/predictions.py` | AI prediction logic |
| `frontend/src/services/api.ts` | API service layer |
| `frontend/src/hooks/useBackendConnection.ts` | Connection monitoring hook |
| `frontend/.env.local` | Frontend environment variables |

## 🔧 Using the API Service

```typescript
// Import the services
import { predictionService, healthService } from '@/services/api'

// Check backend health
const health = await healthService.check()
console.log(health) // { status: 'ok', version: '1.0.0', services: {...} }

// Make a prediction
const result = await predictionService.predict({
  patient_id: 'P001',
  heart_rate: 118,
  spo2: 91,
  temperature: 39.2,
  bp_sys: 95,
  bp_dia: 62,
  resp_rate: 24,
})

// Result contains:
// {
//   patient_id: 'P001',
//   sepsis_risk: 0.78,
//   pattern_score: 0.82,
//   risk_level: 'RED',
//   reasons: ['High Temperature', 'Elevated Heart Rate', ...],
//   trend: [0.45, 0.52, 0.68, 0.75, 0.78]
// }
```

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r requirements.txt` |
| `Cannot reach API server` | Ensure backend is running on port 8000 |
| `CORS error in browser` | Backend is running but restart if needed |
| `Port 8000 already in use` | Kill process: `lsof -i :8000 \| kill -9 <PID>` |
| `npm modules not found` | Run `npm install` in frontend directory |
| `Hot reload not working` | Backend: check `reload=True`, Frontend: check `npm run dev` |

## 📊 Example Components

Use these in your dashboard:

```tsx
// Backend status indicator
import { BackendStatus } from '@/components/features/BackendStatus'

// Example prediction form
import { PredictionExample } from '@/components/features/PredictionExample'

// Connection hook
import { useBackendConnection } from '@/hooks/useBackendConnection'
```

## 🚀 Production Checklist

- [ ] Set `VITE_API_URL` to production API domain
- [ ] Enable HTTPS (Frontend and Backend)
- [ ] Configure CORS for production domains
- [ ] Add authentication/authorization
- [ ] Set up monitoring and logging
- [ ] Use database instead of in-memory patient history
- [ ] Dockerize backend and frontend
- [ ] Set up CI/CD pipeline

## 📚 Full Documentation

See `PRODUCTION_INTEGRATION.md` for:
- Complete API reference
- Environment configuration
- Deployment instructions
- Performance optimization
- Advanced troubleshooting

---

**Need help?** Check the API docs at `http://localhost:8000/docs`

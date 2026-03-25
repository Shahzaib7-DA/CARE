# CareMind AI - Production-Ready Integration

> **Professional FastAPI + React (Vite) Stack for AI Inference Services**

A complete, production-ready integration between a React frontend and FastAPI backend for sepsis risk detection using machine learning models.

## 🎯 What You Get

### ✅ Backend (FastAPI)
- 🔒 **CORS-enabled** for frontend communication
- 🏥 **Health check endpoints** (`/api/health`, `/api/ping`)
- 🧠 **AI inference** with LSTM + XGBoost models
- 🚀 **Async/await** non-blocking operations
- 📦 **Modular routers** for scalability
- ⚠️ **Clinical safety overrides** for medical accuracy
- 📊 **Batch predictions** for bulk processing
- 📈 **Patient history tracking** with trends
- 🔧 **Comprehensive error handling**

### ✅ Frontend (React + Vite)
- 🎨 **Type-safe** TypeScript codebase
- 🔌 **Centralized API service** with error handling
- 💫 **Connection monitoring** with auto-health checks
- ⚡ **React Query** for caching and state management
- 🎯 **Example components** ready to use
- 📝 **Full documentation** with code examples
- 🔄 **Hot reload** for development
- 🎪 **Mock data fallback** when backend unavailable

### ✅ Developer Experience
- 📚 **API auto-documentation** at `/docs`
- 🧪 **Debug utilities** for testing
- 🐳 **Docker setup** for containerization
- 🚢 **Production deployment** guides
- 📖 **Comprehensive guides** (5-min to deep-dive)

## 📁 Updated File Structure

```
caremind/
├── backend/
│   ├── main.py                     # ✅ Refactored with CORS & routers
│   ├── requirements.txt            # ✅ Backend dependencies
│   ├── routes/
│   │   ├── health.py               # ✅ Health endpoints
│   │   └── predictions.py          # ✅ AI prediction endpoints
│   └── models/
│       ├── caremind_lstm.h5
│       └── caremind_xgb.pkl
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts              # ✅ Enhanced API service with error handling
│   │   ├── hooks/
│   │   │   ├── useBackendConnection.ts  # ✅ Connection monitoring hook
│   │   │   └── usePredictions.ts   # ✅ React Query prediction hooks
│   │   ├── components/
│   │   │   └── features/
│   │   │       ├── BackendStatus.tsx    # ✅ Status indicator component
│   │   │       └── PredictionExample.tsx # ✅ Example usage component
│   │   └── lib/
│   │       └── apiDebugUtils.ts    # ✅ Development debug utilities
│   ├── .env.local                  # ✅ Environment configuration
│   └── package.json
│
├── QUICK_START.md                  # ✅ 5-minute setup guide
├── PRODUCTION_INTEGRATION.md       # ✅ Complete production guide
├── DOCKER_DEPLOYMENT.md            # ✅ Docker & Kubernetes
├── INTEGRATION_SUMMARY.md          # ✅ Architecture overview
└── README.md                       # ✅ This file
```

## 🚀 Quick Start

### 1. Backend (Terminal 1)
```bash
cd backend
source venv/Scripts/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                  # Runs on http://localhost:8000
```

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev                      # Runs on http://localhost:5173
```

### 3. Verify
- Open `http://localhost:5173`
- See dashboard with ✅ backend status
- Test prediction with example component

**That's it!** 🎉

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-minute setup with troubleshooting |
| **PRODUCTION_INTEGRATION.md** | Complete API reference & deployment |
| **DOCKER_DEPLOYMENT.md** | Containerization & cloud deployment |
| **INTEGRATION_SUMMARY.md** | Architecture & component overview |

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Status check |
| GET | `/api/ping` | Connectivity test |
| POST | `/api/predict` | Single prediction |
| POST | `/api/batch-predict` | Batch predictions |
| GET | `/api/patients/{id}/history` | Patient history |
| GET | `/docs` | Interactive documentation |

## 💻 Usage Examples

### Testing in Frontend
```typescript
import { predictionService, healthService } from '@/services/api'

// Check backend
const health = await healthService.check()
console.log(health) // { status: 'ok', version: '1.0.0', ... }

// Make prediction
const result = await predictionService.predict({
  patient_id: 'P001',
  heart_rate: 118,
  spo2: 91,
  temperature: 39.2,
  bp_sys: 95,
  bp_dia: 62,
  resp_rate: 24,
})

console.log(result)
// {
//   patient_id: 'P001',
//   sepsis_risk: 0.78,
//   pattern_score: 0.82,
//   risk_level: 'RED',
//   reasons: ['High Temperature', 'Elevated Heart Rate'],
//   trend: [0.45, 0.52, 0.68, 0.75, 0.78]
// }
```

### Using React Hooks
```typescript
import { usePrediction } from '@/hooks/usePredictions'
import { useBackendConnection } from '@/hooks/useBackendConnection'

export function Dashboard() {
  const connection = useBackendConnection(true)
  const { predict, isLoading, error, data } = usePrediction()

  const handleTest = () => {
    predict({
      patient_id: 'P001',
      heart_rate: 118,
      spo2: 91,
      temperature: 39.2,
      bp_sys: 95,
      bp_dia: 62,
      resp_rate: 24,
    })
  }

  return (
    <div>
      {connection.isConnected ? '✅ Online' : '❌ Offline'}
      <button onClick={handleTest} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test Prediction'}
      </button>
      {data && <p>Risk: {(data.sepsis_risk * 100).toFixed(1)}%</p>}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}
```

### Debug Testing
```typescript
import { DebugPanel, testAPIIntegration, stressTest } from '@/lib/apiDebugUtils'

// Open debug panel in console
DebugPanel.open()

// Run tests
await testAPIIntegration()    // Test all endpoints
await stressTest(50)           // Test with 50 concurrent requests
```

## 🧪 Testing

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

### 2. Prediction
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "P001",
    "heart_rate": 118,
    "spo2": 91,
    "temperature": 39.2,
    "bp_sys": 95,
    "bp_dia": 62,
    "resp_rate": 24
  }'
```

### 3. API Documentation
Visit `http://localhost:8000/docs` in your browser

## ⚙️ Configuration

### Environment Variables

**Frontend** (`.env.local`)
```env
VITE_API_URL=http://localhost:8000        # Development
# VITE_API_URL=https://api.caremind.com   # Production
```

**Backend** (Automatic)
- Runs on `0.0.0.0:8000`
- CORS origins configured for dev
- Model path: `backend/models/`

## 🚢 Deployment

### Local Docker
```bash
docker-compose up                          # Start both services
```

### Cloud Platforms
- **Heroku**: `git push heroku main`
- **AWS ECS**: Push to ECR
- **Google Cloud Run**: `gcloud run deploy`
- **Kubernetes**: See `DOCKER_DEPLOYMENT.md`

See `DOCKER_DEPLOYMENT.md` for detailed instructions.

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│            (Vite + TypeScript + React Query)             │
├─────────────────────────────────────────────────────────┤
│  components/                                             │
│  · BackendStatus - Connection indicator                  │
│  · PredictionExample - Example API usage                 │
│                                                           │
│  hooks/                                                  │
│  · useBackendConnection - Monitor connection             │
│  · usePredictions - React Query hooks                    │
│  · useApi - Custom query hooks                           │
│                                                           │
│  services/api.ts                                         │
│  · Made fetchAPI() calls with timeout/error handling     │
│  · healthService - Check backend status                  │
│  · predictionService - Make predictions                  │
│  · dataService - Get patient data                        │
└─────────────────────────────────────────────────────────┘
           HTTP (REST API)
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                        │
│              (Python + TensorFlow)                       │
├─────────────────────────────────────────────────────────┤
│  main.py                                                 │
│  · FastAPI app with CORS middleware                      │
│  · Startup/shutdown events                               │
│                                                           │
│  routes/health.py                                        │
│  · GET /api/health                                       │
│  · GET /api/ping                                         │
│                                                           │
│  routes/predictions.py                                   │
│  · POST /api/predict - Single prediction                 │
│  · POST /api/batch-predict - Batch predictions           │
│  · GET /api/patients/{id}/history - History              │
│                                                           │
│  LSTM Model (caremind_lstm.h5)                           │
│  XGBoost Model (caremind_xgb.pkl)                        │
└─────────────────────────────────────────────────────────┘
```

## 🔒 Security Considerations

- ✅ **CORS configured** for dev/prod
- ✅ **Input validation** with Pydantic
- ✅ **Error handling** without leaking internals
- ✅ **Type safety** with TypeScript
- 🔄 **TODO**: Add authentication (JWT/OAuth)
- 🔄 **TODO**: Add rate limiting
- 🔄 **TODO**: Add request logging

## 📈 Performance

| Metric | Value |
|--------|-------|
| Single Prediction | ~100-200ms |
| Batch (100 patients) | ~5-10s |
| Health Check | ~10-20ms |
| API Timeout | 30s (configurable) |
| Health Check Interval | 30s (auto) |

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check port 8000 is available
lsof -i :8000

# Check Python dependencies
pip install -r requirements.txt

# Check models exist
ls backend/models/
```

### CORS Errors
```bash
# Ensure frontend URL matches CORS_ORIGINS
# Check backend is running
curl http://localhost:8000/api/health
```

### Models Not Loading
```bash
# Ensure model files exist in backend/models/
# File names must match exactly:
# - caremind_lstm.h5
# - caremind_xgb.pkl
```

See full troubleshooting in `PRODUCTION_INTEGRATION.md`.

## 📦 Dependencies

### Backend
```
FastAPI >= 0.104.0
Uvicorn >= 0.24.0
TensorFlow >= 2.13
Pandas >= 2.0
Scikit-learn >= 1.3
XGBoost >= 2.0
```

### Frontend
```
React >= 18.2
Vite >= 4.0
TypeScript >= 5.0
React Query >= 5.0
TailwindCSS >= 3.4
```

## 🎯 Next Steps

1. **Run the application** - See QUICK_START.md
2. **Explore the API** - Visit http://localhost:8000/docs
3. **Integrate with your dashboard** - Use example components
4. **Deploy to production** - See DOCKER_DEPLOYMENT.md
5. **Add features** - Extend routers and components

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Query Documentation](https://tanstack.com/query)
- [Vite Documentation](https://vitejs.dev)
- [TensorFlow Documentation](https://tensorflow.org)

## 🤝 Contributing

This is a production template. To extend:

1. Add new routes in `backend/routes/`
2. Add new components in `frontend/src/components/`
3. Use the existing patterns and type safety
4. Follow the modular architecture

## 📄 License

This integration is part of the CareMind project.

---

## 📞 Support

- **Quick Help**: Check QUICK_START.md
- **Full Reference**: Read PRODUCTION_INTEGRATION.md
- **API Reference**: Visit http://localhost:8000/docs
- **Issues**: Check DOCKER_DEPLOYMENT.md troubleshooting

---

**Ready to build AI-powered healthcare apps?** Start with `QUICK_START.md` 🚀

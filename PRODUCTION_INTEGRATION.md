# CareMind AI Integration Setup

## 📋 Overview

This document provides setup and configuration for the production-ready CareMind AI integration between React (Vite) frontend and FastAPI backend.

## 🗂️ Project Structure

```
caremind/
├── backend/
│   ├── main.py                 # FastAPI application with CORS
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py          # Health check endpoints
│   │   └── predictions.py     # AI prediction endpoints
│   ├── models/
│   │   ├── caremind_lstm.h5   # LSTM model (pre-trained)
│   │   └── caremind_xgb.pkl   # XGBoost model (pre-trained)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts         # API service layer with error handling
│   │   ├── hooks/
│   │   │   ├── useApi.ts      # React Query hooks
│   │   │   └── useBackendConnection.ts  # Connection test hook
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript types
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.local             # Environment variables
│   ├── vite.config.ts
│   └── package.json
│
└── .env.development           # Shared development config
```

## ⚙️ Configuration

### Backend Environment

The backend automatically:
- Runs on `0.0.0.0:8000`
- Loads AI models from `models/` directory
- Accepts CORS requests from frontend dev server
- Provides API documentation at `/docs`

### Frontend Environment

Create `.env.local` in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

Or set via command line:

```bash
export VITE_API_URL=http://localhost:8000  # macOS/Linux
set VITE_API_URL=http://localhost:8000     # Windows CMD
```

## 🚀 Running the Application

### Option 1: Run Both Simultaneously (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv                          # Create venv if needed
source venv/Scripts/activate                 # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install                                   # Install dependencies if needed
npm run dev
```

Visit: `http://localhost:5173`

### Option 2: Using Run Scripts

**Windows PowerShell:**
```bash
# Terminal 1
.\install.bat
cd backend
python main.py

# Terminal 2
cd frontend
npm run dev
```

**macOS/Linux:**
```bash
# Terminal 1
./install.sh
cd backend
python main.py

# Terminal 2
cd frontend
npm run dev
```

## 🔌 API Endpoints

### Health & Status

- **GET** `/api/health` - Health check with service status
- **GET** `/api/ping` - Simple connectivity ping

### Predictions

- **POST** `/api/predict` - Single patient prediction
  ```json
  {
    "patient_id": "P001",
    "heart_rate": 118,
    "spo2": 91,
    "temperature": 39.2,
    "bp_sys": 95,
    "bp_dia": 62,
    "resp_rate": 24
  }
  ```

- **POST** `/api/batch-predict` - Multiple patient predictions
  ```json
  {
    "patients": [
      {
        "patient_id": "P001",
        "heart_rate": 118,
        ...
      }
    ]
  }
  ```

- **GET** `/api/patients/{patient_id}/history` - Patient history

### API Documentation

FastAPI auto-generates interactive docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔧 Frontend Integration

### Using the API Service

```typescript
import { predictionService, healthService } from '@/services/api'

// Check backend connection
const health = await healthService.check()

// Single prediction
const result = await predictionService.predict({
  patient_id: 'P001',
  heart_rate: 118,
  spo2: 91,
  temperature: 39.2,
  bp_sys: 95,
  bp_dia: 62,
  resp_rate: 24,
})

// Batch prediction
const results = await predictionService.batchPredict({
  patients: [/* ... */]
})
```

### Using the Connection Hook

```typescript
import { useBackendConnection } from '@/hooks/useBackendConnection'

export function DashboardHeader() {
  const connection = useBackendConnection(true) // Auto-check every 30s

  return (
    <div>
      <p>
        {connection.isConnected ? '✅ Backend Connected' : '❌ Disconnected'}
      </p>
      {connection.error && <p className="text-red-500">{connection.error}</p>}
      <button onClick={() => connection.checkConnection()}>
        {connection.isLoading ? 'Checking...' : 'Check Connection'}
      </button>
    </div>
  )
}
```

## 🐛 Troubleshooting

### CORS Errors
**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:** 
- Ensure backend is running on port 8000
- Check `CORS_ORIGINS` in backend matches your frontend URL
- Restart backend after changes

### Cannot Connect to Backend
**Error:** "Cannot reach API server at http://localhost:8000"

**Solution:**
```bash
# Check backend running:
curl http://localhost:8000/api/health

# Check environment:
echo $VITE_API_URL  # macOS/Linux
echo %VITE_API_URL% # Windows

# Ensure port 8000 is available:
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -i :8000
```

### Models Not Loading
**Error:** "FileNotFoundError: caremind_lstm.h5"

**Solution:**
```bash
# Ensure model files exist:
ls backend/models/
# Should show: caremind_lstm.h5, caremind_xgb.pkl
```

### Hot Reload Not Working
**Solution:**
- Frontend: Check Vite is running in dev mode (`npm run dev`)
- Backend: Check `reload=True` in `uvicorn.run()`

## 📦 Dependencies

### Backend
- FastAPI >= 0.104.0
- Uvicorn >= 0.24.0
- TensorFlow >= 2.13
- pandas, numpy
- Pydantic >= 2.0

### Frontend
- React >= 18.2
- Vite >= 4.0
- React Query >= 5.0
- TypeScript >= 5.0
- TailwindCSS >= 3.4

## 🚢 Production Deployment

### Docker Setup

Create `Dockerfile` for backend:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

Build and run:
```bash
docker build -t caremind-api .
docker run -p 8000:8000 -e VITE_API_URL=http://api.caremind.com caremind-api
```

### Environment Variables for Production

```env
# Backend
CORS_ORIGINS=https://app.caremind.com,https://dashboard.caremind.com
TF_CPP_MIN_LOG_LEVEL=2

# Frontend (build time)
VITE_API_URL=https://api.caremind.com
```

## 📊 Performance Tips

1. **Caching**: Enable HTTP caching headers on backend
2. **Compression**: Use gzip compression for API responses
3. **Batch Predictions**: Send batches of 50-100 patients for better throughput
4. **Model Optimization**: Consider quantizing models for edge deployment
5. **Monitoring**: Add request/response logging and metrics

## 📝 Common Commands

```bash
# Backend
cd backend
python -m venv venv              # Create virtual environment
source venv/Scripts/activate     # Activate venv
pip install -r requirements.txt  # Install dependencies
python main.py                   # Run dev server
pytest                           # Run tests

# Frontend
cd frontend
npm install                      # Install dependencies
npm run dev                      # Run dev server
npm run build                    # Build for production
npm run preview                  # Preview production build
npm run lint                     # Run linter
```

## 🔗 Additional Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- Vite Docs: https://vitejs.dev
- React Query Docs: https://tanstack.com/query
- TensorFlow Docs: https://tensorflow.org

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from env_utils import load_backend_env

# Import routers
from routes.health      import router as health_router
from routes.predictions import router as predictions_router
from routes.patients    import router as patients_router
from routes.dashboard   import router as dashboard_router

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
load_backend_env(os.path.join(script_dir, ".env"))


# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    print("INFO: CareMind API Server Starting...")
    # Verify DB connection on startup (database.py logs result on import)
    try:
        from database import DB_CONNECTED, client
        if DB_CONNECTED:
            print("INFO: MongoDB Atlas: Connected")
        else:
            print("WARNING: MongoDB Atlas: Not connected - running in API-only mode")
    except Exception as e:
        print(f"WARNING: Could not verify DB connection: {e}")
    yield
    print("INFO: CareMind API Server Shutting Down...")


# Create FastAPI app
app = FastAPI(
    title="CareMind AI API",
    description="Production-ready AI inference API for sepsis risk detection",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS — allow Netlify / Vercel frontend + local dev
cors_origins = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
]
# In production, also accept any origin (tighten later with CORS_ORIGINS env var)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register routers ───────────────────────────────────────────────────────────
app.include_router(health_router,      prefix="/api", tags=["Health"])
app.include_router(predictions_router, prefix="/api", tags=["Predictions"])
app.include_router(patients_router,    prefix="/api", tags=["Patients"])
app.include_router(dashboard_router,   prefix="/api", tags=["Dashboard"])


# Root endpoint
@app.get("/")
async def root():
    return {
        "message":  "Welcome to CareMind AI API",
        "version":  "1.0.0",
        "docs_url": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

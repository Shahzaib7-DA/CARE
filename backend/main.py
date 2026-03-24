import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers
from routes.health      import router as health_router
from routes.predictions import router as predictions_router
from routes.patients    import router as patients_router
from routes.dashboard   import router as dashboard_router

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))


# Startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    print("🚀 CareMind API Server Starting...")
    # Verify DB connection on startup (database.py logs result on import)
    try:
        from database import DB_CONNECTED, client
        if DB_CONNECTED:
            print("✅ MongoDB Atlas: Connected")
        else:
            print("⚠️  MongoDB Atlas: Not connected — running in API-only mode")
    except Exception as e:
        print(f"⚠️  Could not verify DB connection: {e}")
    yield
    print("🛑 CareMind API Server Shutting Down...")


# Create FastAPI app
app = FastAPI(
    title="CareMind AI API",
    description="Production-ready AI inference API for sepsis risk detection",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"],
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
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    version: str
    services: dict

@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring API status.
    Returns the status of core services.
    """
    try:
        from database import DB_CONNECTED
        db_status = "connected" if DB_CONNECTED else "disconnected"
    except Exception:
        db_status = "unknown"

    try:
        from services.prediction_service import MODELS_LOADED
        models_status = "loaded" if MODELS_LOADED else "not loaded"
    except Exception:
        models_status = "unknown"

    return {
        "status": "ok",
        "version": "1.0.0",
        "services": {
            "api":      "healthy",
            "models":   models_status,
            "database": db_status,
        }
    }

@router.get("/ping")
async def ping():
    """Simple ping endpoint for connectivity checks"""
    return {"message": "pong"}


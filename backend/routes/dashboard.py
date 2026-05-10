"""
Dashboard stats endpoint for CareMind.

Endpoint:
  GET /api/dashboard/stats
"""
from fastapi import APIRouter, HTTPException
from database import get_collections
from database import DB_CONNECTED
from mock_data import MOCK_ALERTS, mock_dashboard_stats

router = APIRouter()


@router.get("/dashboard/stats")
async def get_dashboard_stats():
    """
    Return aggregated patient counts by risk level.
    Matches the DashboardStats TypeScript type exactly.
    """
    try:
        if not DB_CONNECTED:
            return {
                "success": True,
                "data": mock_dashboard_stats(),
            }

        cols = get_collections()
        patients_col = cols["patients"]

        total   = patients_col.count_documents({})
        critical = patients_col.count_documents({"risk_level": "RED"})
        warning  = patients_col.count_documents({"risk_level": "YELLOW"})
        stable   = patients_col.count_documents({"risk_level": "GREEN"})

        return {
            "success": True,
            "data": {
                "total_patients":    total,
                "critical_patients": critical,
                "warning_patients":  warning,
                "stable_patients":   stable,
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/alerts")
async def get_alerts():
    """Return all alerts (most recent first)."""
    try:
        if not DB_CONNECTED:
            return {"success": True, "data": MOCK_ALERTS}

        cols = get_collections()
        docs = list(cols["alerts"].find({}, {"_id": 0}).sort("timestamp", -1))
        return {"success": True, "data": docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

"""
Patient CRUD routes for CareMind.

Endpoints:
  POST   /api/patients                         – create patient + run initial prediction
  GET    /api/patients                         – list all patients
  GET    /api/patients/{patient_id}            – get one patient
  POST   /api/patients/{patient_id}/vitals     – submit vitals + run AI prediction
  POST   /api/patients/{patient_id}/treated    – mark patient as treated
  GET    /api/patients/{patient_id}/history    – risk trend history
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import Optional
import json

from database import get_collections
from database import DB_CONNECTED
from schemas.patient import PatientCreate, PatientOut, VitalsSubmission
from services.prediction_service import run_prediction, maybe_create_alert, MODELS_LOADED
from mock_data import MOCK_PATIENTS, find_mock_patient

router = APIRouter()


# ─── Helpers ────────────────────────────────────────────────────────────────────

def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _doc_to_patient(doc: dict) -> dict:
    """Convert a MongoDB document to a JSON-serializable patient dict."""
    doc.pop("_id", None)
    return doc


def _success(data) -> dict:
    return {"success": True, "data": data}


def _error(msg: str) -> dict:
    return {"success": False, "error": msg}


# ─── POST /api/patients ─────────────────────────────────────────────────────────

@router.post("/patients")
async def create_patient(body: PatientCreate):
    """
    Add a new patient to the database.
    If vitals are provided, immediately run the AI prediction pipeline
    so the patient is saved with a real risk score (not the 0 default).
    """
    try:
        cols = get_collections()
        patients_col = cols["patients"]

        # Check for duplicate
        if patients_col.find_one({"patient_id": body.patient_id}):
            raise HTTPException(status_code=409, detail=f"Patient '{body.patient_id}' already exists.")

        now = _now_iso()
        vitals_dict = body.vitals.dict() if body.vitals else None

        # Compute MAP if vitals provided
        if vitals_dict and vitals_dict.get("MAP") is None:
            vitals_dict["MAP"] = round((vitals_dict["SBP"] + 2 * vitals_dict["DBP"]) / 3, 2)

        patient_doc = {
            "patient_id":    body.patient_id,
            "name":          body.name,
            "age":           body.age,
            "gender":        body.gender,
            "bed_number":    body.bed_number,
            "status":        body.status or "active",
            "risk_level":    "GREEN",
            "sepsis_risk":   0.0,
            "pattern_score": 0.0,
            "reasons":       [],
            "trend":         [],
            "vitals":        vitals_dict,
            "created_at":    now,
            "last_updated":  now,
        }

        prediction = None

        # ── Run initial prediction if vitals were provided ──────────────────────
        if vitals_dict and MODELS_LOADED:
            try:
                prediction = run_prediction(
                    vitals_data=vitals_dict,
                    patient_id=body.patient_id,
                    existing_trend=[],
                    trend_hr=body.trend_hr,
                )
                patient_doc.update({
                    "risk_level":    prediction["risk_level"],
                    "sepsis_risk":   prediction["sepsis_risk"],
                    "pattern_score": prediction["pattern_score"],
                    "reasons":       prediction["reasons"],
                    "trend":         prediction["trend"],
                })
            except Exception as pred_err:
                # Don't fail the whole create if prediction errors
                print(f"WARNING: Initial prediction failed for {body.patient_id}: {pred_err}")

        # Save patient
        patients_col.insert_one(patient_doc)
        patient_doc.pop("_id", None)

        # Save initial vitals to history
        if vitals_dict:
            cols["vitals_history"].insert_one({
                "patient_id": body.patient_id,
                "vitals":     vitals_dict,
                "timestamp":  now,
            })

        # Save prediction to predictions collection
        if prediction:
            cols["predictions"].insert_one({**prediction, "timestamp": now})
            # Create alert if risk is RED
            maybe_create_alert(cols, body.patient_id, body.name, prediction["risk_level"])

        return _success({
            "patient":    patient_doc,
            "prediction": prediction,
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET /api/patients ──────────────────────────────────────────────────────────

@router.get("/patients")
async def list_patients(risk_level: Optional[str] = None):
    """Return all patients, optionally filtered by risk_level (GREEN|YELLOW|RED)."""
    try:
        if not DB_CONNECTED:
            patients = MOCK_PATIENTS
            if risk_level:
                patients = [patient for patient in patients if patient["risk_level"] == risk_level.upper()]
            return _success(patients)

        cols = get_collections()
        query = {}
        if risk_level:
            query["risk_level"] = risk_level.upper()

        docs = list(cols["patients"].find(query, {"_id": 0}))
        return _success(docs)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET /api/patients/{patient_id} ─────────────────────────────────────────────

@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Return a single patient by ID."""
    try:
        if not DB_CONNECTED:
            patient = find_mock_patient(patient_id)
            if not patient:
                raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found.")
            return _success(patient)

        cols = get_collections()
        doc = cols["patients"].find_one({"patient_id": patient_id}, {"_id": 0})
        if not doc:
            raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found.")
        return _success(doc)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── POST /api/patients/{patient_id}/vitals ─────────────────────────────────────

@router.post("/patients/{patient_id}/vitals")
async def submit_vitals(patient_id: str, body: VitalsSubmission):
    """
    Insert new vitals for a patient, run the AI prediction pipeline,
    update the patient document, and create an alert if risk is RED.
    """
    try:
        if not DB_CONNECTED:
            raise HTTPException(status_code=503, detail="MongoDB is disconnected. Patient vitals updates are unavailable in API-only mode.")

        cols = get_collections()
        patients_col = cols["patients"]
        vitals_col   = cols["vitals_history"]
        preds_col    = cols["predictions"]

        # Fetch patient
        patient = patients_col.find_one({"patient_id": patient_id})
        if not patient:
            raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found.")

        now = _now_iso()
        vitals_dict = body.vitals.dict()

        # Compute MAP if not provided
        if vitals_dict.get("MAP") is None:
            vitals_dict["MAP"] = round((vitals_dict["SBP"] + 2 * vitals_dict["DBP"]) / 3, 2)

        # Store raw vitals in history
        vitals_record = {
            "patient_id": patient_id,
            "vitals": vitals_dict,
            "timestamp": now,
        }
        vitals_col.insert_one(vitals_record)

        prediction = {}
        if MODELS_LOADED:
            # Run AI prediction
            existing_trend = patient.get("trend", [])
            prediction = run_prediction(
                vitals_data=vitals_dict,
                patient_id=patient_id,
                existing_trend=existing_trend,
                trend_hr=body.trend_hr,
            )

            # Store prediction document
            pred_doc = {**prediction, "timestamp": now}
            preds_col.insert_one(pred_doc)

            # Update patient document with new risk stats
            patients_col.update_one(
                {"patient_id": patient_id},
                {"$set": {
                    "vitals":        vitals_dict,
                    "sepsis_risk":   prediction["sepsis_risk"],
                    "pattern_score": prediction["pattern_score"],
                    "risk_level":    prediction["risk_level"],
                    "reasons":       prediction["reasons"],
                    "trend":         prediction["trend"],
                    "last_updated":  now,
                }},
            )

            # Create alert if RED
            maybe_create_alert(cols, patient_id, patient.get("name", patient_id),
                               prediction["risk_level"])

            return _success({
                "vitals": vitals_dict,
                "prediction": prediction,
                "message": "Vitals recorded and prediction updated.",
            })

        else:
            # No model: just update vitals
            patients_col.update_one(
                {"patient_id": patient_id},
                {"$set": {"vitals": vitals_dict, "last_updated": now}},
            )
            return _success({
                "vitals": vitals_dict,
                "prediction": None,
                "message": "Vitals recorded. ML models are not loaded; prediction skipped.",
            })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── POST /api/patients/{patient_id}/treated ────────────────────────────────────

@router.post("/patients/{patient_id}/treated")
async def mark_treated(patient_id: str):
    """Mark patient status as 'treated'."""
    try:
        if not DB_CONNECTED:
            patient = find_mock_patient(patient_id)
            if not patient:
                raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found.")
            patient["status"] = "treated"
            patient["last_updated"] = _now_iso()
            return _success({"patient_id": patient_id, "status": "treated"})

        cols = get_collections()
        result = cols["patients"].update_one(
            {"patient_id": patient_id},
            {"$set": {"status": "treated", "last_updated": _now_iso()}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found.")

        # Resolve open alerts for this patient
        cols["alerts"].update_many(
            {"patient_id": patient_id, "resolved": False},
            {"$set": {"resolved": True, "resolved_at": _now_iso()}},
        )

        return _success({"patient_id": patient_id, "status": "treated"})

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── GET /api/patients/{patient_id}/history ─────────────────────────────────────

@router.get("/patients/{patient_id}/history")
async def get_patient_history(patient_id: str):
    """Return the risk trend (sepsis_risk values) for a patient over time."""
    try:
        if not DB_CONNECTED:
            patient = find_mock_patient(patient_id)
            if not patient:
                raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found.")
            history = patient.get("trend", [])
            return _success({
                "patient_id": patient_id,
                "history": history,
                "count": len(history),
            })

        cols = get_collections()

        # Pull all predictions for this patient, sorted by time
        preds = list(cols["predictions"].find(
            {"patient_id": patient_id},
            {"_id": 0, "sepsis_risk": 1, "timestamp": 1}
        ).sort("timestamp", 1))

        history = [p["sepsis_risk"] for p in preds]
        return _success({
            "patient_id": patient_id,
            "history":    history,
            "count":      len(history),
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import numpy as np
import pickle
import os
from tensorflow.keras.models import load_model  # type: ignore

router = APIRouter()

# Load models
script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lstm_model = load_model(os.path.join(script_dir, "models/caremind_lstm.h5"))
xgb_model = pickle.load(open(os.path.join(script_dir, "models/caremind_xgb.pkl"), "rb"))

# In-memory patient history (replace with database in production)
patient_history = {}

# Pydantic models
class VitalsData(BaseModel):
    HR: float = Field(..., description="Heart Rate")
    O2Sat: float = Field(..., description="Oxygen Saturation")
    Temp: float = Field(..., description="Temperature")
    SBP: float = Field(..., description="Systolic Blood Pressure")
    DBP: float = Field(..., description="Diastolic Blood Pressure")
    Resp: float = Field(..., description="Respiratory Rate")

class PredictionRequest(BaseModel):
    patient_id: str
    heart_rate: Optional[float] = None
    spo2: Optional[float] = None
    temperature: Optional[float] = None
    bp_sys: Optional[float] = None
    bp_dia: Optional[float] = None
    resp_rate: Optional[float] = None

class PredictionResponse(BaseModel):
    patient_id: str
    sepsis_risk: float
    pattern_score: float
    risk_level: str
    reasons: List[str]
    trend: List[float]

class BatchPredictionRequest(BaseModel):
    patients: List[PredictionRequest]

# Service functions
def map_features(api_data: dict) -> pd.DataFrame:
    """Map API parameters to model feature names"""
    feature_map = {
        "heart_rate": "HR",
        "spo2": "O2Sat",
        "temperature": "Temp",
        "bp_sys": "SBP",
        "bp_dia": "DBP",
        "resp_rate": "Resp"
    }
    
    df = pd.DataFrame([api_data])
    df = df.rename(columns=feature_map)
    df["MAP"] = (df["SBP"] + 2 * df["DBP"]) / 3
    
    required = ['HR', 'O2Sat', 'Temp', 'SBP', 'MAP', 'DBP', 'Resp']
    return df[required]

def build_lstm_input(df: pd.DataFrame) -> np.ndarray:
    """Build LSTM input sequence"""
    seq = np.repeat(df.values, 10, axis=0)
    return seq.reshape(1, 10, 7)

def explain_risk(df: pd.DataFrame) -> List[str]:
    """Generate reasons for risk assessment"""
    reasons = []
    if df["O2Sat"][0] < 92:
        reasons.append("Low Oxygen")
    if df["Temp"][0] > 38:
        reasons.append("High Temperature")
    if df["HR"][0] > 100:
        reasons.append("High Heart Rate")
    if df["Resp"][0] > 22:
        reasons.append("High Respiratory Rate")
    if df["MAP"][0] < 65:
        reasons.append("Low Blood Pressure")
    return reasons or ["Elevated vital patterns"]

def apply_clinical_overrides(risk: float, df: pd.DataFrame) -> float:
    """Apply clinical safety thresholds"""
    if df["O2Sat"][0] < 85:
        risk = max(risk, 0.85)
    if df["Temp"][0] > 39:
        risk = max(risk, 0.75)
    if df["HR"][0] > 160:
        risk = max(risk, 0.7)
    if df["MAP"][0] < 55:
        risk = max(risk, 0.8)
    return risk

def determine_risk_level(risk: float) -> str:
    """Determine risk level from score"""
    if risk < 0.3:
        return "GREEN"
    elif risk < 0.6:
        return "YELLOW"
    else:
        return "RED"

def run_prediction(api_data: dict) -> dict:
    """Execute sepsis risk prediction"""
    try:
        patient_id = api_data.get("patient_id", "default")
        
        # Feature mapping
        df = map_features(api_data)
        reasons = explain_risk(df)
        
        # LSTM prediction
        X_lstm = build_lstm_input(df)
        lstm_score = float(lstm_model.predict(X_lstm, verbose=0)[0][0])
        
        # XGBoost prediction
        vital_means = df.values.mean(axis=0)
        xgb_raw = np.hstack([vital_means, lstm_score])
        
        norm = [
            xgb_raw[0] / 150,
            xgb_raw[1] / 100,
            xgb_raw[2] / 40,
            xgb_raw[3] / 200,
            xgb_raw[4] / 120,
            xgb_raw[5] / 120,
            xgb_raw[6] / 40,
            xgb_raw[7]
        ]
        
        xgb_input = np.array(norm).reshape(1, -1)
        risk = float(xgb_model.predict_proba(xgb_input)[0][1])
        
        # Clinical safety overrides
        risk = apply_clinical_overrides(risk, df)
        
        # Risk level determination
        level = determine_risk_level(risk)
        
        # Track history for trends
        if patient_id not in patient_history:
            patient_history[patient_id] = []
        patient_history[patient_id].append(risk)
        trend = patient_history[patient_id][-5:]
        
        return {
            "patient_id": patient_id,
            "sepsis_risk": round(risk, 4),
            "pattern_score": round(lstm_score, 4),
            "risk_level": level,
            "reasons": reasons,
            "trend": [round(t, 4) for t in trend]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Endpoints
@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict sepsis risk for a single patient.
    
    Required vitals: heart_rate, spo2, temperature, bp_sys, bp_dia, resp_rate
    """
    api_data = request.model_dump()
    return run_prediction(api_data)

@router.post("/batch-predict")
async def batch_predict(request: BatchPredictionRequest):
    """
    Predict sepsis risk for multiple patients.
    Returns results ranked by sepsis risk (highest first).
    """
    try:
        results = []
        for patient in request.patients:
            result = run_prediction(patient.model_dump())
            results.append(result)
        
        # Rank by sepsis risk
        ranked = sorted(results, key=lambda x: x["sepsis_risk"], reverse=True)
        return {"predictions": ranked, "total": len(ranked)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

@router.get("/patients/{patient_id}/history")
async def get_patient_history(patient_id: str):
    """Get historical sepsis risk scores for a patient"""
    if patient_id not in patient_history:
        raise HTTPException(status_code=404, detail=f"No history for patient {patient_id}")
    
    return {
        "patient_id": patient_id,
        "history": [round(score, 4) for score in patient_history[patient_id]],
        "count": len(patient_history[patient_id])
    }

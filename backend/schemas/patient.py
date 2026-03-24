"""
Pydantic schemas for CareMind patient data.
Field names match the TypeScript frontend types exactly.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class VitalsModel(BaseModel):
    HR: float = Field(..., description="Heart Rate (bpm)")
    O2Sat: float = Field(..., description="Oxygen Saturation (%)")
    Temp: float = Field(..., description="Temperature (°C)")
    SBP: float = Field(..., description="Systolic Blood Pressure (mmHg)")
    DBP: float = Field(..., description="Diastolic Blood Pressure (mmHg)")
    MAP: Optional[float] = Field(None, description="Mean Arterial Pressure (computed if absent)")
    Resp: float = Field(..., description="Respiratory Rate (breaths/min)")

    def computed_map(self) -> float:
        """Compute MAP if not provided."""
        if self.MAP is not None:
            return self.MAP
        return (self.SBP + 2 * self.DBP) / 3


# ─── Patient Input (POST /api/patients) ────────────────────────────────────────
class PatientCreate(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: Optional[str] = None
    bed_number: str
    status: Optional[str] = "active"  # active | treated | recovering | stable
    vitals: Optional[VitalsModel] = None
    # Historical HR readings from the form (newest → oldest):
    # [10s ago, 20s ago, 50s ago, 1min ago, 1.5min ago]
    trend_hr: Optional[List[float]] = None


# ─── Full Patient Response (matches `Patient` TypeScript type) ──────────────────
class PatientOut(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: Optional[str] = None
    bed_number: str
    status: str = "active"
    risk_level: str = "GREEN"         # GREEN | YELLOW | RED
    sepsis_risk: float = 0.0
    pattern_score: float = 0.0
    reasons: List[str] = []
    trend: List[float] = []
    vitals: Optional[VitalsModel] = None
    last_updated: str
    created_at: Optional[str] = None


# ─── AI Prediction Response (matches `PredictionResponse` TypeScript type) ──────
class PredictionResponseModel(BaseModel):
    patient_id: str
    sepsis_risk: float
    pattern_score: float
    risk_level: str
    reasons: List[str]
    trend: List[float]


# ─── Alert (matches `Alert` TypeScript type) ────────────────────────────────────
class AlertModel(BaseModel):
    id: Optional[str] = None
    patient_id: str
    patient_name: str
    risk_level: str
    message: str
    timestamp: str
    acknowledged: bool = False
    treatmentNotes: Optional[str] = None
    resolved: bool = False
    resolved_at: Optional[str] = None


# ─── Dashboard Stats (matches `DashboardStats` TypeScript type) ─────────────────
class DashboardStatsModel(BaseModel):
    total_patients: int
    critical_patients: int
    warning_patients: int
    stable_patients: int


# ─── Vitals Submission payload ───────────────────────────────────────────────────
class VitalsSubmission(BaseModel):
    vitals: VitalsModel
    # Optional historical HR for better LSTM sequence (newest → oldest)
    trend_hr: Optional[List[float]] = None


# ─── Standard API Envelope ───────────────────────────────────────────────────────
class APIResponse(BaseModel):
    success: bool
    data: Optional[object] = None
    error: Optional[str] = None

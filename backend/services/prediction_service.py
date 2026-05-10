"""
Shared AI prediction service for CareMind.
Extracts prediction logic so it can be used by both:
  - routes/predictions.py  (direct prediction endpoint)
  - routes/patients.py     (vitals submission → auto-predict)
"""
import os
import pickle
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional

# Load ML models once at module import time
_script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    from tensorflow.keras.models import load_model  # type: ignore
    _lstm_model = load_model(os.path.join(_script_dir, "models/caremind_lstm.h5"))
    _xgb_model = pickle.load(open(os.path.join(_script_dir, "models/caremind_xgb.pkl"), "rb"))
    MODELS_LOADED = True
    print("INFO: ML models loaded successfully.")
except Exception as e:
    _lstm_model = None
    _xgb_model = None
    MODELS_LOADED = False
    print(f"WARNING: ML models not loaded: {e}")


# ─── Feature helpers ────────────────────────────────────────────────────────────

def _map_features(data: Dict[str, Any]) -> pd.DataFrame:
    """Accept a vitals dict (HR/O2Sat/Temp/SBP/DBP/Resp) and return a normalised DataFrame."""
    # Support both API naming conventions
    mapping = {
        "heart_rate": "HR", "spo2": "O2Sat", "temperature": "Temp",
        "bp_sys": "SBP", "bp_dia": "DBP", "resp_rate": "Resp",
    }
    row = {}
    for src, dst in mapping.items():
        if src in data:
            row[dst] = data[src]
    # Also accept direct model names
    for col in ["HR", "O2Sat", "Temp", "SBP", "DBP", "Resp"]:
        if col in data and col not in row:
            row[col] = data[col]

    df = pd.DataFrame([row])
    df["MAP"] = (df["SBP"] + 2 * df["DBP"]) / 3
    return df[["HR", "O2Sat", "Temp", "SBP", "MAP", "DBP", "Resp"]]


def _build_lstm_input(df: pd.DataFrame, trend_hr: Optional[List[float]] = None) -> np.ndarray:
    """
    Build a (1, 10, 7) LSTM input tensor.

    If trend_hr is provided (historical HR readings, newest→oldest),
    we construct a proper 10-step sequence where HR varies per timestep
    while other vitals remain constant (as baseline).

    If trend_hr is None or too short, we fall back to repeating the single reading.
    """
    base_row = df.values[0]  # shape (7,) — [HR, O2Sat, Temp, SBP, MAP, DBP, Resp]

    if trend_hr and len(trend_hr) >= 2:
        # trend_hr is [most_recent, ..., oldest] from the form
        # We want oldest → newest for the LSTM sequence (time increasing)
        hr_samples = list(reversed(trend_hr))  # now oldest → newest

        # Interpolate/extrapolate to exactly 10 steps
        if len(hr_samples) < 10:
            x_old = np.linspace(0, 1, len(hr_samples))
            x_new = np.linspace(0, 1, 10)
            hr_samples = np.interp(x_new, x_old, hr_samples).tolist()

        # Build the 10-step array: vary HR, keep other vitals fixed
        sequence = []
        for i in range(10):
            step = base_row.copy()
            step[0] = hr_samples[i]  # index 0 = HR
            # Recompute MAP for this step using base SBP/DBP
            step[4] = (step[3] + 2 * step[5]) / 3
            sequence.append(step)

        return np.array(sequence).reshape(1, 10, 7)
    else:
        # Fallback: repeat single reading 10 times
        seq = np.repeat(base_row.reshape(1, -1), 10, axis=0)
        return seq.reshape(1, 10, 7)


def _explain_risk(df: pd.DataFrame) -> List[str]:
    reasons = []
    if df["O2Sat"][0] < 92:
        reasons.append("Low Oxygen Saturation")
    if df["Temp"][0] > 38:
        reasons.append("High Temperature")
    if df["HR"][0] > 100:
        reasons.append("High Heart Rate")
    if df["Resp"][0] > 22:
        reasons.append("High Respiratory Rate")
    if df["MAP"][0] < 65:
        reasons.append("Low Blood Pressure")
    return reasons or ["Elevated vital patterns"]


def _apply_clinical_overrides(risk: float, df: pd.DataFrame) -> float:
    if df["O2Sat"][0] < 85:
        risk = max(risk, 0.85)
    if df["Temp"][0] > 39:
        risk = max(risk, 0.75)
    if df["HR"][0] > 160:
        risk = max(risk, 0.70)
    if df["MAP"][0] < 55:
        risk = max(risk, 0.80)
    return risk


def _determine_risk_level(risk: float) -> str:
    if risk < 0.30:
        return "GREEN"
    elif risk < 0.60:
        return "YELLOW"
    return "RED"


# ─── Public API ─────────────────────────────────────────────────────────────────

def run_prediction(vitals_data: Dict[str, Any], patient_id: str = "default",
                   existing_trend: List[float] = None,
                   trend_hr: Optional[List[float]] = None) -> Dict[str, Any]:
    """
    Run LSTM + XGBoost prediction from raw vitals.

    Args:
        vitals_data:    dict with keys HR/O2Sat/Temp/SBP/DBP/Resp (or mapped API names)
        patient_id:     patient identifier
        existing_trend: list of previous sepsis_risk values (from MongoDB)
        trend_hr:       optional list of historical HR readings [newest→oldest]
                        used to build a realistic LSTM time-series input

    Returns:
        dict with keys: patient_id, sepsis_risk, pattern_score, risk_level, reasons, trend
    """
    if not MODELS_LOADED:
        raise RuntimeError("ML models are not loaded. Cannot run prediction.")

    df = _map_features(vitals_data)
    reasons = _explain_risk(df)

    # LSTM — uses real time-series if trend_hr provided
    X_lstm = _build_lstm_input(df, trend_hr=trend_hr)
    pattern_score = float(_lstm_model.predict(X_lstm, verbose=0)[0][0])

    # XGBoost
    vital_means = df.values.mean(axis=0)
    xgb_raw = np.hstack([vital_means, pattern_score])
    norm = [
        xgb_raw[0] / 150, xgb_raw[1] / 100, xgb_raw[2] / 40,
        xgb_raw[3] / 200, xgb_raw[4] / 120, xgb_raw[5] / 120,
        xgb_raw[6] / 40,  xgb_raw[7],
    ]
    xgb_input = np.array(norm).reshape(1, -1)
    sepsis_risk = float(_xgb_model.predict_proba(xgb_input)[0][1])

    # Clinical overrides
    sepsis_risk = _apply_clinical_overrides(sepsis_risk, df)
    risk_level = _determine_risk_level(sepsis_risk)

    # Build trend (append current score to historical list, keep last 10)
    trend = list(existing_trend or [])
    trend.append(round(sepsis_risk, 4))
    trend = trend[-10:]

    return {
        "patient_id":    patient_id,
        "sepsis_risk":   round(sepsis_risk, 4),
        "pattern_score": round(pattern_score, 4),
        "risk_level":    risk_level,
        "reasons":       reasons,
        "trend":         trend,
    }


def maybe_create_alert(db_collections: Dict, patient_id: str, patient_name: str,
                       risk_level: str) -> bool:
    """
    Create an alert in MongoDB if risk_level is RED and no open alert exists.

    Returns True if a new alert was created; False otherwise.
    """
    if risk_level != "RED":
        return False

    alerts_col = db_collections["alerts"]

    # Check for existing unresolved alert
    existing = alerts_col.find_one({"patient_id": patient_id, "resolved": False})
    if existing:
        return False

    from datetime import datetime, timezone
    alert_doc = {
        "patient_id":    patient_id,
        "patient_name":  patient_name,
        "risk_level":    risk_level,
        "message":       f"High sepsis risk detected for patient {patient_name}. Immediate review required.",
        "timestamp":     datetime.now(timezone.utc).isoformat(),
        "acknowledged":  False,
        "resolved":      False,
        "resolved_at":   None,
        "treatmentNotes": None,
    }
    alerts_col.insert_one(alert_doc)
    return True

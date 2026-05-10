from datetime import datetime, timezone


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


MOCK_PATIENTS = [
    {
        "patient_id": "P001",
        "name": "James Mitchell",
        "age": 67,
        "gender": "Male",
        "bed_number": "301",
        "status": "active",
        "risk_level": "RED",
        "sepsis_risk": 0.78,
        "pattern_score": 0.82,
        "reasons": ["High Temperature", "Elevated Heart Rate", "Low Blood Pressure"],
        "trend": [0.45, 0.52, 0.68, 0.75, 0.78],
        "vitals": {
            "HR": 118,
            "O2Sat": 91,
            "Temp": 39.2,
            "SBP": 95,
            "DBP": 62,
            "MAP": 73,
            "Resp": 24,
        },
        "created_at": _now_iso(),
        "last_updated": _now_iso(),
    },
    {
        "patient_id": "P002",
        "name": "Margaret Chen",
        "age": 54,
        "gender": "Female",
        "bed_number": "302",
        "status": "active",
        "risk_level": "YELLOW",
        "sepsis_risk": 0.52,
        "pattern_score": 0.48,
        "reasons": ["Elevated Heart Rate", "High Respiratory Rate"],
        "trend": [0.32, 0.38, 0.45, 0.50, 0.52],
        "vitals": {
            "HR": 102,
            "O2Sat": 94,
            "Temp": 37.8,
            "SBP": 112,
            "DBP": 74,
            "MAP": 87,
            "Resp": 20,
        },
        "created_at": _now_iso(),
        "last_updated": _now_iso(),
    },
    {
        "patient_id": "P003",
        "name": "Robert Johnson",
        "age": 72,
        "gender": "Male",
        "bed_number": "303",
        "status": "active",
        "risk_level": "GREEN",
        "sepsis_risk": 0.22,
        "pattern_score": 0.18,
        "reasons": [],
        "trend": [0.18, 0.19, 0.20, 0.21, 0.22],
        "vitals": {
            "HR": 78,
            "O2Sat": 98,
            "Temp": 36.8,
            "SBP": 128,
            "DBP": 82,
            "MAP": 97,
            "Resp": 16,
        },
        "created_at": _now_iso(),
        "last_updated": _now_iso(),
    },
]


MOCK_ALERTS = [
    {
        "patient_id": "P001",
        "patient_name": "James Mitchell",
        "risk_level": "RED",
        "message": "High sepsis risk detected for patient James Mitchell. Immediate review required.",
        "timestamp": _now_iso(),
        "acknowledged": False,
        "resolved": False,
        "resolved_at": None,
        "treatmentNotes": None,
    }
]


def find_mock_patient(patient_id: str):
    return next((patient for patient in MOCK_PATIENTS if patient["patient_id"] == patient_id), None)


def mock_dashboard_stats() -> dict:
    total = len(MOCK_PATIENTS)
    critical = sum(1 for patient in MOCK_PATIENTS if patient["risk_level"] == "RED")
    warning = sum(1 for patient in MOCK_PATIENTS if patient["risk_level"] == "YELLOW")
    stable = sum(1 for patient in MOCK_PATIENTS if patient["risk_level"] == "GREEN")
    return {
        "total_patients": total,
        "critical_patients": critical,
        "warning_patients": warning,
        "stable_patients": stable,
    }
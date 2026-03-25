#!/usr/bin/env python3
"""
CareMind API - Deployment Verification Script
Checks that all components are properly configured and ready for deployment.
"""

import os
import sys
import json
from pathlib import Path

class Checker:
    def __init__(self):
        self.results = []
        self.root_path = Path(__file__).parent

    def check(self, name: str, condition: bool, details: str = ""):
        """Record a check result"""
        status = "✅ PASS" if condition else "❌ FAIL"
        self.results.append({
            "name": name,
            "status": status,
            "details": details
        })
        print(f"{status} {name}")
        if details:
            print(f"   └─ {details}")

    def verify_backend(self):
        """Verify backend setup"""
        print("\n🔍 Backend Verification")
        print("=" * 50)

        # Check main.py
        main_py = self.root_path / "backend" / "main.py"
        self.check(
            "Backend main.py exists",
            main_py.exists(),
            f"Path: {main_py}"
        )

        # Check requirements.txt
        req_txt = self.root_path / "backend" / "requirements.txt"
        self.check(
            "Backend requirements.txt exists",
            req_txt.exists(),
            f"Path: {req_txt}"
        )

        # Check routes
        routes_dir = self.root_path / "backend" / "routes"
        self.check(
            "Backend routes directory exists",
            routes_dir.exists(),
            f"Path: {routes_dir}"
        )

        # Check specific route files
        health_py = routes_dir / "health.py"
        self.check(
            "Health route exists",
            health_py.exists(),
            f"Path: {health_py}"
        )

        predictions_py = routes_dir / "predictions.py"
        self.check(
            "Predictions route exists",
            predictions_py.exists(),
            f"Path: {predictions_py}"
        )

        # Check models
        models_dir = self.root_path / "backend" / "models"
        lstm_model = models_dir / "caremind_lstm.h5"
        xgb_model = models_dir / "caremind_xgb.pkl"

        self.check(
            "LSTM model exists",
            lstm_model.exists(),
            f"Path: {lstm_model}"
        )

        self.check(
            "XGBoost model exists",
            xgb_model.exists(),
            f"Path: {xgb_model}"
        )

    def verify_frontend(self):
        """Verify frontend setup"""
        print("\n🎨 Frontend Verification")
        print("=" * 50)

        # Check env file
        env_file = self.root_path / "frontend" / ".env.local"
        has_env = env_file.exists()
        self.check(
            "Frontend .env.local exists",
            has_env,
            f"Path: {env_file}"
        )

        # Check services/api.ts
        api_service = self.root_path / "frontend" / "src" / "services" / "api.ts"
        self.check(
            "API service exists",
            api_service.exists(),
            f"Path: {api_service}"
        )

        # Check hooks
        hooks_dir = self.root_path / "frontend" / "src" / "hooks"
        connection_hook = hooks_dir / "useBackendConnection.ts"
        predictions_hook = hooks_dir / "usePredictions.ts"

        self.check(
            "useBackendConnection hook exists",
            connection_hook.exists(),
            f"Path: {connection_hook}"
        )

        self.check(
            "usePredictions hook exists",
            predictions_hook.exists(),
            f"Path: {predictions_hook}"
        )

        # Check components
        backend_status = self.root_path / "frontend" / "src" / "components" / "features" / "BackendStatus.tsx"
        prediction_example = self.root_path / "frontend" / "src" / "components" / "features" / "PredictionExample.tsx"

        self.check(
            "BackendStatus component exists",
            backend_status.exists(),
            f"Path: {backend_status}"
        )

        self.check(
            "PredictionExample component exists",
            prediction_example.exists(),
            f"Path: {prediction_example}"
        )

        # Check debug utils
        debug_utils = self.root_path / "frontend" / "src" / "lib" / "apiDebugUtils.ts"
        self.check(
            "API debug utilities exist",
            debug_utils.exists(),
            f"Path: {debug_utils}"
        )

    def verify_documentation(self):
        """Verify documentation"""
        print("\n📚 Documentation Verification")
        print("=" * 50)

        docs = [
            ("QUICK_START.md", "Quick start guide"),
            ("PRODUCTION_INTEGRATION.md", "Production integration guide"),
            ("DOCKER_DEPLOYMENT.md", "Docker deployment guide"),
            ("INTEGRATION_SUMMARY.md", "Integration summary"),
            ("README.md", "Main README"),
        ]

        for filename, description in docs:
            file_path = self.root_path / filename
            self.check(
                f"{description}",
                file_path.exists(),
                f"Path: {file_path}"
            )

    def verify_dependencies(self):
        """Verify dependencies are listed"""
        print("\n📦 Dependencies Verification")
        print("=" * 50)

        backend_req = self.root_path / "backend" / "requirements.txt"
        frontend_pkg = self.root_path / "frontend" / "package.json"

        backend_ok = backend_req.exists() and backend_req.stat().st_size > 0
        frontend_ok = frontend_pkg.exists() and frontend_pkg.stat().st_size > 0

        self.check(
            "Backend dependencies listed",
            backend_ok,
            f"Path: {backend_req}"
        )

        self.check(
            "Frontend dependencies listed",
            frontend_ok,
            f"Path: {frontend_pkg}"
        )

    def print_summary(self):
        """Print verification summary"""
        print("\n" + "=" * 50)
        print("📊 VERIFICATION SUMMARY")
        print("=" * 50)

        total = len(self.results)
        passed = sum(1 for r in self.results if "✅" in r["status"])
        failed = total - passed

        print(f"\nTotal Checks: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")

        if failed == 0:
            print("\n🎉 All checks passed! Ready for development.")
            return True
        else:
            print(f"\n⚠️  {failed} issue(s) found. See details above.")
            return False

def main():
    """Run all checks"""
    checker = Checker()

    print("╔════════════════════════════════════════════════╗")
    print("║   CareMind AI - Deployment Verification        ║")
    print("╚════════════════════════════════════════════════╝")

    checker.verify_backend()
    checker.verify_frontend()
    checker.verify_documentation()
    checker.verify_dependencies()

    success = checker.print_summary()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()

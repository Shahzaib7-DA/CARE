#!/usr/bin/env python3
"""
Setup script for CareMind Python environment
"""

import subprocess
import sys
import os

def run_command(command):
    """Run a command and handle errors"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {command}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"✗ Error running: {command}")
        print(f"Error: {e.stderr}")
        return None

def main():
    print("Setting up Python environment for CareMind...")
    
    # Check if Python is installed
    python_version = run_command("python --version")
    if not python_version:
        print("Python is not installed or not in PATH")
        return
    
    print(f"Using {python_version.strip()}")
    
    # Upgrade pip
    print("\nUpgrading pip...")
    run_command("python -m pip install --upgrade pip")
    
    # Install requirements
    print("\nInstalling requirements...")
    if os.path.exists("requirements.txt"):
        run_command("pip install -r requirements.txt")
    else:
        print("requirements.txt not found")
    
    # Verify installation
    print("\nVerifying key packages...")
    packages_to_check = [
        "numpy", "pandas", "scikit-learn", "xgboost", 
        "tensorflow", "flask", "fastapi"
    ]
    
    for package in packages_to_check:
        result = run_command(f"python -c \"import {package}; print(f'{package}: {{package.__version__}}')\"")
        if result:
            print(f"  {result.strip()}")
    
    print("\n✓ Setup complete!")

if __name__ == "__main__":
    main()
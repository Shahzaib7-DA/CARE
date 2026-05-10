import os
import pymongo
from pymongo import MongoClient
from pymongo.errors import ConfigurationError, ConnectionFailure, ServerSelectionTimeoutError
from env_utils import load_backend_env

# Load environment variables from the backend .env file
load_backend_env()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("WARNING: MONGO_URI not found in environment. Running in API-only mode.")
    client = None  # type: ignore
    DB_CONNECTED = False
else:
    # Create a single MongoClient instance to be reused across the application
    try:
        client: MongoClient = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,  # 5 second timeout for connection
            connectTimeoutMS=10000,
        )
        # The ismaster command is cheap and does not require auth.
        client.admin.command("ismaster")
        print("INFO: Connected to MongoDB Atlas successfully!")
        DB_CONNECTED = True
    except (ConfigurationError, ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"WARNING: MongoDB connection failed: {e}")
        print("   API will start but database operations will fail.")
        client = None  # type: ignore
        DB_CONNECTED = False

# Database name
DB_NAME = "caremind"

def get_database():
    """Return the MongoDB database instance."""
    if client is None:
        raise RuntimeError("MongoDB client is not initialized. Check MONGO_URI and network.")
    return client[DB_NAME]

def get_collections():
    """Return a dict of all collection references used by the application."""
    db = get_database()
    return {
        "patients":       db["patients"],
        "vitals_history": db["vitals_history"],
        "alerts":         db["alerts"],
        "predictions":    db["predictions"],
    }

# Module-level collection shortcuts (lazy — only called after startup)
def get_patients_col():
    return get_database()["patients"]

def get_vitals_col():
    return get_database()["vitals_history"]

def get_alerts_col():
    return get_database()["alerts"]

def get_predictions_col():
    return get_database()["predictions"]

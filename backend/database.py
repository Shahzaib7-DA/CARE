import os
from dotenv import load_dotenv
import pymongo
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Load environment variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI not found in environment. Please check your .env file.")

# Create a single MongoClient instance to be reused across the application
try:
    client: MongoClient = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,  # 5 second timeout for connection
        connectTimeoutMS=10000,
    )
    # The ismaster command is cheap and does not require auth.
    client.admin.command("ismaster")
    print("✅ Connected to MongoDB Atlas successfully!")
    DB_CONNECTED = True
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print(f"⚠️  MongoDB connection failed: {e}")
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

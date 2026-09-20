import os
import sys
from dotenv import load_dotenv

# Add the current directory to sys.path so we can import 'api'
sys.path.append(os.getcwd())

load_dotenv()

from pymongo import MongoClient
import traceback

def test_mongo():
    uri = os.getenv("MONGODB_URI")
    if not uri:
        print("ERROR: MONGODB_URI not set in environment")
        return

    print(f"Testing connection to: {uri.split('@')[-1]}")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        print("SUCCESS: MongoDB connection successful!")
        
        db_name = uri.split("/")[-1].split("?")[0] or "tracely"
        db = client[db_name]
        print(f"Successfully accessed database: {db_name}")
        
        # Try to list collections
        colls = db.list_collection_names()
        print(f"Collections in {db_name}: {colls}")
        
    except Exception as e:
        print(f"FAILED: MongoDB connection error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_mongo()

"""
api/users.py — MongoDB user profile store for Tracely.

Collection: tracely.users
Each document:
{
  "sub":        "google-oauth2|123456",   # Auth0 user ID (primary key)
  "email":      "user@gmail.com",
  "name":       "Jane Doe",
  "picture":    "https://lh3.googleusercontent.com/...",
  "role":       "MANUFACTURER",           # locked after first selection
  "created_at": "2026-03-14T09:00:00Z",
  "last_login": "2026-03-14T14:00:00Z"
}
"""

import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any

# Lazy-load pymongo so the rest of the app works even if not installed
try:
    from pymongo import MongoClient
    from pymongo.errors import PyMongoError
    _MONGO_AVAILABLE = True
except ImportError:
    _MONGO_AVAILABLE = False
    print("[users] pymongo not installed — user DB unavailable", flush=True)

_client = None
_collection = None


def _get_collection():
    """Return the users collection, creating the connection on first call."""
    global _client, _collection
    if _collection is not None:
        return _collection

    if not _MONGO_AVAILABLE:
        return None

    uri = os.getenv("MONGODB_URI")
    if not uri:
        print("[users] MONGODB_URI not set — user DB unavailable", flush=True)
        return None

    try:
        _client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Pick database from URI or fall back to 'tracely'
        db_name = uri.split("/")[-1].split("?")[0] or "tracely"
        db = _client[db_name]
        _collection = db["users"]
        # Create index on sub for fast lookups
        _collection.create_index("sub", unique=True)
        print(f"[users] Connected to MongoDB — db: {db_name}", flush=True)
        return _collection
    except Exception as e:
        print(f"[users] MongoDB connection failed: {e}", flush=True)
        return None


def get_user(sub: str) -> Optional[Dict[str, Any]]:
    """Fetch a user by their Auth0 sub. Returns None if not found."""
    col = _get_collection()
    if col is None:
        return None
    try:
        doc = col.find_one({"sub": sub}, {"_id": 0})
        return doc
    except Exception as e:
        print(f"[users] get_user error: {e}", flush=True)
        return None


def upsert_user(
    sub: str,
    email: str,
    name: str,
    picture: str = "",
    role: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Create or update a user.
    - If user is NEW: set role (if provided) and created_at.
    - If user EXISTS: update last_login only; role is NEVER overwritten.
    Returns the final user document.
    """
    col = _get_collection()
    now = datetime.now(timezone.utc).isoformat()

    if col is None:
        # Fallback — return a minimal dict so the app doesn't crash
        return {
            "sub": sub,
            "email": email,
            "name": name,
            "picture": picture,
            "role": role,
            "created_at": now,
            "last_login": now,
        }

    try:
        existing = col.find_one({"sub": sub}, {"_id": 0})

        if existing:
            # Returning user — only update last_login + name/picture
            col.update_one(
                {"sub": sub},
                {"$set": {"last_login": now, "name": name, "picture": picture}},
            )
            existing["last_login"] = now
            return existing
        else:
            # New user — create full document
            doc = {
                "sub": sub,
                "email": email,
                "name": name,
                "picture": picture,
                "role": role,   # None if not yet selected
                "created_at": now,
                "last_login": now,
            }
            col.insert_one({**doc})
            return doc

    except Exception as e:
        print(f"[users] upsert_user error: {e}", flush=True)
        return {"sub": sub, "email": email, "name": name, "picture": picture, "role": role}


def set_role(sub: str, role: str) -> bool:
    """
    Permanently set a user's role. Only works if user has no role yet.
    Returns True on success, False if user already has a role.
    """
    col = _get_collection()
    if col is None:
        return True  # Graceful fallback

    try:
        existing = col.find_one({"sub": sub}, {"_id": 0, "role": 1})
        if existing and existing.get("role") and existing.get("role") != 'null':
            # Role already set — do NOT overwrite
            print(f"[users] Role already set for {sub}: {existing['role']}", flush=True)
            return False

        res = col.update_one(
            {"sub": sub},
            {"$set": {"role": role}},
            upsert=True,
        )
        print(f"[users] Role set for {sub}: {role} (modified_count: {res.modified_count})", flush=True)
        return True
    except Exception as e:
        print(f"[users] set_role error: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return False


def delete_user(sub: str) -> bool:
    """Permanently delete a user profile from the database."""
    col = _get_collection()
    if col is None:
        return False
    try:
        res = col.delete_one({"sub": sub})
        print(f"[users] Deleted user {sub} (deleted_count: {res.deleted_count})", flush=True)
        return res.deleted_count > 0
    except Exception as e:
        print(f"[users] delete_user error: {e}", flush=True)
        return False

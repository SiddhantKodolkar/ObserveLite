from datetime import datetime, timedelta
from typing import Dict, List
from collections import defaultdict

# In-memory tracker of failed logins: user_id → list[timestamps]
failed_logins: Dict[str, List[datetime]] = defaultdict(list)

def tag_alert(log) -> str:
    """Determine alert level based on log content."""
    if log["service"] != "auth-service" or log["level"] != "ERROR":
        return "info"

    user_id = log.get("context", {}).get("user_id")
    timestamp = log["timestamp"]

    if not user_id:
        return "info"

    # Convert ISO string to datetime if needed
    if isinstance(timestamp, str):
        timestamp = datetime.fromisoformat(timestamp)

    # Keep only recent failures (last 60 sec)
    failed_logins[user_id] = [
        t for t in failed_logins[user_id]
        if t > timestamp - timedelta(seconds=60)
    ]
    failed_logins[user_id].append(timestamp)

    count = len(failed_logins[user_id])
    if count >= 5:
        return "critical"
    elif count >= 3:
        return "warn"
    return "info"

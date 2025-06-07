import requests
import random
import time
from datetime import datetime, timezone
from uuid import uuid4

# Endpoint URL
INGEST_URL = "http://localhost:8000/ingest"

# Sample services and messages
SERVICES = [
    "auth-service",
    "payment-service",
    "api-gateway",
    "user-service",
    "analytics-service",
    "inventory-service",
    "notification-service",
    "order-service",
    "search-service",
    "recommendation-engine"
]

LEVELS = ["INFO", "WARN", "ERROR"]

MESSAGES = {
    "auth-service": [
        "Login successful",
        "Failed login attempt",
        "User locked out",
        "JWT token expired",
        "Password reset requested"
    ],
    "payment-service": [
        "Payment processed",
        "Card declined",
        "Refund issued",
        "3DS authentication failed",
        "Payment gateway timeout"
    ],
    "api-gateway": [
        "Route /api/v1/data hit",
        "Rate limit exceeded",
        "Gateway timeout",
        "Invalid API key",
        "Service unavailable"
    ],
    "user-service": [
        "Profile updated",
        "Password changed",
        "User deleted",
        "Email verified",
        "User created"
    ],
    "analytics-service": [
        "Page view logged",
        "Session timeout",
        "User funnel tracked",
        "Conversion recorded",
        "Realtime dashboard updated"
    ],
    "inventory-service": [
        "Product stock updated",
        "Out of stock alert",
        "New item added",
        "Inventory sync complete",
        "SKU validation failed"
    ],
    "notification-service": [
        "Email sent",
        "SMS delivery failed",
        "Push notification queued",
        "User unsubscribed",
        "Email bounce detected"
    ],
    "order-service": [
        "Order placed",
        "Order cancelled",
        "Order shipped",
        "Order failed",
        "Tracking info updated"
    ],
    "search-service": [
        "Query executed",
        "Autocomplete cache hit",
        "Search timed out",
        "No results found",
        "Search index updated"
    ],
    "recommendation-engine": [
        "Recommended products fetched",
        "Collaborative filtering fallback",
        "Personalized suggestions sent",
        "User model updated",
        "Cold start strategy applied"
    ]
}

def generate_log(session_id):
    service = random.choice(SERVICES)
    level = random.choices(LEVELS, weights=[70, 20, 10])[0]
    message = random.choice(MESSAGES[service])
    now = datetime.now(timezone.utc).isoformat()

    return {
        "service": service,
        "timestamp": now,
        "level": level,
        "message": message,
        "context": {
            "ip": f"192.168.1.{random.randint(1, 255)}",
            "user_id": f"user{random.randint(1000, 9999)}"
        },
        "correlation_id": session_id
    }

def start_sending_logs(interval=3):
    print("📤 Sending fake logs every", interval, "seconds...")
    while True:
        # Start a new flow/session every 5 logs
        session_id = str(uuid4())
        for _ in range(5):
            log = generate_log(session_id)
            response = requests.post(INGEST_URL, json=log)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"{status} {log['timestamp']} | {log['service']} | {log['level']} | {log['message']} | corr_id: {session_id}")
            time.sleep(interval)

if __name__ == "__main__":
    start_sending_logs()

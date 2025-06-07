from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class LogEntry(BaseModel):
    service: str
    timestamp: datetime
    level: str
    message: str
    context: Optional[Dict] = None
    correlation_id: str
    alert_level: Optional[str] = "none"

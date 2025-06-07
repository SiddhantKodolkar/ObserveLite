from typing import List
from app.schemas import LogEntry

logs_db: List[LogEntry] = []

def store_log(log: LogEntry):
    logs_db.append(log)

def get_logs() -> List[LogEntry]:
    return logs_db

def export_logs() -> str:
    return "\n".join([log.json() for log in logs_db])

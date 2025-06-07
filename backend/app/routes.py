from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select,func,String, cast, text
from app.schemas import LogEntry
from app.models import logs
from app.database import database
from app.storage import export_logs
from fastapi.responses import StreamingResponse
import io
from typing import List
from app.processor import tag_alert
from datetime import datetime, timedelta
from app.models import logs as logs_table
from sqlalchemy.dialects.postgresql import JSONB

router = APIRouter()

# ✅ Track active WebSocket clients
active_connections: List[WebSocket] = []

@router.post("/ingest")
async def ingest_log(log: LogEntry):
    log_dict = log.dict()

    # 🧠 Add alert level
    alert_level = tag_alert(log_dict)
    log_dict["alert_level"] = alert_level

    # ✅ Save to DB
    query = logs.insert().values(**log_dict)
    await database.execute(query)

    # ✅ Send to all active WebSocket clients
    disconnected_clients = []
    for client in active_connections:
        try:
            await client.send_text(log.json())
        except Exception:
            disconnected_clients.append(client)

    # ❌ Remove dead clients
    for client in disconnected_clients:
        if client in active_connections:
            active_connections.remove(client)

    return {"status": "stored"}


@router.get("/logs")
async def get_logs(service: str = None, level: str = None):
    query = logs.select()
    if service:
        query = query.where(logs.c.service == service)
    if level:
        query = query.where(logs.c.level == level)

    results = await database.fetch_all(query)
    return [dict(r) for r in results]


@router.get("/stats")
async def get_system_stats():
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)

    query = select(
        func.count().filter(logs.c.level == 'INFO').label("info_count"),
        func.count().filter(logs.c.level == 'WARN').label("warn_count"),
        func.count().filter(logs.c.level == 'ERROR').label("error_count"),
        func.count(func.distinct(logs.c.correlation_id)).label("session_count"),
        func.count(func.distinct(logs.c.context[('user_id')].cast(JSONB))).label("unique_users"),
    )

    result = await database.fetch_one(query)
    return {
        "info": result["info_count"],
        "warn": result["warn_count"],
        "error": result["error_count"],
        "sessions": result["session_count"],
        "unique_users": result["unique_users"]
    }

@router.get("/export")
async def export():
    content = export_logs()
    buffer = io.StringIO(content)
    return StreamingResponse(buffer, media_type="text/plain", headers={"Content-Disposition": "attachment; filename=logs.jsonl"})


@router.get("/logs/timeseries")
async def get_time_series():
    query = text("""
        SELECT 
            date_trunc('second', timestamp) + interval '1 second' * (extract(second from timestamp)::int / 3 * 3) as interval_time,
            COUNT(*) FILTER (WHERE level = 'INFO') AS info,
            COUNT(*) FILTER (WHERE level = 'WARN') AS warn,
            COUNT(*) FILTER (WHERE level = 'ERROR') AS error
        FROM logs
        WHERE timestamp > now() - interval '5 minutes'
        GROUP BY interval_time
        ORDER BY interval_time ASC
    """)
    rows = await database.fetch_all(query)
    return [{
        "time": row["interval_time"].isoformat(),
        "INFO": row["info"],
        "WARN": row["warn"],
        "ERROR": row["error"]
    } for row in rows]


@router.get("/session/{correlation_id}")
async def get_session_logs(correlation_id: str):
    query = logs.select().where(logs.c.correlation_id == correlation_id)
    results = await database.fetch_all(query)
    return [dict(r) for r in results]


@router.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keeps it alive
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)

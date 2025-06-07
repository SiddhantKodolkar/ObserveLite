from sqlalchemy import Table, Column, String, DateTime, JSON
from app.database import metadata
from sqlalchemy.sql import func

logs = Table(
    "logs",
    metadata,
    Column("timestamp", DateTime(timezone=True), default=func.now()),
    Column("service", String, nullable=False),
    Column("level", String, nullable=False),
    Column("message", String, nullable=False),
    Column("context", JSON),
    Column("correlation_id", String),
    Column("alert_level", String, default="none")
)

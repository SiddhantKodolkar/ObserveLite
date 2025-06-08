# ObserveLite

**ObserveLite** is a real-time log monitoring dashboard built with FastAPI and Next.js. It allows seamless tracking, filtering, and visualization of logs across distributed systems. Designed with performance and usability in mind, the app helps engineers debug, analyze, and observe log data effortlessly.

---

## 🚀 Features

- 🔄 **Real-Time Log Streaming** using WebSockets
- 📊 **System Stats Dashboard** (INFO, WARN, ERROR logs, sessions, unique users)
- 🕒 **Time-Series Line Chart** for log trends, updating every 3 seconds
- 📁 **Live Log Table View** with zebra stripes and sticky headers
- 🎯 **Alerts View** to filter only `WARN` and `ERROR` logs
- 🔍 **Dynamic Log Filters** (time range, service, level, user ID, correlation ID)
- 📤 **Export Logs** as `.jsonl` or `.csv`
- 🔐 **Admin Login** with session protection (`/admin`)
- 🧠 **Session-wise Log Viewer** with user context and detailed traceability
- ⚡ **Redis-powered Caching** for system stats and dashboard logs
- 🎨 Clean, responsive UI with TailwindCSS and minimal latency

---

## 📸 Screenshots

> _Screenshots go here. You can drag and drop images or paste image URLs._

- ![Dashboard View](screenshots/dashboard.png)
- ![Alerts Only View](screenshots/alerts.png)
- ![Log Chart](screenshots/log-chart.png)
- ![Admin Panel](screenshots/admin.png)

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Recharts (for graphs)
- Client-side routing, session auth with localStorage

**Backend**
- FastAPI
- PostgreSQL (log storage)
- Redis (cache)
- WebSockets (real-time log updates)
- SQLAlchemy Core

---

## 🧪 How It Works

- Logs are sent and stored in PostgreSQL.
- Stats and table data are cached in Redis and updated every 3 seconds.
- The frontend polls system stats and charts periodically and renders logs dynamically.
- Clicking a `Correlation ID` opens a full session trace.
- Admin access is protected; only `/admin` is public.

---

## 🚦 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/SiddhantKodolkar/ObserveLite.git
cd ObserveLite

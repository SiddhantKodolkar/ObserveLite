'use client'

import { useEffect, useState } from 'react'

export default function SystemStats() {
  const [stats, setStats] = useState({
    info: 0,
    warn: 0,
    error: 0,
    sessions: 0,
    unique_users: 0
  })

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/stats")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error("Failed to load system stats:", err)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-6 border border-blue-500 rounded-lg p-6 bg-white shadow-sm">
      <h2 className="text-xl font-bold text-blue-600 mb-4">System Stats</h2>
      <div className="flex justify-around text-center text-gray-700">
        <div>
          <div className="text-2xl font-bold">{stats.info}</div>
          <div className="text-sm mt-1">📊 INFO Logs</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.warn}</div>
          <div className="text-sm mt-1">⚠️ WARN Logs</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.error}</div>
          <div className="text-sm mt-1">❌ ERROR Logs</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.sessions}</div>
          <div className="text-sm mt-1">🔗 Sessions</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.unique_users}</div>
          <div className="text-sm mt-1">👤 Unique Users</div>
        </div>
      </div>
    </div>
  )
}

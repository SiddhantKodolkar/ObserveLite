"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LogFilterBar from "../../components/LogFilterTable";
import SystemStats from "../../components/SystemStats";

const LogChart = dynamic(() => import("../../components/LogLineChart"), {
  ssr: false,
});

type Log = {
  timestamp: string;
  service: string;
  level: "INFO" | "WARN" | "ERROR";
  alert_level: string;
  message: string;
  correlation_id: string;
  context?: {
    ip: string;
    user_id: string;
  };
};

type TimePoint = {
  time: string;
  INFO: number;
  WARN: number;
  ERROR: number;
};

export default function DashboardPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimePoint[]>([]);
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:8000/logs");
        const data: Log[] = await res.json();
        setLogs(data.reverse());
      } catch (err) {
        console.error("Failed to fetch initial logs:", err);
      }
    };

    const fetchTimeSeries = async () => {
      try {
        const res = await fetch("http://localhost:8000/logs/timeseries");
        const data: TimePoint[] = await res.json();
        setTimeSeries(data.slice(-20));
      } catch (err) {
        console.error("Failed to fetch time series:", err);
      }
    };

    fetchLogs();
    fetchTimeSeries();

    const ws = new WebSocket("ws://localhost:8000/ws/logs");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const newLog: Log = JSON.parse(event.data);
      setLogs((prev) => [newLog, ...prev.slice(0, 100)]);

      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setTimeSeries((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.time === timeLabel) {
          return prev.map((point, i) =>
            i === prev.length - 1
              ? {
                  ...point,
                  [newLog.level]:
                    ((point[newLog.level as keyof TimePoint] as number) || 0) +
                    1,
                }
              : point
          );
        } else {
          const newPoint: TimePoint = {
            time: timeLabel,
            INFO: 0,
            WARN: 0,
            ERROR: 0,
          };
          newPoint[newLog.level] = 1;
          return [...prev.slice(-19), newPoint];
        }
      });
    };

    return () => ws.close();
  }, []);

  const displayedLogs = showAlertsOnly
    ? logs.filter((log) => log.level === "ERROR")
    : logs;

  const handleExport = async () => {
    try {
      const res = await fetch("http://localhost:8000/logs/export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "logs.jsonl"; // or logs.csv depending on backend
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export logs:", err);
    }
  };

  const [filters, setFilters] = useState({
    timeStart: "",
    timeEnd: "",
    service: "",
    level: "",
    user: "",
    correlationId: "",
  });

  const filteredLogs = displayedLogs.filter((log) => {
    const logHM = new Date(log.timestamp).toTimeString().slice(0, 5); // "HH:MM"

    const inTimeRange =
      (!filters.timeStart || logHM >= filters.timeStart) &&
      (!filters.timeEnd || logHM <= filters.timeEnd);

    return (
      inTimeRange &&
      (!filters.service || log.service.includes(filters.service)) &&
      (!filters.level || log.level.includes(filters.level)) &&
      (!filters.user || log.context?.user_id?.includes(filters.user)) &&
      (!filters.correlationId ||
        log.correlation_id.includes(filters.correlationId))
    );
  });

  return (
    <main className="p-6">
      <h1 className="text-3xl text-center font-bold mb-6">Admin Dashboard</h1>
      <SystemStats />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ObserveLite Logs</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-1 rounded bg-blue-600 text-white text-sm shadow hover:bg-blue-700"
            onClick={handleExport}
          >
            Export Logs
          </button>
          <button
            className="px-4 py-1 rounded bg-red-600 text-white text-sm shadow hover:bg-red-700"
            onClick={() => setShowAlertsOnly((prev) => !prev)}
          >
            {showAlertsOnly ? "View All Logs" : "View Alerts"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("isAdmin");
              window.location.href = "/admin";
            }}
            className="px-3 py-1 bg-gray-200 text-sm rounded ml-4"
          >
            Logout
          </button>
        </div>
      </div>

      <h3 className="font-bold mb-3">Filter by:</h3>

      <LogFilterBar onFilterChange={setFilters} />

      <div className="overflow-auto max-h-[70vh] border rounded shadow">
        <table className="w-full table-auto text-sm border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Correlation ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-2 text-gray-800 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-4 py-2 text-gray-800">{log.service}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold
              ${log.level === "INFO" ? "bg-blue-100 text-blue-700" : ""}
              ${log.level === "WARN" ? "bg-yellow-100 text-yellow-800" : ""}
              ${log.level === "ERROR" ? "bg-red-100 text-red-700" : ""}
            `}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">{log.message}</td>
                <td className="px-4 py-2 text-gray-700">
                  {log.context?.user_id}
                </td>
                <td className="px-4 py-2">
                  <Link href={`/session/${log.correlation_id}`}>
                    <span className="text-blue-600 hover:underline break-all">
                      {log.correlation_id}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LogChart timeSeries={timeSeries} />
    </main>
  );
}

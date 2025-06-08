"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SessionLogs() {
  const router = useRouter();
  const { id } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/session/${id}`)
      .then((res) => res.json())
      .then(setLogs);
  }, [id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Logs for Session ID : <span className="text-blue-700">{id}</span>
        </h1>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Time
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Service
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Level
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Alert
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Message
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any, idx: number) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2">{log.service}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${log.level === "INFO" ? "bg-blue-100 text-blue-700" : ""}
                      ${
                        log.level === "WARN"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        log.level === "ERROR" ? "bg-red-100 text-red-700" : ""
                      }`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="px-4 py-2 capitalize text-gray-600">
                  {log.alert_level || "none"}
                </td>
                <td className="px-4 py-2">{log.message}</td>
                <td className="px-4 py-2">{log.context?.user_id || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

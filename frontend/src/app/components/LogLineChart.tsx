'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type TimePoint = {
  time: string
  INFO: number
  WARN: number
  ERROR: number
}

interface LogChartProps {
  timeSeries: TimePoint[]
}

export default function LogChart({ timeSeries }: LogChartProps) {
  return (
    <div className="mt-8 p-4 rounded-lg border shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Log Level Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeSeries}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            stroke="#374151"
            label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#374151"
            label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 2 }}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value: number, name: string) => [`${value}`, name.toUpperCase()]}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="INFO" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="WARN" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ERROR" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

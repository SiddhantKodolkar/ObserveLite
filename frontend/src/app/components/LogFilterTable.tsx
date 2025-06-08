"use client";

import { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: {
    timeStart: string;
    timeEnd: string;
    service: string;
    level: string;
    user: string;
    correlationId: string;
  }) => void;
}

const SERVICES = [
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
];

export default function LogFilterBar({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    timeStart: "",
    timeEnd: "",
    service: "",
    level: "",
    user: "",
    correlationId: "",
  });

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetTime = () => {
    const newFilters = { ...filters, timeStart: "", timeEnd: "" };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetAll = () => {
    const cleared = {
      timeStart: "",
      timeEnd: "",
      service: "",
      level: "",
      user: "",
      correlationId: "",
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="mb-4 p-4 bg-gray-200 border border-black rounded flex flex-wrap items-end gap-4">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Start Time</label>
        <input
          type="time"
          value={filters.timeStart}
          onChange={(e) => handleChange("timeStart", e.target.value)}
          className="border px-2 py-1 rounded-full text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">End Time</label>
        <input
          type="time"
          value={filters.timeEnd}
          onChange={(e) => handleChange("timeEnd", e.target.value)}
          className="border px-2 py-1 rounded-full text-sm"
        />
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={resetTime}
          className="text-sm text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
        >
          Reset Time
        </button>
        
      </div>

      <select
        value={filters.service}
        onChange={(e) => handleChange("service", e.target.value)}
        className="border px-2 py-1 rounded-full text-sm"
      >
        <option value="">All Services</option>
        {SERVICES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.level}
        onChange={(e) => handleChange("level", e.target.value)}
        className="border px-2 py-1 rounded-full text-sm"
      >
        <option value="">Levels</option>
        <option value="INFO">INFO</option>
        <option value="WARN">WARN</option>
        <option value="ERROR">ERROR</option>
      </select>

      <input
        type="text"
        placeholder="User ID"
        className="border px-2 py-1 rounded-full text-sm"
        value={filters.user}
        onChange={(e) => handleChange("user", e.target.value)}
      />
      <input
        type="text"
        placeholder="Correlation ID"
        className="border px-2 py-1 rounded-full text-sm"
        value={filters.correlationId}
        onChange={(e) => handleChange("correlationId", e.target.value)}
      />
      <button
          onClick={resetAll}
          className="text-sm text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          Reset All
        </button>
    </div>
  );
}

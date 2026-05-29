"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProgressChartProps {
  data: { day: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-[#a1a1aa] mb-1">{label}</p>
        <p className="text-orange-400 font-medium">
          {payload[0].value} problems solved
        </p>
      </div>
    );
  }
  return null;
};

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-white font-semibold mb-6">Problems Solved (30 Days)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="day"
              stroke="#71717a"
              tick={{ fill: "#71717a", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#2a2a2a" }}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: "#71717a", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#2a2a2a" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", stroke: "#f97316", strokeWidth: 2, r: 4 }}
              activeDot={{ fill: "#f97316", stroke: "#0c0c0c", strokeWidth: 3, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

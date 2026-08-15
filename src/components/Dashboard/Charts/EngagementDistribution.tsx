"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EngagementDistributionProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ["#22c55e", "#a1a1aa", "#d97706", "#16a34a"];

export default function EngagementDistribution({
  data,
}: EngagementDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium text-neutral-600 mb-4">
        Engagement Distribution
      </h3>
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="block text-2xl font-bold text-neutral-900">
              {total}
            </span>
            <span className="block text-xs text-neutral-500">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
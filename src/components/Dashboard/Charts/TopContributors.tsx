
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopContributorsProps {
  data: Array<{
    name: string;
    contributions: number;
  }>;
}

export default function TopContributors({ data }: TopContributorsProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-xl dark:bg-neutral-300">
      <h3 className="mb-4 text-sm font-medium text-neutral-600">
        Top Contributors
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, bottom: 5, left: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e4e4e7"
            />

            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#52525b" }}
            />

            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
              axisLine={false}
              width={50}
              dx={-30}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
              cursor={{ fill: "#f4f4f5" }}
            />

            <Bar
              dataKey="contributions"
              name="Contributions"
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#22c55e" : "#a1a1aa"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
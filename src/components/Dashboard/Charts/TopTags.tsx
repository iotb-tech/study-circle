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

interface TopTagsProps {
  data: Array<{
    tag: string;
    count: number;
  }>;
}

const tagColors = [
  "#22c55e",
  "#a1a1aa",
  "#d97706",
  "#86efac",
  "#dc2626",
  "#27272a",
  "#16a34a",
  "#16a34a",
];

export default function TopTags({ data }: TopTagsProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium text-neutral-600 mb-4">
        Most Used Tags
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="tag"
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
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
            <Bar dataKey="count" name="Posts" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={tagColors[index % tagColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
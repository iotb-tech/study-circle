"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyActivityProps {
  data: Array<{
    day: string;
    posts: number;
    comments: number;
  }>;
}

export default function WeeklyActivity({ data }: WeeklyActivityProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium text-neutral-600 mb-4">
        Weekly Activity
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="day"
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
            <Bar dataKey="posts" fill="#22c55e" radius={[4, 4, 0, 0]} name="Posts" />
            <Bar dataKey="comments" fill="#52525b" radius={[4, 4, 0, 0]} name="Comments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
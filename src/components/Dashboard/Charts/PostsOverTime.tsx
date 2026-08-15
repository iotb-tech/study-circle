"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PostsOverTimeProps {
  data: Array<{
    date: string;
    posts: number;
    comments: number;
    votes: number;
  }>;
}

export default function PostsOverTime({ data }: PostsOverTimeProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium text-neutral-600 mb-4">
        Activity Over Time
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#52525b" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e4e4e7",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Posts"
            />
            <Line
              type="monotone"
              dataKey="comments"
              stroke="#52525b"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Comments"
            />
            <Line
              type="monotone"
              dataKey="votes"
              stroke="#d97706"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Votes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
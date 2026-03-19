"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function FollowersGrowthChart({ data }) {
  return (
    <div className="card min-w-0">
      <h3 className="mb-4 text-base font-semibold">Followers Growth</h3>
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="followers" stroke="#0e7490" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EngagementChart({ data }) {
  const tooltipFormatter = (value, _name, entry) => {
    const platform = entry?.payload?.platform || "-";
    return [`${Number(value).toFixed(2)}%`, `Engagement (${platform})`];
  };

  return (
    <div className="card min-w-0">
      <h3 className="mb-4 text-base font-semibold">Engagement Comparison</h3>
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayName" interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar dataKey="engagementRate" fill="#0891b2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CreatorTrendsChart({ data }) {
  return (
    <div className="card min-w-0">
      <h3 className="mb-4 text-base font-semibold">Creator Trend</h3>
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="followers" />
            <YAxis yAxisId="engagement" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="followers" type="monotone" dataKey="followers" stroke="#0e7490" strokeWidth={2} dot={false} />
            <Line
              yAxisId="engagement"
              type="monotone"
              dataKey="engagementRate"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

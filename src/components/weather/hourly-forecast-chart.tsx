"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatTime } from "@/lib/formatters";
import type { HourlyForecast } from "@/types/weather";

type HourlyForecastChartProps = {
  hourly: HourlyForecast[];
};

export function HourlyForecastChart({ hourly }: HourlyForecastChartProps) {
  const chartData = hourly.slice(0, 24).map((hour) => ({
    time: formatTime(hour.time),
    temperature: Math.round(hour.temperature),
    rainProbability: Math.round(hour.precipitationProbability),
    windGusts: Math.round(hour.windGusts),
  }));

  return (
    <div className="grid gap-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} />
            <YAxis tickLine={false} width={36} />
            <Tooltip />
            <Line
              dataKey="temperature"
              name="Temperature °C"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickLine={false} />
              <YAxis tickLine={false} width={36} />
              <Tooltip />
              <Bar
                dataKey="rainProbability"
                name="Rain probability %"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickLine={false} />
              <YAxis tickLine={false} width={36} />
              <Tooltip />
              <Line
                dataKey="windGusts"
                name="Wind gusts km/h"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

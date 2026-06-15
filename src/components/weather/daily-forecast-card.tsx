import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatDate,
  formatMillimeters,
  formatPercent,
  formatSpeed,
  formatTemperature,
} from "@/lib/formatters";
import type { DailyForecast } from "@/types/weather";

type DailyForecastCardProps = {
  daily: DailyForecast[];
  compact?: boolean;
};

export function DailyForecastCard({ daily, compact }: DailyForecastCardProps) {
  const visibleDays = daily.slice(0, compact ? 5 : 7);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>7-Day Forecast Overview</CardDescription>
        <CardTitle>Daily Outlook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleDays.map((day, index) => (
          <div key={day.date}>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{formatDate(day.date)}</p>
                <p className="truncate text-muted-foreground">
                  {day.condition.label}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatTemperature(day.temperatureMin)} /{" "}
                  {formatTemperature(day.temperatureMax)}
                </p>
                <p className="text-muted-foreground">
                  {formatPercent(day.precipitationProbabilityMax)} rain ·{" "}
                  {formatSpeed(day.windGustsMax)}
                </p>
              </div>
            </div>
            {index < visibleDays.length - 1 ? (
              <Separator className="mt-3" />
            ) : null}
          </div>
        ))}
        {!compact ? (
          <p className="text-xs text-muted-foreground">
            Peak precipitation:{" "}
            {formatMillimeters(
              Math.max(...daily.map((day) => day.precipitationSum))
            )}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

import { CloudSun, Droplets, Gauge, Wind } from "lucide-react";

import { RiskBadges } from "@/components/weather/risk-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatMillimeters,
  formatPressure,
  formatSpeed,
  formatTemperature,
} from "@/lib/formatters";
import type { WeatherResponse } from "@/types/weather";

type CurrentWeatherCardProps = {
  weather: WeatherResponse;
};

export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardDescription>Current Conditions</CardDescription>
            <CardTitle className="mt-2 text-4xl">
              {formatTemperature(weather.current.temperature)}
            </CardTitle>
          </div>
          <CloudSun className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadges risk={weather.current.risk} />
          <span className="text-sm text-muted-foreground">
            {weather.current.condition.label}
          </span>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-muted-foreground" />
            Humidity {weather.current.humidity}%
          </div>
          <div className="flex items-center gap-2">
            <Wind className="size-4 text-muted-foreground" />
            Wind {formatSpeed(weather.current.windSpeed)}
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-muted-foreground" />
            {formatPressure(weather.current.pressure)}
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-muted-foreground" />
            Rain {formatMillimeters(weather.current.rain)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Feels like {formatTemperature(weather.current.feelsLike)} with gusts
          up to {formatSpeed(weather.current.windGusts)}.
        </p>
      </CardContent>
    </Card>
  );
}

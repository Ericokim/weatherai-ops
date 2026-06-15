import {
  CalendarClock,
  Cloud,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Wind,
} from "lucide-react";

import { AiSummaryCard } from "@/components/insights/ai-summary-card";
import { PageHeader } from "@/components/layout/page-header";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { DailyForecastCard } from "@/components/weather/daily-forecast-card";
import { RiskBadges } from "@/components/weather/risk-badges";
import { WeatherMetricCard } from "@/components/weather/weather-metric-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatMillimeters,
  formatPercent,
  formatSpeed,
  formatTemperature,
  formatTime,
} from "@/lib/formatters";
import { DEFAULT_LOCATION, getForecast } from "@/lib/open-meteo-client";
import { normalizeWeatherResponse } from "@/lib/weather-normalizer";

type DashboardLocation = {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

async function getForecastForLocation(location: DashboardLocation) {
  const forecast = await getForecast({
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    days: 7,
  });

  return normalizeWeatherResponse(forecast.data, {
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    requestUrl: forecast.requestUrl,
  });
}

export async function DashboardPage({
  location = DEFAULT_LOCATION,
}: {
  location?: DashboardLocation;
}) {
  const weather = await getForecastForLocation(location);
  const today = weather.daily[0];
  const nextRainHour = weather.hourly.find(
    (hour) => hour.precipitationProbability >= 40
  );
  const bestWindow =
    weather.hourly.find(
      (hour) =>
        hour.isDay &&
        hour.precipitationProbability < 30 &&
        hour.windGusts < 30 &&
        hour.uvIndex < 6
    ) ?? weather.hourly[0];

  return (
    <>
      <PageHeader
        title="Good morning, Eric"
        description={`Location: ${weather.location.name} · Data source: Open-Meteo · AI source: Gemini`}
      />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr_1fr]">
        <CurrentWeatherCard weather={weather} />
        <DailyForecastCard daily={weather.daily} compact />
        <AiSummaryCard risk={weather.current.risk} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardDescription>Risk Signals</CardDescription>
            <CardTitle className="text-lg">{weather.current.risk}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <RiskBadges risk={weather.current.risk} />
            <p className="text-sm text-muted-foreground">
              Rain, wind, UV, and cloud cover evaluated locally.
            </p>
          </CardContent>
        </Card>
        <WeatherMetricCard
          title="Best Action Window"
          value={bestWindow ? formatTime(bestWindow.time) : "Pending"}
          description="Lowest near-term risk window"
          icon={<CalendarClock className="size-5" />}
        />
        <WeatherMetricCard
          title="UV Index"
          value={String(Math.round(today?.uvIndexMax ?? 0))}
          description="Daily maximum"
          icon={<Sun className="size-5" />}
        />
        <WeatherMetricCard
          title="Air Quality"
          value="Placeholder"
          description="Ready for future AQI provider"
          icon={<Eye className="size-5" />}
        />
        <WeatherMetricCard
          title="Sunrise / Sunset"
          value={`${today ? formatTime(today.sunrise) : "--"} / ${
            today ? formatTime(today.sunset) : "--"
          }`}
          description="Local timezone"
          icon={<Sunrise className="size-5" />}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <WeatherMetricCard
          title="Temperature"
          value={formatTemperature(weather.current.temperature)}
          description={`Feels like ${formatTemperature(weather.current.feelsLike)}`}
          icon={<Gauge className="size-5" />}
        />
        <WeatherMetricCard
          title="Precipitation"
          value={formatMillimeters(weather.current.precipitation)}
          description={
            nextRainHour
              ? `Next elevated rain chance around ${formatTime(nextRainHour.time)}`
              : "No elevated rain chance in the near-term data"
          }
          icon={<CloudRain className="size-5" />}
        />
        <WeatherMetricCard
          title="Rain probability"
          value={formatPercent(today?.precipitationProbabilityMax ?? 0)}
          description="Daily maximum probability"
          icon={<Droplets className="size-5" />}
        />
        <WeatherMetricCard
          title="Wind gusts"
          value={formatSpeed(weather.current.windGusts)}
          description={`Direction ${Math.round(weather.current.windDirection)}°`}
          icon={<Wind className="size-5" />}
        />
        <WeatherMetricCard
          title="Cloud cover"
          value={formatPercent(weather.current.cloudCover)}
          description={weather.current.condition.label}
          icon={<Cloud className="size-5" />}
        />
        <WeatherMetricCard
          title="Visibility / Dew point"
          value="Placeholder"
          description="Reserved for expanded meteorological fields"
          icon={<Eye className="size-5" />}
        />
      </section>
    </>
  );
}

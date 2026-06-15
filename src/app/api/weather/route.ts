import { DEFAULT_LOCATION, getForecast } from "@/lib/open-meteo-client";
import { normalizeWeatherResponse } from "@/lib/weather-normalizer";

export const dynamic = "force-dynamic";

function parseNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const latitude = parseNumber(
    searchParams.get("lat"),
    DEFAULT_LOCATION.latitude
  );
  const longitude = parseNumber(
    searchParams.get("lon"),
    DEFAULT_LOCATION.longitude
  );
  const timezone = searchParams.get("timezone") ?? DEFAULT_LOCATION.timezone;
  const days = parseNumber(searchParams.get("days"), 7);

  try {
    const forecast = await getForecast({
      latitude,
      longitude,
      timezone,
      days,
    });
    const data = normalizeWeatherResponse(forecast.data, {
      name: DEFAULT_LOCATION.name,
      latitude,
      longitude,
      timezone,
      requestUrl: forecast.requestUrl,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Weather request failed",
      },
      { status: 502 }
    );
  }
}

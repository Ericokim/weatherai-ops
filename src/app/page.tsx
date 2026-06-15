import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { DEFAULT_LOCATION } from "@/lib/open-meteo-client";

export const dynamic = "force-dynamic";

type DashboardRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function DashboardRoute({
  searchParams,
}: DashboardRouteProps) {
  const params = await searchParams;
  const location = {
    name: first(params.name) ?? DEFAULT_LOCATION.name,
    latitude: parseNumber(first(params.lat), DEFAULT_LOCATION.latitude),
    longitude: parseNumber(first(params.lon), DEFAULT_LOCATION.longitude),
    timezone: first(params.timezone) ?? DEFAULT_LOCATION.timezone,
  };

  return <DashboardPage location={location} />;
}

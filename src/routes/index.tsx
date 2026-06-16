import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { DashboardSkeleton } from '@/components/shared/LoadingState'
import { RouteErrorComponent } from '@/components/shared/RouteError'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DailyForecast } from '@/components/weather/DailyForecast'
import { HourlyTrend } from '@/components/weather/HourlyTrend'
import { WeatherHero } from '@/components/weather/WeatherHero'
import { WeatherInsights } from '@/components/weather/WeatherInsights'
import { normalizeDateRange } from '@/constants/data'
import { useWeatherApp } from '@/context'
import { useForecast, useGeminiInsight } from '@/lib/queries'
import { forecastQueryOptions } from '@/lib/queries/queryOptions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    try {
      const stored =
        typeof window !== 'undefined' ? localStorage.getItem('weatherai-app-state') : null
      if (!stored) return
      const state = JSON.parse(stored)
      const loc = state.selectedLocation
      const u = state.units
      const dateRange = normalizeDateRange(state.dateRange)
      if (!loc || !u) return
      const location: GeoLocation = {
        id: loc.id,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        country: loc.country,
        countryCode: loc.countryCode,
        admin1: loc.admin1,
        timezone: loc.timezone,
      }
      const units: Units = {
        temperature: u.temperature || 'celsius',
        windSpeed: u.windSpeed || 'kmh',
        precipitation: u.precipitation || 'mm',
      }
      await context.queryClient.ensureQueryData(
        forecastQueryOptions(location, units, dateRange)
      )
    } catch {
      // loader is best-effort; component handles its own fetch
    }
  },
  errorComponent: RouteErrorComponent,
  pendingComponent: DashboardSkeleton,
  component: Home,
})

function Home() {
  const { data, isFetching } = useForecast()
  if (!data) return <DashboardSkeleton />
  return <Dashboard forecast={data} isFetching={isFetching} />
}

function Dashboard({ forecast, isFetching }: { forecast: Forecast; isFetching: boolean }) {
  const { units } = useWeatherApp()
  const aiInsight = useGeminiInsight(forecast)

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <WeatherHero forecast={forecast} units={units} />

      <Tabs defaultValue="hourly" className="min-w-0 gap-4">
        <TabsList>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">7-Day</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <div
          aria-busy={isFetching}
          className="relative max-w-full min-w-0 rounded-3xl border border-border bg-card p-5 text-card-foreground"
        >
          {isFetching ? (
            <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-(--chip-bg) px-2.5 py-1 font-semibold text-(--lagoon-deep) text-xs shadow-sm">
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              Updating…
            </span>
          ) : null}

          <div className={cn('transition-opacity', isFetching && 'opacity-60')}>
            <TabsContent value="hourly" className="min-w-0 overflow-hidden">
              <div className="mb-4">
                <h2 className="font-bold">Next 24 hours</h2>
                <p className="text-muted-foreground text-sm">
                  Temperature, rain, humidity, wind, and UV by hour.
                </p>
              </div>
              <HourlyTrend hours={forecast.hourly} units={units} />
            </TabsContent>

            <TabsContent value="daily" className="min-w-0">
              <h2 className="mb-3 font-bold">Daily forecast</h2>
              <DailyForecast days={forecast.daily} units={units} />
            </TabsContent>

            <TabsContent value="insights" className="min-w-0">
              <h2 className="mb-4 font-bold">Today's advisories</h2>
              <WeatherInsights
                forecast={forecast}
                aiInsight={aiInsight.data}
                aiPending={aiInsight.isFetching}
                aiError={aiInsight.isError}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </section>
  )
}

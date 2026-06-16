import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { DashboardSkeleton } from '#/components/shared/LoadingState'
import { RouteErrorComponent } from '#/components/shared/RouteError'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { DailyForecast } from '#/components/weather/DailyForecast'
import { HourlyTrend } from '#/components/weather/HourlyTrend'
import { WeatherHero } from '#/components/weather/WeatherHero'
import { WeatherInsights } from '#/components/weather/WeatherInsights'
import { useWeatherApp } from '#/context'
import { useGeminiInsight } from '#/lib/queries'
import { forecastQueryOptions } from '#/lib/queries/queryOptions'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    try {
      const stored =
        typeof window !== 'undefined' ? localStorage.getItem('weatherai-app-state') : null
      if (!stored) return
      const state = JSON.parse(stored)
      const loc = state.selectedLocation
      const u = state.units
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
        temperature: u.temperature ?? 'celsius',
        windSpeed: u.windSpeed ?? 'kmh',
        precipitation: u.precipitation ?? 'mm',
      }
      await context.queryClient.ensureQueryData(forecastQueryOptions(location, units))
    } catch {
      // loader is best-effort; component handles its own fetch
    }
  },
  errorComponent: RouteErrorComponent,
  pendingComponent: DashboardSkeleton,
  component: Home,
})

function Home() {
  const { selectedLocation, units } = useWeatherApp()
  const { data } = useSuspenseQuery(forecastQueryOptions(selectedLocation, units))
  const aiInsight = useGeminiInsight(data)

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <WeatherHero forecast={data} units={units} />

      <Tabs defaultValue="hourly" className="min-w-0 gap-4">
        <TabsList>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">7-Day</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <div className="max-w-full min-w-0 rounded-3xl border border-border bg-card p-5 text-card-foreground">
          <TabsContent value="hourly" className="min-w-0 overflow-hidden">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-bold">Next 24 hours</h2>
                <p className="text-muted-foreground text-sm">
                  Temperature, rain, humidity, wind, and UV by hour.
                </p>
              </div>
            </div>
            <HourlyTrend hours={data.hourly} units={units} />
          </TabsContent>
          <TabsContent value="daily" className="min-w-0">
            <h2 className="mb-3 font-bold">7-day forecast</h2>
            <DailyForecast days={data.daily} units={units} />
          </TabsContent>
          <TabsContent value="insights" className="min-w-0">
            <h2 className="mb-4 font-bold">Today's advisories</h2>
            <WeatherInsights
              forecast={data}
              aiInsight={aiInsight.data}
              aiPending={aiInsight.isFetching}
              aiError={aiInsight.isError}
            />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}

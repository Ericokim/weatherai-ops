import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { LoadingState } from '#/components/shared/LoadingState'
import { PageHeader } from '#/components/shared/PageHeader'
import { RouteErrorComponent } from '#/components/shared/RouteError'
import { useWeatherApp } from '#/context'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/locations')({
  component: Locations,
  errorComponent: RouteErrorComponent,
  pendingComponent: () => <LoadingState label="Loading locations…" />,
})

function Locations() {
  const { selectedLocation, recentLocations, setSelectedLocation } = useWeatherApp()
  const locations = recentLocations.length > 0 ? recentLocations : [selectedLocation]

  return (
    <section className="grid gap-5">
      <PageHeader title="Locations" description="Places you've recently searched." />

      <div className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground">
        {locations.map((location) => {
          const isActive = location.id === selectedLocation.id
          const region = [location.admin1, location.country].filter(Boolean).join(', ')
          return (
            <button
              key={location.id}
              type="button"
              onClick={() => setSelectedLocation(location)}
              className={cn(
                'flex w-full items-center justify-between gap-3 border-border border-b p-4 text-left transition last:border-b-0 hover:bg-accent',
                isActive && 'bg-accent/60'
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <MapPin className="size-4 shrink-0 text-(--lagoon-deep)" />
                <span className="min-w-0">
                  <strong className="block truncate">{location.name}</strong>
                  <span className="truncate text-muted-foreground text-sm">{region}</span>
                </span>
              </span>
              {isActive ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary text-xs">
                  Selected
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <p className="text-muted-foreground text-sm">
        Use the search bar to find and switch to a city.
      </p>
    </section>
  )
}

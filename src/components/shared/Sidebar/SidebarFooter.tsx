import { useWeatherApp } from '#/context'

export function SidebarFooter() {
  const { selectedLocation } = useWeatherApp()

  return (
    <div className="island-shell mt-auto rounded-2xl p-4 text-sm">
      <div className="mb-1.5 flex items-center justify-between gap-3 font-bold text-(--sea-ink)">
        <span className="inline-flex min-w-0 items-center gap-2">
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--palm) opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-(--palm)" />
          </span>
          <span className="truncate">{selectedLocation.name}</span>
        </span>
        <span className="shrink-0 text-(--sea-ink-soft) text-xs">Live</span>
      </div>
      <p className="truncate text-(--sea-ink-soft) text-xs leading-5">
        Open-Meteo · {selectedLocation.timezone ?? 'auto'}
      </p>
    </div>
  )
}

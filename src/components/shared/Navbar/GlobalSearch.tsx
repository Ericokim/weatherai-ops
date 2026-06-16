import { useNavigate } from '@tanstack/react-router'
import { Loader2, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useWeatherApp } from '@/context'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useLocationSearch } from '@/lib/queries'

function locationLabel(location: GeoLocation) {
  return [location.admin1, location.country].filter(Boolean).join(', ')
}

export function GlobalSearch() {
  const navigate = useNavigate()
  const { setSelectedLocation } = useWeatherApp()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debounced = useDebouncedValue(query, 650)
  const { data: results = [], isFetching } = useLocationSearch(debounced)

  function select(location: GeoLocation) {
    setSelectedLocation(location)
    setQuery('')
    setOpen(false)
    navigate({ to: '/' })
  }

  const showResults = open && debounced.trim().length >= 2

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (results[0]) select(results[0])
      }}
      className="group relative w-full max-w-2xl"
    >
      <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.5 size-4 text-(--sea-ink-soft) transition group-focus-within:text-(--lagoon-deep)" />
      <Input
        type="search"
        aria-label="Search for a city"
        autoComplete="off"
        placeholder="Search a city, then press Enter…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="focus-ring-local h-11 w-full rounded-xl border-(--chip-line) bg-(--chip-bg) pr-4 pl-10 text-(--sea-ink) shadow-[0_1px_0_var(--inset-glint)_inset] transition placeholder:text-(--sea-ink-soft) focus-visible:border-(--lagoon) focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_oklab,var(--lagoon)_28%,transparent)]"
      />

      {showResults ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-(--chip-line) bg-popover py-1 shadow-lg">
          {isFetching && results.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-3 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" />
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-3 text-muted-foreground text-sm">No locations found.</div>
          ) : (
            results.map((location) => (
              <button
                key={location.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(location)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-(--sea-ink) text-sm transition hover:bg-(--link-bg-hover)"
              >
                <MapPin className="size-4 shrink-0 text-(--lagoon-deep)" />
                <span className="truncate font-medium">{location.name}</span>
                <span className="ml-auto truncate text-muted-foreground text-xs">
                  {locationLabel(location)}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </form>
  )
}

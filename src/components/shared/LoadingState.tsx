import { Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading weather intelligence…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center p-6">
      <div className="island-shell flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl p-6 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-(--chip-bg) text-(--lagoon-deep)">
          <Loader2 className="size-6 animate-spin" />
        </span>
        <div>
          <p className="font-bold text-(--sea-ink)">WeatherAI Ops</p>
          <p className="mt-1 text-muted-foreground text-sm">{label}</p>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <section className="grid gap-6" aria-label="Loading overview">
      <div className="island-shell h-72 animate-pulse rounded-[28px]" />
      <div className="h-12 w-64 animate-pulse rounded-2xl bg-card" />
      <div className="h-96 animate-pulse rounded-3xl bg-card" />
    </section>
  )
}

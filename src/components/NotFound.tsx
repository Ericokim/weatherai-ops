import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center p-6">
      <div className="island-shell max-w-md rounded-3xl p-6 text-center">
        <h1 className="font-black text-3xl text-(--sea-ink)">Page not found</h1>
        <div className="mt-2 text-muted-foreground text-sm">
          {children || <p>The page you are looking for does not exist.</p>}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl bg-(--palm) px-4 py-2 font-bold text-sm text-white"
          >
            Go back
          </button>
          <Link
            to="/"
            className="rounded-xl bg-(--lagoon-deep) px-4 py-2 font-bold text-sm text-white"
          >
            Start over
          </Link>
        </div>
      </div>
    </div>
  )
}

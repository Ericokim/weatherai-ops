import type { ErrorComponentProps } from '@tanstack/react-router'
import { ErrorComponent, Link, useLocation, useRouter } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useLocation({ select: (location) => location.pathname === '/' })

  console.error(error)

  return (
    <div className="flex min-h-[50dvh] min-w-0 flex-1 flex-col items-center justify-center gap-5 p-4">
      <div className="island-shell max-w-2xl rounded-3xl p-5">
        <ErrorComponent error={error} />
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="rounded-xl bg-[#328f97] px-4 py-2 font-bold text-sm text-white"
          >
            Try again
          </button>
          {isRoot ? (
            <Link
              to="/"
              className="rounded-xl bg-[#2f6a4a] px-4 py-2 font-bold text-sm text-white"
            >
              Home
            </Link>
          ) : (
            <Link
              to="/"
              className="rounded-xl bg-[#2f6a4a] px-4 py-2 font-bold text-sm text-white"
              onClick={(event) => {
                event.preventDefault()
                window.history.back()
              }}
            >
              Go back
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

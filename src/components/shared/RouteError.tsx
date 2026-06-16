import type { ErrorComponentProps } from '@tanstack/react-router'
import { ErrorComponent, useRouter } from '@tanstack/react-router'

export function RouteErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-[40dvh] items-center justify-center p-4">
      <div className="island-shell max-w-2xl rounded-3xl p-5">
        <ErrorComponent error={error} />
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-4 rounded-xl bg-(--lagoon-deep) px-4 py-2 font-bold text-sm text-white"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

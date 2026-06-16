import { animated, useSpring } from '@react-spring/web'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { RefreshCw } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary'
import { NotFound } from '@/components/NotFound'
import { LoadingState } from '@/components/shared/LoadingState'
import { AppBreadcrumbs, Navbar } from '@/components/shared/Navbar'
import { Sidebar } from '@/components/shared/Sidebar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { REFRESH_ICON_STYLE, THEME_INIT_SCRIPT } from '@/constants/data'
import { useWeatherApp, WeatherAppProvider } from '@/context'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { queryKeys } from '@/lib/queries/queryKeys'
import { cn } from '@/lib/utils'
import appCss from '@/styles.css?url'

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'WeatherAI Ops · Forecast intelligence' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'alternate icon', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
  }),
  component: RootDocument,
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => (
    <RootDocument>
      <NotFound />
    </RootDocument>
  ),
  pendingComponent: LoadingState,
})

function RootDocument({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const el = document.getElementById('app-loading')
    if (el) el.remove()
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script>{THEME_INIT_SCRIPT}</script>
        <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <BootLoading />
        <AppShell>{children ?? <Outlet />}</AppShell>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function BootLoading() {
  return (
    <div
      id="app-loading"
      className="flex min-h-screen items-center justify-center bg-[#e7f3ec]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 rounded-full border-[3px] border-[rgba(50,143,151,0.25)] border-t-[#328f97] [animation:spin_0.7s_linear_infinite]" />
        <span className="font-medium text-[#416166] text-sm">Loading WeatherAI Ops…</span>
      </div>
    </div>
  )
}

function RefreshButton() {
  const queryClient = useQueryClient()
  const { selectedLocation, units, dateRange } = useWeatherApp()
  const fetchingForecast = useIsFetching({ queryKey: ['forecast'] })
  const fetchingInsight = useIsFetching({ queryKey: ['gemini-insight'] })
  const loading = fetchingForecast + fetchingInsight > 0

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.forecast(selectedLocation, units, dateRange),
      refetchType: 'active',
    })
    queryClient.invalidateQueries({
      queryKey: ['gemini-insight'],
      refetchType: 'active',
    })
  }, [queryClient, selectedLocation, units, dateRange])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh weather data"
          className="size-9 rounded-xl border-0 text-white shadow-[0_4px_12px_rgba(50,143,151,0.35)] transition hover:opacity-90 disabled:opacity-70"
          style={REFRESH_ICON_STYLE}
        >
          <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{loading ? 'Refreshing…' : 'Refresh weather data'}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function AppShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const pageSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(8px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 230, friction: 28 },
  })

  return (
    <TooltipProvider>
      <WeatherAppProvider>
        <div className="min-h-screen bg-background text-foreground">
          <div className="flex min-h-screen">
            <Sidebar mobileOpen={mobileSidebarOpen} onMobileOpenChange={setMobileSidebarOpen} />
            <div className="flex min-w-0 flex-1 flex-col">
              <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />
              <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
                <AppBreadcrumbs />
                <RefreshButton />
              </div>
              <animated.main style={pageSpring} className="min-w-0 flex-1 p-4 sm:p-6">
                {children}
              </animated.main>
            </div>
          </div>
        </div>
      </WeatherAppProvider>
    </TooltipProvider>
  )
}

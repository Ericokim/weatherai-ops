import { animated, useSpring } from '@react-spring/web'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
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
import { DefaultCatchBoundary } from '#/components/DefaultCatchBoundary'
import { NotFound } from '#/components/NotFound'
import { LoadingState } from '#/components/shared/LoadingState'
import { AppBreadcrumbs, Navbar } from '#/components/shared/Navbar'
import { Sidebar } from '#/components/shared/Sidebar'
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useWeatherApp, WeatherAppProvider } from '#/context'
import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'
import { queryKeys } from '#/lib/queries/queryKeys'
import { cn } from '#/lib/utils'
import appCss from '#/styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('weatherai-theme');var mode=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='system'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='system'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;document.body.style.background=resolved==='dark'?'#0a1418':'#e7f3ec'}catch(e){}})();`

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
  pendingComponent: RoutePending,
})

function RoutePending() {
  return <LoadingState />
}

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
        <div
          id="app-loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#e7f3ec',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid rgba(50,143,151,0.25)',
                borderTopColor: '#328f97',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            <span
              style={{
                color: '#416166',
                fontSize: '14px',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              Loading WeatherAI Ops…
            </span>
          </div>
        </div>
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

const refreshIconStyle = {
  background: 'linear-gradient(150deg, var(--lagoon), var(--lagoon-deep))',
}

function RefreshButton() {
  const queryClient = useQueryClient()
  const { selectedLocation, units } = useWeatherApp()
  const fetchingForecast = useIsFetching({ queryKey: ['forecast'] })
  const fetchingInsight = useIsFetching({ queryKey: ['gemini-insight'] })
  const loading = fetchingForecast + fetchingInsight > 0

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.forecast(selectedLocation, units),
      refetchType: 'active',
    })
    queryClient.invalidateQueries({
      queryKey: ['gemini-insight'],
      refetchType: 'active',
    })
  }, [queryClient, selectedLocation, units])

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
          style={refreshIconStyle}
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

import { Link, useRouterState } from '@tanstack/react-router'
import { House } from 'lucide-react'
import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { navigation } from '@/constants/data'

const navItems = navigation.flatMap((group) => group.items)

function toLabel(segment: string) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Build a breadcrumb trail from the URL: home + one crumb per path segment. */
function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [{ label: 'WeatherAI Ops', href: '/' }]
  const segments = pathname.split('/').filter(Boolean)

  let href = ''
  for (const segment of segments) {
    href += `/${segment}`
    const match = navItems.find((item) => item.href === href)
    crumbs.push({ label: match?.title ?? toLabel(segment), href: match?.href ?? '/' })
  }

  if (segments.length === 0) {
    const overview = navItems.find((item) => item.href === '/')
    crumbs.push({ label: overview?.title ?? 'Overview', href: '/' })
  }

  return crumbs
}

export function AppBreadcrumbs() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="text-[var(--sea-ink-soft)]">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={`${crumb.href}-${crumb.label}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem className="min-w-0">
                {isLast ? (
                  <BreadcrumbPage className="truncate font-semibold text-[var(--sea-ink)]">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="truncate text-[var(--sea-ink-soft)] hover:text-[var(--lagoon-deep)]"
                  >
                    <Link to={crumb.href} className="inline-flex items-center gap-1.5">
                      {index === 0 ? <House className="size-3.5 shrink-0" /> : null}
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

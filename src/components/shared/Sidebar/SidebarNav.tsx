import { Link, useRouterState } from '@tanstack/react-router'
import { navigation } from '#/constants/data'
import { cn } from '#/lib/utils'

const iconGradient = {
  background: 'linear-gradient(150deg, var(--lagoon), var(--lagoon-deep))',
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <div className="grid gap-6">
      {navigation.map((group) => (
        <section key={group.label} className="grid gap-2">
          <h2 className="island-kicker px-3">{group.label}</h2>
          <nav aria-label={`${group.label} navigation`} className="grid gap-1">
            {group.items.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </section>
      ))}
    </div>
  )
}

function SidebarNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative flex min-h-11 items-center justify-between gap-3 rounded-xl px-2.5 py-2 font-semibold text-[var(--sea-ink-soft)] text-sm transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]',
        isActive && 'island-shell text-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]'
      )}
    >
      {isActive ? (
        <span
          className="-translate-y-1/2 absolute top-1/2 left-0 h-6 w-1 rounded-r-full"
          style={iconGradient}
        />
      ) : null}

      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-lg border transition',
            isActive
              ? 'border-transparent text-white'
              : 'border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)]'
          )}
          style={isActive ? iconGradient : undefined}
        >
          <Icon className="size-4" />
        </span>
        <span className="truncate">{item.title}</span>
      </span>

      {item.badge ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 font-bold text-[10px] text-[var(--lagoon-deep)] uppercase tracking-wide">
          {item.badge === 'Live' ? (
            <span className="size-1.5 animate-pulse rounded-full bg-[var(--lagoon)]" />
          ) : null}
          {item.badge}
        </span>
      ) : null}
    </Link>
  )
}

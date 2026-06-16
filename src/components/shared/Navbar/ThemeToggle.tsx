import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { storageKey, themes } from '#/constants/data'
import { navIconButton } from '#/lib/ui'
import { cn } from '#/lib/utils'

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('system')

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey) as ThemeMode | null
    setTheme(savedTheme ?? 'system')
  }, [])

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = theme === 'dark' || (theme === 'system' && prefersDark)

    document.documentElement.classList.toggle('dark', shouldUseDark)
    window.localStorage.setItem(storageKey, theme)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Select theme"
          className={navIconButton}
        >
          {theme === 'light' ? <Sun /> : null}
          {theme === 'dark' ? <Moon /> : null}
          {theme === 'system' ? <Monitor /> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="island-shell w-64 rounded-2xl border-(--chip-line) bg-(--surface-strong) p-2"
      >
        <div className="px-2 py-2">
          <p className="font-bold text-(--sea-ink) text-sm">Appearance</p>
          <p className="text-(--sea-ink-soft) text-xs">Choose your preferred theme.</p>
        </div>
        <div className="grid gap-1">
          {themes.map((item) => {
            const active = theme === item.value
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  active
                    ? 'bg-(--lagoon-deep) text-white shadow-sm'
                    : 'text-(--sea-ink) hover:bg-(--link-bg-hover)'
                )}
              >
                <span
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-xl border',
                    active
                      ? 'border-white/25 bg-white/15 text-white'
                      : 'border-(--chip-line) bg-(--chip-bg) text-(--lagoon-deep)'
                  )}
                >
                  <item.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-sm">{item.label}</span>
                  <span
                    className={cn(
                      'block text-xs',
                      active ? 'text-white/75' : 'text-(--sea-ink-soft)'
                    )}
                  >
                    {item.description}
                  </span>
                </span>
                {active ? <Check className="size-4 shrink-0" /> : null}
              </button>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

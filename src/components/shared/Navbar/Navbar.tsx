import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ForecastRangeFilter } from '@/components/weather/ForecastRangeFilter'
import { navIconButton } from '@/lib/ui'
import { GlobalSearch } from './GlobalSearch'
import { ThemeToggle } from './ThemeToggle'

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-[var(--line)] border-b px-4 py-2 backdrop-blur-xl lg:px-6"
      style={{
        background: 'var(--header-bg)',
        boxShadow: '0 6px 18px rgba(23, 58, 64, 0.04)',
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open sidebar"
            className={`${navIconButton} lg:hidden`}
            onClick={onMenuClick}
          >
            <Menu />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Open sidebar</TooltipContent>
      </Tooltip>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <GlobalSearch />
        <ForecastRangeFilter />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}

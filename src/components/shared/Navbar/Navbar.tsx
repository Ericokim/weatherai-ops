import { Menu } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import { navIconButton } from '#/lib/ui'
import { GlobalSearch } from './GlobalSearch'
import { ThemeToggle } from './ThemeToggle'

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-[var(--line)] border-b px-4 backdrop-blur-xl lg:px-6"
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

      <div className="flex flex-1 justify-center">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}

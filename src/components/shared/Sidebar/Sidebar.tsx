import { Link } from '@tanstack/react-router'
import { CloudSun } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { BRAND_GRADIENT } from '@/constants/data'
import { SidebarFooter } from './SidebarFooter'
import { SidebarNav } from './SidebarNav'

const panelStyle = {
  background:
    'linear-gradient(180deg, color-mix(in oklab, var(--foam) 80%, white), color-mix(in oklab, var(--sand) 42%, var(--foam)))',
}

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  return (
    <>
      <aside className="hidden h-screen w-72 shrink-0 border-[var(--line)] border-r lg:sticky lg:top-0 lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent className="w-72 border-[var(--line)] p-0" style={panelStyle}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarContent({ onNavigate }: SidebarNavProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-7 p-5" style={panelStyle}>
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-1">
        <span
          className="grid size-11 place-items-center rounded-2xl text-white shadow-[0_10px_24px_rgba(50,143,151,0.4)] ring-1 ring-white/40"
          style={{ background: BRAND_GRADIENT }}
        >
          <CloudSun className="size-5" />
        </span>
        <span className="grid leading-tight">
          <strong className="font-extrabold text-[15px] text-[var(--sea-ink)] tracking-tight">
            WeatherAI Ops
          </strong>
          <span className="text-[var(--sea-ink-soft)] text-xs">Forecast intelligence</span>
        </span>
      </Link>

      <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
        <SidebarNav onNavigate={onNavigate} />
      </div>

      <SidebarFooter />
    </div>
  )
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CloudSun,
  Code2,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Forecast Explorer",
    href: "/forecast",
    icon: CloudSun,
  },
  {
    label: "Locations",
    href: "/locations",
    icon: MapPin,
  },
  {
    label: "AI Insights",
    href: "/insights",
    icon: Bot,
  },
  {
    label: "SMS Preview",
    href: "/sms-preview",
    icon: MessageSquareText,
  },
  {
    label: "Developer / API Trace",
    href: "/developer",
    icon: Code2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[240px] shrink-0 border-r border-border bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-sidebar-border px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CloudSun className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                WeatherAI Ops
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Operations console
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

import { LayoutDashboard, MapPin, Monitor, Moon, Settings, Sun } from 'lucide-react'

export const navigation: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { title: 'Overview', href: '/', icon: LayoutDashboard },
      { title: 'Locations', href: '/locations', icon: MapPin },
    ],
  },
  {
    label: 'System',
    items: [{ title: 'Settings', href: '/settings', icon: Settings }],
  },
]

export const storageKey = 'weatherai-theme'
export const themes = [
  { value: 'light', label: 'Light', description: 'Bright dashboard', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Low-light mode', icon: Moon },
  { value: 'system', label: 'System', description: 'Match device', icon: Monitor },
] as const

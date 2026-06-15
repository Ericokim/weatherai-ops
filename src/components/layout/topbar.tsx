import { MapPin, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 md:px-6">
      <div className="relative hidden min-w-0 flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="h-9 max-w-md pl-9"
          placeholder="Search location or coordinates"
        />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          Nairobi, Kenya
        </Badge>
        <Badge variant="outline" className="hidden gap-1.5 sm:inline-flex">
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Last updated just now
        </Badge>
      </div>
    </header>
  );
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/weather";

type RiskBadgesProps = {
  risk: RiskLevel;
  label?: string;
};

const riskStyles: Record<RiskLevel, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Moderate: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-red-200 bg-red-50 text-red-700",
};

export function RiskBadges({ risk, label = "Risk" }: RiskBadgesProps) {
  return (
    <Badge variant="outline" className={cn("border", riskStyles[risk])}>
      {label}: {risk}
    </Badge>
  );
}

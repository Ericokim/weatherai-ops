import { Bot } from "lucide-react";

import { RiskBadges } from "@/components/weather/risk-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AiInsight, RiskLevel } from "@/types/weather";

type AiSummaryCardProps = {
  risk: RiskLevel;
  insight?: AiInsight;
};

export function AiSummaryCard({ risk, insight }: AiSummaryCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardDescription>AI Weather Advisory</CardDescription>
            <CardTitle>
              {insight?.source === "gemini" ? "Gemini Advisory" : "Local Advisory"}
            </CardTitle>
          </div>
          <Bot className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskBadges risk={risk} label="Deterministic risk" />
        <p className="text-sm leading-6 text-muted-foreground">
          {insight?.summary ??
            "AI insights unavailable until Gemini key is configured. Showing deterministic advisory from local risk engine."}
        </p>
      </CardContent>
    </Card>
  );
}

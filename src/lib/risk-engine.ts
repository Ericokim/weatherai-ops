import type { RiskLevel } from "@/types/weather";

type RiskInput = {
  rainProbability?: number;
  precipitation?: number;
  windGusts?: number;
  uvIndex?: number;
  cloudCover?: number;
};

export function calculateWeatherRisk(input: RiskInput): RiskLevel {
  let score = 0;

  if ((input.rainProbability ?? 0) >= 70) score += 2;
  else if ((input.rainProbability ?? 0) >= 40) score += 1;

  if ((input.precipitation ?? 0) >= 15) score += 2;
  else if ((input.precipitation ?? 0) >= 5) score += 1;

  if ((input.windGusts ?? 0) >= 55) score += 2;
  else if ((input.windGusts ?? 0) >= 30) score += 1;

  if ((input.uvIndex ?? 0) >= 8) score += 2;
  else if ((input.uvIndex ?? 0) >= 5) score += 1;

  if ((input.cloudCover ?? 0) >= 85) score += 1;

  if (score >= 5) return "High";
  if (score >= 2) return "Moderate";
  return "Low";
}

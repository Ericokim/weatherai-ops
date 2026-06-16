import { createServerFn } from '@tanstack/react-start'
import axios from 'axios'
import { z } from 'zod'

const hourlySignalSchema = z.object({
  time: z.string(),
  condition: z.string(),
  temperature: z.number(),
  apparentTemperature: z.number(),
  rainProbability: z.number(),
  precipitation: z.number(),
  windSpeed: z.number(),
  windGusts: z.number(),
  uvIndex: z.number(),
  cloudCover: z.number(),
  pressure: z.number(),
  dewPoint: z.number(),
})

const insightRequestSchema = z.object({
  location: z.string(),
  units: z.object({
    temperature: z.enum(['celsius', 'fahrenheit']),
    windSpeed: z.enum(['kmh', 'mph', 'ms', 'kn']),
    precipitation: z.enum(['mm', 'inch']),
  }),
  current: z.object({
    condition: z.string(),
    temperature: z.number(),
    apparentTemperature: z.number(),
    humidity: z.number(),
    precipitation: z.number(),
    windSpeed: z.number(),
    windGusts: z.number(),
    cloudCover: z.number(),
    pressure: z.number(),
    dewPoint: z.number(),
  }),
  today: z.object({
    tempMax: z.number(),
    tempMin: z.number(),
    rainProbability: z.number(),
    precipitationSum: z.number(),
    precipitationHours: z.number(),
    uvIndexMax: z.number(),
    windSpeedMax: z.number(),
    windGustsMax: z.number(),
    sunrise: z.string(),
    sunset: z.string(),
  }),
  nextHours: z.array(hourlySignalSchema).min(1).max(12),
})

function fallbackInsight(data: AiInsightRequest): AiInsight {
  const rainHigh = data.today.rainProbability >= 50
  const uvHigh = data.today.uvIndexMax >= 6
  const windHigh = data.today.windGustsMax >= 35
  const riskScore = Math.min(
    5,
    1 +
      Number(rainHigh) +
      Number(uvHigh) +
      Number(windHigh) +
      Number(data.current.humidity >= 85)
  ) as AiInsight['riskScore']

  return {
    summary: [
      rainHigh ? 'Rain probability is elevated today' : 'Rain is not the dominant constraint',
      uvHigh ? 'midday UV needs active management' : 'UV exposure is manageable',
      windHigh
        ? 'and gusts may affect exposed outdoor work.'
        : 'and wind remains within a workable range.',
    ].join(', '),
    riskScore,
    riskLevel: riskScore >= 4 ? 'high' : riskScore >= 3 ? 'medium' : 'low',
    recommendedActions: [
      rainHigh
        ? 'Keep outdoor plans flexible around rain windows.'
        : 'Proceed with outdoor plans, while monitoring later updates.',
      uvHigh
        ? 'Use shade, sunscreen, or schedule intense tasks outside peak UV.'
        : 'Normal sun precautions are sufficient for most plans.',
      windHigh
        ? 'Secure loose equipment and watch gust-sensitive work.'
        : 'Wind is unlikely to be the limiting factor.',
    ],
    keySignals: [
      `${Math.round(data.today.rainProbability)}% rain probability`,
      `UV max ${Math.round(data.today.uvIndexMax)}`,
      `${Math.round(data.today.windGustsMax)} ${data.units.windSpeed} max gusts`,
    ],
    confidence: 'medium',
  }
}

function buildPrompt(data: AiInsightRequest): string {
  return [
    'You are a concise weather operations analyst.',
    'Use only the supplied weather signals. Do not invent alerts, warnings, or certainty beyond the data.',
    'Return operational guidance for planning the next 6 to 12 hours.',
    `Location: ${data.location}`,
    `Units: temperature ${data.units.temperature}, wind ${data.units.windSpeed}, precipitation ${data.units.precipitation}`,
    `Current: ${data.current.condition}; temp ${data.current.temperature}; feels ${data.current.apparentTemperature}; humidity ${data.current.humidity}%; rain ${data.current.precipitation}; wind ${data.current.windSpeed}; gusts ${data.current.windGusts}; cloud ${data.current.cloudCover}%; pressure ${data.current.pressure}; dew point ${data.current.dewPoint}.`,
    `Today: high ${data.today.tempMax}; low ${data.today.tempMin}; rain probability ${data.today.rainProbability}%; precipitation ${data.today.precipitationSum}; rain hours ${data.today.precipitationHours}; UV ${data.today.uvIndexMax}; wind max ${data.today.windSpeedMax}; gust max ${data.today.windGustsMax}; sunrise ${data.today.sunrise}; sunset ${data.today.sunset}.`,
    `Next hours: ${data.nextHours
      .map(
        (hour) =>
          `${hour.time}: ${hour.condition}, temp ${hour.temperature}, feels ${hour.apparentTemperature}, rain ${hour.rainProbability}%, precip ${hour.precipitation}, wind ${hour.windSpeed}, gusts ${hour.windGusts}, UV ${hour.uvIndex}, cloud ${hour.cloudCover}%, pressure ${hour.pressure}, dew ${hour.dewPoint}`
      )
      .join('; ')}`,
    'Return strict JSON only with this TypeScript shape: {"summary":"string","riskScore":1|2|3|4|5,"riskLevel":"low"|"medium"|"high","recommendedActions":["string","string","string"],"keySignals":["string","string","string"],"confidence":"low"|"medium"|"high"}',
  ].join('\n')
}

function parseInsight(text: string, data: AiInsightRequest): AiInsight {
  try {
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/```$/i, '')
      .trim()
    const parsed = JSON.parse(cleaned) as Partial<AiInsight>
    const fallback = fallbackInsight(data)
    const riskScore =
      parsed.riskScore && parsed.riskScore >= 1 && parsed.riskScore <= 5
        ? (parsed.riskScore as AiInsight['riskScore'])
        : fallback.riskScore
    const riskLevel =
      parsed.riskLevel === 'low' || parsed.riskLevel === 'medium' || parsed.riskLevel === 'high'
        ? parsed.riskLevel
        : fallback.riskLevel
    const confidence =
      parsed.confidence === 'low' ||
      parsed.confidence === 'medium' ||
      parsed.confidence === 'high'
        ? parsed.confidence
        : fallback.confidence

    return {
      summary: parsed.summary?.trim() || fallback.summary,
      riskScore,
      riskLevel,
      recommendedActions: (parsed.recommendedActions ?? fallback.recommendedActions)
        .filter(Boolean)
        .slice(0, 3),
      keySignals: (parsed.keySignals ?? fallback.keySignals).filter(Boolean).slice(0, 3),
      confidence,
    }
  } catch {
    return fallbackInsight(data)
  }
}

export const getWeatherInsight = createServerFn({ method: 'POST' })
  .validator(insightRequestSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return fallbackInsight(data)

    const model = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash'
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [{ parts: [{ text: buildPrompt(data) }] }],
        generationConfig: {
          temperature: 0.25,
          responseMimeType: 'application/json',
        },
      },
      {
        params: { key: apiKey },
        timeout: 10_000,
      }
    )

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    return typeof text === 'string' && text.trim()
      ? parseInsight(text, data)
      : fallbackInsight(data)
  })

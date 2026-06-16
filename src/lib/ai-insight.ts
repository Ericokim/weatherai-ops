import { createServerFn } from '@tanstack/react-start'
import axios from 'axios'

const riskLevel = (score: number): AiInsight['riskLevel'] =>
  score >= 4 ? 'high' : score >= 3 ? 'medium' : 'low'

function fallbackInsight(data: AiInsightRequest): AiInsight {
  const score = Math.min(
    5,
    1 +
      Number(data.today.rainProbability >= 50) +
      Number(data.today.uvIndexMax >= 6) +
      Number(data.today.windGustsMax >= 35) +
      Number(data.current.humidity >= 85)
  ) as AiInsight['riskScore']

  return {
    summary: `Rain risk is ${Math.round(data.today.rainProbability)}%, UV peaks near ${Math.round(
      data.today.uvIndexMax
    )}, and gusts may reach ${Math.round(data.today.windGustsMax)} ${data.units.windSpeed}.`,
    riskScore: score,
    riskLevel: riskLevel(score),
    recommendedActions: [
      data.today.rainProbability >= 50
        ? 'Keep outdoor plans flexible around rain windows.'
        : 'Outdoor plans can proceed with normal monitoring.',
      data.today.uvIndexMax >= 6
        ? 'Avoid peak midday exposure or use sun protection.'
        : 'Normal sun precautions are enough for most activities.',
      data.today.windGustsMax >= 35
        ? 'Secure loose equipment and watch gust-sensitive work.'
        : 'Wind is not expected to be the main constraint.',
    ],
    keySignals: [
      `${Math.round(data.today.rainProbability)}% rain probability`,
      `UV max ${Math.round(data.today.uvIndexMax)}`,
      `${Math.round(data.today.windGustsMax)} ${data.units.windSpeed} gusts`,
    ],
    confidence: 'medium',
  }
}

function buildPrompt(data: AiInsightRequest): string {
  return [
    'You are a concise weather operations analyst.',
    'Use only this compact forecast JSON. Do not invent warnings.',
    'Return strict JSON: {"summary":"string","riskScore":1|2|3|4|5,"riskLevel":"low"|"medium"|"high","recommendedActions":["string","string","string"],"keySignals":["string","string","string"],"confidence":"low"|"medium"|"high"}',
    JSON.stringify(data),
  ].join('\n')
}

function parseInsight(text: string, fallback: AiInsight): AiInsight {
  try {
    const parsed = JSON.parse(
      text
        .replace(/^```json\s*/i, '')
        .replace(/```$/i, '')
        .trim()
    )
    const score = Number(parsed.riskScore)

    return {
      summary: String(parsed.summary || fallback.summary),
      riskScore:
        score >= 1 && score <= 5 ? (score as AiInsight['riskScore']) : fallback.riskScore,
      riskLevel: ['low', 'medium', 'high'].includes(parsed.riskLevel)
        ? parsed.riskLevel
        : fallback.riskLevel,
      recommendedActions: Array.isArray(parsed.recommendedActions)
        ? parsed.recommendedActions.slice(0, 3).map(String)
        : fallback.recommendedActions,
      keySignals: Array.isArray(parsed.keySignals)
        ? parsed.keySignals.slice(0, 3).map(String)
        : fallback.keySignals,
      confidence: ['low', 'medium', 'high'].includes(parsed.confidence)
        ? parsed.confidence
        : fallback.confidence,
    }
  } catch {
    return fallback
  }
}

function geminiConfig() {
  const { GEMINI_API_KEY, GEMINI_MODEL = 'gemini-1.5-flash' } = process.env
  return GEMINI_API_KEY ? { apiKey: GEMINI_API_KEY, model: GEMINI_MODEL } : null
}

export const getWeatherInsight = createServerFn({ method: 'POST' })
  .validator((data: AiInsightRequest) => data)
  .handler(async ({ data }) => {
    const config = geminiConfig()
    const fallback = fallbackInsight(data)
    if (!config) return fallback

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
        {
          contents: [{ parts: [{ text: buildPrompt(data) }] }],
          generationConfig: { temperature: 0.25, responseMimeType: 'application/json' },
        },
        { params: { key: config.apiKey }, timeout: 10_000 }
      )

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
      return typeof text === 'string' ? parseInsight(text, fallback) : fallback
    } catch {
      return fallback
    }
  })

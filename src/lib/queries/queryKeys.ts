/** Central query keys so cache usage stays consistent across the app. */
export const queryKeys = {
  locations: (query: string) => ['locations', query.trim()] as const,
  forecast: (location: GeoLocation, units: Units, dateRange: ForecastDateRange) =>
    [
      'forecast',
      location.latitude,
      location.longitude,
      units.temperature,
      units.windSpeed,
      units.precipitation,
      dateRange.startDate,
      dateRange.endDate,
    ] as const,
  geminiInsight: (forecast: Forecast, units: Units) =>
    [
      'gemini-insight',
      forecast.location.latitude,
      forecast.location.longitude,
      forecast.current.time.toISOString(),
      units.temperature,
      units.windSpeed,
      units.precipitation,
    ] as const,
}

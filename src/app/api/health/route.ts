export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;

  return Response.json({
    ok: true,
    service: "weatherai-ops-console",
    integrations: {
      openMeteo: Boolean(process.env.OPEN_METEO_BASE_URL),
      geocoding: Boolean(process.env.OPEN_METEO_GEOCODING_URL),
      gemini: Boolean(geminiKey && geminiKey !== "your_gemini_api_key_here"),
    },
  });
}

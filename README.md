# WeatherAI Ops

WeatherAI Ops is a weather intelligence dashboard built with TanStack Start. It combines Open-Meteo forecast data with server-side Gemini analysis to show current conditions, hourly and 7-day outlooks, location search, unit preferences, and operational weather insights.

## What It Does

- Searches cities through the Open-Meteo geocoding API.
- Loads current, hourly, and 7-day forecast data from Open-Meteo.
- Shows a responsive weather dashboard with current conditions, metrics, hourly cards, 7-day forecast cards, and insight tabs.
- Generates structured AI weather insights on the server with Gemini.
- Keeps user preferences local, including selected location, recent locations, theme, and units.
- Uses route-level loading and error states through TanStack Router and TanStack Query.

## Architecture & Approach

The design is organized around one core principle: **a strict boundary between server state and client state.**

- **Server/async state lives in TanStack Query.** Forecast, geocoding, and AI insight are all queries with stable, parameterized keys (`location + units + dateRange`). The forecast query uses `keepPreviousData`, so changing the city or date range keeps the current data on screen with an "Updating…" indicator instead of flashing the page. Route loaders `ensureQueryData` so the first paint is server-rendered, not a spinner.
- **Client/UI state lives in one React Context** (`selectedLocation`, `recentLocations`, `units`, `theme`) — persisted to `localStorage` with SSR-safe hydration. No server responses are ever stored in Context.
- **The AI insight is a hard server boundary.** Gemini is called from a TanStack Start server function (`createServerFn`), so `GEMINI_API_KEY` never reaches the browser. When the key is absent or the call fails, a deterministic rule-based insight is returned, so the feature degrades gracefully instead of breaking.
- **A normalization layer** converts raw Open-Meteo payloads into typed domain models (`Forecast`, `HourlyForecast`, `DailyForecast`). UI components depend on the domain model, never on API field names — so a provider change touches one file.
- **Single source of truth.** Navigation, constants, forecast field lists, weather-code maps, and unit labels all live in `constants/data.ts`; domain and component types are global in `type.d.ts`. KISS and DRY were enforced continuously (duplicate nav arrays, types, and dead scaffolding were removed as they appeared).
- **Design system & accessibility.** A bespoke "lagoon" token set is layered over shadcn/ui primitives. Brand accent gradients are locked to fixed hex so they stay readable in both light and dark themes, and contrast, focus-visible rings, and `aria` labels were treated as part of "done."

## Problem-Solving Velocity

This project went from a generic scaffold to a working, polished product through tight, verifiable iterations rather than big-bang rewrites:

1. **Stabilize the foundation** — consolidated duplicate navigation/types, fixed a broken import that crashed the dev server, and established the `@/` alias and shared constants.
2. **Ship a working vertical slice** — wired Open-Meteo geocoding + forecast behind TanStack Query and a Context-driven active location, so search → state → data → UI worked end to end before any polish.
3. **Layer real product depth** — combined Overview/Forecast/Insights into a tabbed workspace, added an animated hourly trend (react-spring), a past-and-future date-range picker (Open-Meteo `start_date`/`end_date`, −92 to +16 days), and the server-side Gemini insight with a fallback.
4. **Harden** — accessibility (WCAG contrast, dropdown date selection, aria), dark-theme color consistency, overflow fixes, and proper loading/empty/error states on every async surface.

Each step closed with `tsc --noEmit` + Biome + a live smoke test, keeping the main branch always shippable. Trade-offs were made pragmatically for reliability over cleverness — native `fetch`/`axios` inside query functions, graceful AI fallback, and fixed-hex brand accents instead of theme-inverting tokens.

## Tech Stack

- TanStack Start
- TanStack Router
- TanStack Query
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- lucide-react icons
- axios
- Gemini API
- Open-Meteo APIs
- Biome
- Vitest

## Project Structure

```txt
src/
  components/        Shared UI and weather dashboard components
  constants/         App constants, forecast field lists, labels, weather code maps
  context/           Selected location, recent locations, units, and theme state
  integrations/      TanStack devtool integrations
  lib/               API clients, query options, formatting, AI insight server function
  routes/            TanStack file routes
  styles.css         Global theme, Tailwind, and accessibility styling
type.d.ts            Global app, weather, API response, and AI insight types
```

The app uses the `@/` import alias for `src`.

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required and optional variables:

```env
VITE_APP_TITLE="WeatherAI Ops"
VITE_OPEN_METEO_BASE_URL="https://api.open-meteo.com/v1"
VITE_OPEN_METEO_GEOCODING_URL="https://geocoding-api.open-meteo.com/v1"
VITE_OPEN_METEO_API_KEY=""
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-1.5-flash"
```

Notes:

- `VITE_OPEN_METEO_*` values are available to the client.
- `GEMINI_API_KEY` must stay server-only. Do not rename it to `VITE_GEMINI_API_KEY`.
- If `GEMINI_API_KEY` is missing or Gemini fails, the app falls back to local rule-based insights so the dashboard still works.

## Run Locally

```bash
npm install
npm run dev
```

The dev server runs on:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quality Checks

```bash
npm run check
npm run lint
npm run format
npm run test
```

Common full verification pass:

```bash
npm run check
npx tsc --noEmit
npm run build
```

## Data Flow

1. The user searches for a city in the global search bar.
2. `searchLocations` calls Open-Meteo geocoding.
3. The selected location is stored in app context and local storage.
4. `useForecast` fetches normalized current, hourly, and daily forecast data with TanStack Query.
5. `useGeminiInsight` sends a compact weather summary to the server-only Gemini function.
6. The UI renders forecast data and either Gemini insight output or a local fallback.

## Important Files

- `src/lib/api.ts`: Open-Meteo geocoding and forecast calls.
- `src/lib/ai-insight.ts`: server-only Gemini insight generation.
- `src/lib/queries/`: TanStack Query keys and query options.
- `src/constants/data.ts`: shared constants, forecast fields, weather code labels, icons, and defaults.
- `type.d.ts`: app-wide TypeScript types and API response shapes.
- `src/routes/__root.tsx`: root shell, metadata, loading boundary, errors, devtools, and app layout.

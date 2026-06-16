# WeatherAI Ops

Live demo: https://weatherai-ops-eric.netlify.app

WeatherAI Ops is a weather dashboard built with TanStack Start. It pulls forecast data from Open-Meteo and uses Gemini on the server to turn that data into short, readable operational notes. You can search any city, check current conditions, browse hourly and multi-day forecasts, switch units, and read a quick summary of what the day looks like.

## Features

- City search using the Open-Meteo geocoding API.
- Current conditions plus hourly and up to 16-day forecasts from Open-Meteo.
- A responsive dashboard with a current-conditions hero, key metrics, an hourly trend, daily cards, and an insights tab.
- AI weather insights generated on the server with Gemini, with a rule-based fallback when no key is set.
- A date range picker that covers past days and future forecasts.
- Local preferences for the selected location, recent searches, units, and theme (light, dark, or system).
- Loading and error states handled at the route level with TanStack Router and TanStack Query.

## Tech stack

TanStack Start, TanStack Router, TanStack Query, React 19, TypeScript, Tailwind CSS, shadcn/ui, lucide-react, react-spring, axios, the Open-Meteo and Gemini APIs, Biome, and Vitest.

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000.

## Environment variables

Copy the example file and fill in what you need:

```bash
cp .env.example .env.local
```

```env
VITE_APP_TITLE="WeatherAI Ops"
VITE_OPEN_METEO_BASE_URL="https://api.open-meteo.com/v1"
VITE_OPEN_METEO_GEOCODING_URL="https://geocoding-api.open-meteo.com/v1"
VITE_OPEN_METEO_API_KEY=""
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-1.5-flash"
```

Open-Meteo does not need a key for development. Gemini is optional. If `GEMINI_API_KEY` is missing or a call fails, the app shows rule-based insights instead so nothing breaks. `GEMINI_API_KEY` is read only on the server, so keep it out of any `VITE_`-prefixed variable.

## How it works

The app keeps a clear line between server data and local state. TanStack Query owns everything that comes from an API (geocoding, forecast, and the Gemini insight), with query keys built from the location, units, and date range. React Context holds only local UI state, the selected location, recent searches, units, and theme, and saves it to localStorage.

Gemini runs inside a TanStack Start server function, so the API key never reaches the browser. Raw Open-Meteo responses are converted into typed objects before they reach any component, so the UI never depends on raw API field names.

A typical request looks like this:

1. You search for a city.
2. The geocoding call returns matching places.
3. Picking one updates context and localStorage.
4. The forecast query loads current, hourly, and daily data.
5. A compact summary is sent to the server-side Gemini function.
6. The UI shows the forecast plus either the Gemini insight or the local fallback.

## How I built it

I started from a TanStack Start scaffold and worked in small steps, getting one thing working before moving to the next. First I cleaned up the navigation and types and fixed a bad import that was crashing the dev server. Then I wired the Open-Meteo search and forecast through TanStack Query so the search-to-results flow worked end to end. After that I built the UI: the tabbed dashboard, the hourly trend, the date range picker with past and future days, and the Gemini insights with a fallback. The last pass was polish, covering accessibility, dark mode colors, layout overflow, and loading and error states. I ran the type checker, Biome, and a quick manual test after each change to keep the main branch working.

## Project structure

```txt
src/
  components/   Shared UI and weather dashboard components
  constants/    App constants, forecast fields, labels, weather code maps
  context/      Selected location, recent locations, units, theme
  integrations/ TanStack devtools setup
  lib/          API clients, query options, formatters, Gemini server function
  routes/       File-based routes
  styles.css    Theme and global styles
type.d.ts       Global app, weather, and API types
```

Imports use the `@/` alias for the `src` folder.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the build
npm run check    # Biome check
npm run lint     # Biome lint
npm run test     # Vitest
```

## Deployment

The app is deployed on Netlify with server-side rendering: https://weatherai-ops-eric.netlify.app

It uses the official TanStack Start Netlify adapter. `@netlify/vite-plugin-tanstack-start` produces a Netlify SSR function during the build, and `netlify.toml` points the publish directory at `dist/client`.

```bash
npx netlify login
npx netlify init
npx netlify deploy --build --prod
```

Set `GEMINI_API_KEY` in the Netlify site settings to enable live AI insights.

A note on Vercel: its current TanStack Start preset builds this version of the framework as static only, so server routes return 404. Netlify handles SSR out of the box. Vercel works if you switch the app to SPA mode, in which case Gemini uses the local fallback.

## Key files

- `src/lib/api.ts` for the Open-Meteo geocoding and forecast calls.
- `src/lib/ai-insight.ts` for the server-side Gemini insight and fallback.
- `src/lib/queries/` for query keys and options.
- `src/constants/data.ts` for shared constants and weather code maps.
- `type.d.ts` for app-wide types.
- `src/routes/__root.tsx` for the root layout, metadata, and error and loading boundaries.

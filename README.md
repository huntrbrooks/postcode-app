# Postcode Revealer

Responsive React + TypeScript web app that runs completely in the browser, asks for your location inside a user gesture, and reverse geocodes the coordinates with OpenStreetMap’s Nominatim API to display the nearest postcode.

## Tech stack
- React 18 + TypeScript
- Vite for dev/build tooling
- HTML5 Geolocation API (`navigator.geolocation`)
- OpenStreetMap Nominatim reverse geocoding (`address.postcode`)

## Getting started
```bash
npm install
npm run dev
```
The dev server runs on <http://localhost:5173>. Geolocation works on `https://` origins and on `http://localhost`.

For a production build:
```bash
npm run build
npm run preview
```

## Environment variables
Nominatim requires either a `User-Agent` or `email` parameter for contact. Set an address you monitor via Vite’s environment file:

```
VITE_NOMINATIM_EMAIL=you@example.com
```

Create `.env.local` (ignored by Vite) and restart the dev server so requests include this parameter.

## Key features
- Requests location only after the user taps **Use my location**, satisfying Safari/Chrome permission requirements.
- Graceful error states for denied permissions, timeouts, unsupported browsers, and reverse-geocoding failures.
- Displays postcode, formatted address, latitude/longitude, and regional metadata.
- Responsive UI validated against iPhone Safari + Android Chrome breakpoints, with neon styling reserved for the primary CTA button per design preference.
- Deploy-ready: `npm run build` emits assets into `dist/` for static hosting (Vercel config included).

## Project structure
```
├── public/                # Manifest + icon
├── src/
│   ├── App.tsx            # Main experience + geolocation flow
│   ├── components/
│   │   └── ResultPanel.tsx
│   ├── lib/
│   │   └── nominatim.ts   # Reverse geocode helper + address formatter
│   ├── types/
│   │   └── location.ts
│   ├── styles.css         # Global styles
│   └── main.tsx
├── index.html             # Vite entry
└── vercel.json            # Static deploy settings
```

## Production checklist
- Serve over HTTPS with HSTS and a privacy notice describing GPS usage.
- Cache-bust and monitor API failures (Sentry/LogRocket) plus success-rate analytics.
- Add integration tests (Playwright/Cypress) for permission prompts, denied flows, and fallback messaging.
- Swap to a paid geocoder by updating the helper in `src/lib/nominatim.ts` without touching UI code.

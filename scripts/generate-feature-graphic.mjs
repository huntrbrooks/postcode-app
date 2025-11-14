import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_PATH = resolve(__dirname, "../public/feature-graphic.png");

const width = 1024;
const height = 500;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#132347"/>
      <stop offset="100%" stop-color="#05060b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00dbde"/>
      <stop offset="100%" stop-color="#fc00ff"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="48" fill="url(#hero-gradient)" />
  <g font-family="Inter, 'SF Pro Display', 'Segoe UI', sans-serif" fill="#f8fbff">
    <text x="72" y="140" font-size="36" letter-spacing="0.35em" opacity="0.7">
      NEAREST POSTCODE
    </text>
    <text x="72" y="240" font-size="130" font-weight="700" letter-spacing="0.08em">
      3121
    </text>
    <text x="72" y="300" font-size="28" opacity="0.85">
      Richmond · Melbourne · Australia
    </text>
    <text x="72" y="356" font-size="24" opacity="0.75">
      Uses on-device GPS + OpenStreetMap's Nominatim API
    </text>
  </g>
  <rect x="72" y="384" width="880" height="60" rx="30" fill="url(#accent)" opacity="0.25"/>
  <text x="95" y="422" font-size="24" fill="#f8fbff" font-family="Inter, 'SF Pro Display', 'Segoe UI', sans-serif">
    Tap “Use my location” to fetch the nearest postcode instantly.
  </text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(OUTPUT_PATH);

console.log(`✓ Generated feature graphic -> ${OUTPUT_PATH}`);


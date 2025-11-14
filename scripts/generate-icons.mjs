import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_SVG = path.resolve(__dirname, "../public/vite.svg");
const OUTPUT_DIR = path.resolve(__dirname, "../public/icons");

const targets = [
  { size: 192, name: "icon-192.png", type: "icon" },
  { size: 512, name: "icon-512.png", type: "icon" },
  { size: 512, name: "icon-512-maskable.png", type: "icon" },
  { size: 1024, name: "adaptive-foreground.png", type: "foreground" },
  { size: 1024, name: "adaptive-background.png", type: "background" },
];

async function generate() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const svgBuffer = await readFile(SOURCE_SVG);

  await Promise.all(
    targets.map(async ({ size, name, type }) => {
      const outputPath = path.join(OUTPUT_DIR, name);
      if (type === "background") {
        const backgroundSvg = generateBackgroundSvg(size);
        await sharp(Buffer.from(backgroundSvg))
          .resize(size, size)
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toFile(outputPath);
        console.log(`✓ Generated ${name}`);
        return;
      }

      await sharp(svgBuffer, { density: 512 })
        .resize(size, size, {
          fit: "contain",
          background: type === "foreground" ? { r: 0, g: 0, b: 0, alpha: 0 } : "#05060b",
        })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
      console.log(`✓ Generated ${name}`);
    })
  );

  console.log("Icon generation complete.");
}

function generateBackgroundSvg(size) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#132347"/>
          <stop offset="100%" stop-color="#05060b"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-gradient)" rx="${size * 0.2}" />
    </svg>
  `;
}

generate().catch((error) => {
  console.error("Failed to generate icons:", error);
  process.exit(1);
});


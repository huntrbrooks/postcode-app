import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_SVG = path.resolve(__dirname, "../public/vite.svg");
const OUTPUT_DIR = path.resolve(__dirname, "../public/icons");

const targets = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 512, name: "icon-512-maskable.png" },
];

async function generate() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const svgBuffer = await readFile(SOURCE_SVG);

  await Promise.all(
    targets.map(async ({ size, name }) => {
      const outputPath = path.join(OUTPUT_DIR, name);
      await sharp(svgBuffer, { density: 512 })
        .resize(size, size, {
          fit: "contain",
          background: "#05060b",
        })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outputPath);
      console.log(`✓ Generated ${name}`);
    })
  );

  console.log("Icon generation complete.");
}

generate().catch((error) => {
  console.error("Failed to generate icons:", error);
  process.exit(1);
});


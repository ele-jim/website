#!/usr/bin/env node
/**
 * Generates index/pictures/og-image.png (1200x630).
 *
 * Layout:
 *   left third:  black panel with the ELE logo (white-on-black)
 *   right two-thirds: the most recent event poster (cover-fitted)
 *
 * "Most recent" = first <div class="event"> in index.html (the homepage lists
 * events newest-first). Falls back to a logo-only image if no poster found.
 *
 * Run locally: `node scripts/generate-og-image.mjs`
 * Run in CI:   see .github/workflows/og-image.yml
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT  = resolve(ROOT, "index/pictures/og-image.png");
const LOGO = resolve(ROOT, "index/pictures/icons/ELE_Logo.webp");

const W = 1200;
const H = 630;
const SPLIT = Math.round(W * 0.4); // black panel width

async function findLatestPoster() {
  const html = await readFile(resolve(ROOT, "index.html"), "utf8");
  // Find the first <img> inside an .event card (newest first in source order)
  const re = /<div class="event"[\s\S]*?<img[^>]+src="([^"]+)"/;
  const m = html.match(re);
  if (!m) return null;
  const rel = m[1].replace(/^\.?\//, "");
  const abs = resolve(ROOT, rel);
  return existsSync(abs) ? abs : null;
}

async function buildLeftPanel() {
  // Black panel with the logo centred, scaled up from 192x192 source.
  const logoBuf = await readFile(LOGO);
  const targetW = Math.round(SPLIT * 0.75);
  const logo = await sharp(logoBuf)
    .resize({ width: targetW, kernel: "lanczos3" })
    .toBuffer();
  const { width: lw, height: lh } = await sharp(logo).metadata();

  return sharp({
    create: { width: SPLIT, height: H, channels: 3, background: "#000" },
  })
    .composite([{ input: logo, left: Math.round((SPLIT - lw) / 2), top: Math.round((H - lh) / 2) }])
    .png()
    .toBuffer();
}

async function buildRightPanel(posterPath) {
  const right = W - SPLIT;
  if (!posterPath) {
    // No poster — just extend black
    return sharp({ create: { width: right, height: H, channels: 3, background: "#000" } })
      .png()
      .toBuffer();
  }
  const posterBuf = await readFile(posterPath);
  return sharp(posterBuf)
    .resize({ width: right, height: H, fit: "cover", position: "centre" })
    .png()
    .toBuffer();
}

async function main() {
  const poster = await findLatestPoster();
  console.log(poster ? `Latest poster: ${poster}` : "No poster found — logo only");

  const [left, right] = await Promise.all([buildLeftPanel(), buildRightPanel(poster)]);

  await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } })
    .composite([
      { input: left,  left: 0,     top: 0 },
      { input: right, left: SPLIT, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  console.log(`Wrote ${OUT} (${W}x${H})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

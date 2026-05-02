// scripts/build-favicons.mjs
//
// Copyright (c) 2026 Agam Arora. All rights reserved.
// Licensed under CC BY-NC-ND 4.0.
//
// Generates favicon + app icon set from the aa mark.
// One unified design at every size: Patrick Hand "aa" (no trailing dot)
// on dark bg. At 16x16 the cursive strokes go slightly soft, accepted —
// modern displays mostly render favicons at 32px effective via retina.
// (The full "aa." mark with gold dot still ships in the page footer; at
//  favicon scale the dot reads as a stray pixel, so we drop it here.)
//
// Outputs:
//   /favicon.ico                  (16+32+48 multi-res, dot-only)
//   /favicon.svg                  (vector, dot-only — for tabs in modern browsers)
//   /favicon-16x16.png            (tab)
//   /favicon-32x32.png            (tab + bookmarks)
//   /favicon-96x96.png            (Google TV / some Android)
//   /apple-touch-icon.png         (180x180, full mark, iOS home screen)
//   /assets/icons/icon-192.png    (PWA, full mark)
//   /assets/icons/icon-512.png    (PWA splash, full mark)
//   /assets/icons/icon-192-maskable.png   (PWA adaptive, mark within inner 80%)
//   /assets/icons/icon-512-maskable.png   (PWA adaptive, mark within inner 80%)
//
// Run: node scripts/build-favicons.mjs

import opentype from 'opentype.js';
import wawoff2 from 'wawoff2';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const FONT_PATH = path.join(ROOT, 'fonts/patrick-hand/patrick-hand-latin.woff2');
const ICONS_DIR = path.join(ROOT, 'assets/icons');

const COLOR_BG = '#0A0A0A';
const COLOR_TEXT = '#E8E4DF';
const COLOR_ACCENT = '#E5A54B';

async function loadPatrickHand() {
  const woff2 = await readFile(FONT_PATH);
  const ttf = await wawoff2.decompress(woff2);
  return opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
}

function glyphPath(font, char, fontSize, x, y) {
  const glyph = font.charToGlyph(char);
  return glyph.getPath(x, y, fontSize).toPathData(2);
}

function glyphAdvance(font, char, fontSize) {
  const glyph = font.charToGlyph(char);
  return (glyph.advanceWidth * fontSize) / font.unitsPerEm;
}

// Master SVG — "aa" mark (no trailing dot), used for app icons + apple-touch.
function buildMasterSvg(font, size = 1024) {
  const FONT_SIZE = Math.round(size * 0.78);

  const aAdv = glyphAdvance(font, 'a', FONT_SIZE);
  const totalW = aAdv * 2;

  const startX = (size - totalW) / 2;
  const baseY = size * 0.74;

  const a1 = glyphPath(font, 'a', FONT_SIZE, startX, baseY);
  const a2 = glyphPath(font, 'a', FONT_SIZE, startX + aAdv, baseY);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${COLOR_BG}"/>
  <path d="${a1}" fill="${COLOR_TEXT}"/>
  <path d="${a2}" fill="${COLOR_TEXT}"/>
</svg>`;
}

// (Earlier dot-only variant removed — full mark used at every size.)

// Maskable variant — "aa" mark scaled into inner 80% so Android adaptive icon
// shapes (circle, squircle, rounded square) don't crop the design.
function buildMaskableSvg(font, size = 1024) {
  const SAFE = size * 0.8;
  const PAD = (size - SAFE) / 2;
  const FONT_SIZE = Math.round(SAFE * 0.78);
  const aAdv = glyphAdvance(font, 'a', FONT_SIZE);
  const totalW = aAdv * 2;
  const startX = PAD + (SAFE - totalW) / 2;
  const baseY = PAD + SAFE * 0.74;

  const a1 = glyphPath(font, 'a', FONT_SIZE, startX, baseY);
  const a2 = glyphPath(font, 'a', FONT_SIZE, startX + aAdv, baseY);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${COLOR_BG}"/>
  <path d="${a1}" fill="${COLOR_TEXT}"/>
  <path d="${a2}" fill="${COLOR_TEXT}"/>
</svg>`;
}

async function rasterize(svgString, size) {
  return await sharp(Buffer.from(svgString))
    .resize(size, size, { fit: 'contain', background: COLOR_BG })
    .png()
    .toBuffer();
}

async function main() {
  console.log('Loading Patrick Hand woff2...');
  const font = await loadPatrickHand();
  console.log(`✓ Loaded. unitsPerEm=${font.unitsPerEm}`);

  const masterSvg = buildMasterSvg(font, 1024);
  const maskableSvg = buildMaskableSvg(font, 1024);

  await mkdir(ICONS_DIR, { recursive: true });

  // SVG source — vector master, used as /favicon.svg in modern browsers.
  await writeFile(path.join(ROOT, 'favicon.svg'), masterSvg);
  console.log('✓ /favicon.svg');

  // Tab raster sizes (full mark)
  for (const sz of [16, 32, 96]) {
    const buf = await rasterize(masterSvg, sz);
    await writeFile(path.join(ROOT, `favicon-${sz}x${sz}.png`), buf);
    console.log(`✓ /favicon-${sz}x${sz}.png`);
  }

  // Legacy /favicon.png (48x48 — referenced in some HTML <link> tags)
  const fav48 = await rasterize(masterSvg, 48);
  await writeFile(path.join(ROOT, 'favicon.png'), fav48);
  console.log('✓ /favicon.png (48x48)');

  // Apple touch icon (180x180, full mark)
  const apple = await rasterize(masterSvg, 180);
  await writeFile(path.join(ROOT, 'apple-touch-icon.png'), apple);
  console.log('✓ /apple-touch-icon.png');

  // PWA icons (full mark)
  const pwa192 = await rasterize(masterSvg, 192);
  await writeFile(path.join(ICONS_DIR, 'icon-192.png'), pwa192);
  console.log('✓ /assets/icons/icon-192.png');

  const pwa512 = await rasterize(masterSvg, 512);
  await writeFile(path.join(ICONS_DIR, 'icon-512.png'), pwa512);
  console.log('✓ /assets/icons/icon-512.png');

  // PWA maskable (mark inside 80% safe area)
  const mask192 = await rasterize(maskableSvg, 192);
  await writeFile(path.join(ICONS_DIR, 'icon-192-maskable.png'), mask192);
  console.log('✓ /assets/icons/icon-192-maskable.png');

  const mask512 = await rasterize(maskableSvg, 512);
  await writeFile(path.join(ICONS_DIR, 'icon-512-maskable.png'), mask512);
  console.log('✓ /assets/icons/icon-512-maskable.png');

  // ICO multi-res (16+32+48, full mark)
  const ico16 = await rasterize(masterSvg, 16);
  const ico32 = await rasterize(masterSvg, 32);
  const ico48 = await rasterize(masterSvg, 48);
  const ico = await pngToIco([ico16, ico32, ico48]);
  await writeFile(path.join(ROOT, 'favicon.ico'), ico);
  console.log('✓ /favicon.ico (16+32+48 multi-res)');

  console.log('\nAll favicons generated.');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

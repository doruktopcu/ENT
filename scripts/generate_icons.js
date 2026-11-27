/**
 * Generate the extension icons at their real pixel sizes.
 *
 * The previous script emitted one hard-coded 16x16 PNG and wrote it to all
 * three filenames, so icon48.png and icon128.png were 16x16 images with
 * misleading names and Chrome upscaled a blurry mark in the toolbar and store
 * listing. This renders each size properly.
 *
 * The mark is a gold rounded square carrying the congruence sign (≡), drawn
 * geometrically so no font or image dependency is needed.
 *
 * Usage: npm run icons
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
const SIZES = [16, 48, 128];

// Amber gradient endpoints, matching the UI accent.
const GOLD_TOP = [251, 191, 36];
const GOLD_BOTTOM = [217, 119, 6];
const INK = [3, 7, 18];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

/** Signed distance to a rounded rectangle, used for anti-aliased edges. */
function roundedRectDistance(x, y, halfW, halfH, radius) {
  const dx = Math.abs(x) - (halfW - radius);
  const dy = Math.abs(y) - (halfH - radius);
  const outside = Math.hypot(Math.max(dx, 0), Math.max(dy, 0));
  return outside + Math.min(Math.max(dx, dy), 0) - radius;
}

function renderIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const center = size / 2;
  const half = size * 0.46;
  const radius = size * 0.22;

  // Three bars of the congruence sign.
  const barHeight = Math.max(1, size * 0.075);
  const barHalfWidth = size * 0.26;
  const barOffsets = [-size * 0.17, 0, size * 0.17];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const px = x + 0.5 - center;
      const py = y + 0.5 - center;

      const plateDistance = roundedRectDistance(px, py, half, half, radius);
      // Smooth the boundary over roughly one pixel.
      const plateAlpha = Math.min(Math.max(0.5 - plateDistance, 0), 1);

      const gradient = lerpColor(GOLD_TOP, GOLD_BOTTOM, (y + 0.5) / size);

      let r = gradient[0];
      let g = gradient[1];
      let b = gradient[2];

      let inkCoverage = 0;
      for (const offset of barOffsets) {
        const dx = Math.abs(px) - barHalfWidth;
        const dy = Math.abs(py - offset) - barHeight / 2;
        const distance = Math.max(dx, dy);
        inkCoverage = Math.max(inkCoverage, Math.min(Math.max(0.5 - distance, 0), 1));
      }

      if (inkCoverage > 0) {
        r = lerp(r, INK[0], inkCoverage);
        g = lerp(g, INK[1], inkCoverage);
        b = lerp(b, INK[2], inkCoverage);
      }

      const index = (y * size + x) * 4;
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = Math.round(plateAlpha * 255);
    }
  }

  return encodePng(size, size, pixels);
}

function lerpColor(from, to, t) {
  return [lerp(from[0], to[0], t), lerp(from[1], to[1], t), lerp(from[2], to[2], t)];
}

/** Minimal RGBA PNG encoder (filter type 0 on every scanline). */
function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([length, typeAndData, crc]);
}

mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
  const file = resolve(OUT_DIR, `icon${size}.png`);
  writeFileSync(file, renderIcon(size));
  console.log(`wrote ${file} (${size}x${size})`);
}

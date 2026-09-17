// One-off script to generate a placeholder public/logo.png (purple emblem badge)
// using only Node's built-in zlib — no external image dependencies required.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const WIDTH = 160;
const HEIGHT = 160;

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      t[n] = c;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Purple gradient badge with a lighter circle emblem, approximating the
// site's brand-600/700 accent so it reads as a real school crest silhouette.
function colorAt(x, cx, y, cy) {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = WIDTH / 2 - 4;

  if (dist > radius) return [255, 255, 255, 0]; // transparent outside badge

  // Radial purple gradient background (brand-600 -> brand-800)
  const t = dist / radius;
  const r = Math.round(147 + (107 - 147) * t);
  const g = Math.round(51 + (33 - 51) * t);
  const b = Math.round(234 + (168 - 234) * t);

  // Inner emblem ring
  const ringOuter = radius * 0.62;
  const ringInner = radius * 0.5;
  if (dist < ringOuter && dist > ringInner) {
    return [255, 255, 255, 235];
  }

  // Center dot (graduation-cap style mark)
  if (dist < radius * 0.28) {
    return [255, 255, 255, 245];
  }

  return [r, g, b, 255];
}

const rowSize = WIDTH * 4 + 1;
const raw = Buffer.alloc(rowSize * HEIGHT);
const cx = WIDTH / 2;
const cy = HEIGHT / 2;

for (let y = 0; y < HEIGHT; y++) {
  const rowStart = y * rowSize;
  raw[rowStart] = 0; // filter type: none
  for (let x = 0; x < WIDTH; x++) {
    const [r, g, b, a] = colorAt(x, cx, y, cy);
    const off = rowStart + 1 + x * 4;
    raw[off] = r;
    raw[off + 1] = g;
    raw[off + 2] = b;
    raw[off + 3] = a;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const idat = zlib.deflateSync(raw, { level: 9 });

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

const outPath = path.join(__dirname, "..", "public", "logo.png");
fs.writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);

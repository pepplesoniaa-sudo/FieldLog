import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { createCanvas } = require('C:/Users/HP/.gemini/antigravity-ide/brain/88f25745-3ac2-4668-85a9-59a363da0abf/scratch/pdfread/node_modules/@napi-rs/canvas');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

function renderFieldLogLogo(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const scale = size / 32;

  // Background with Primary 40
  ctx.fillStyle = '#1B5EAD';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, 7 * scale);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = '#78ACFF';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // Stylized F - Vertical Stalk
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(7 * scale, 7 * scale, 4.5 * scale, 18 * scale, 2 * scale);
  ctx.fill();

  // Top Bar
  ctx.beginPath();
  ctx.roundRect(11.5 * scale, 7 * scale, 13.5 * scale, 4.5 * scale, 2 * scale);
  ctx.fill();

  // Middle Bar
  ctx.fillStyle = '#D6E3FF';
  ctx.beginPath();
  ctx.roundRect(11.5 * scale, 14 * scale, 9.5 * scale, 4 * scale, 2 * scale);
  ctx.fill();

  // Green Environmental Node
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(23 * scale, 22 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.arc(23 * scale, 22 * scale, 4.2 * scale, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

// Write app/icon.png (32x32)
fs.writeFileSync('app/icon.png', renderFieldLogLogo(32));
console.log('Saved app/icon.png');

// Write app/apple-icon.png (180x180)
fs.writeFileSync('app/apple-icon.png', renderFieldLogLogo(180));
console.log('Saved app/apple-icon.png');

// Write public/favicon.ico (standard 32x32 PNG container readable as ICO by modern browsers)
fs.writeFileSync('public/favicon.ico', renderFieldLogLogo(32));
fs.writeFileSync('app/favicon.ico', renderFieldLogLogo(32));
console.log('Saved public/favicon.ico and app/favicon.ico');

// Write PWA icons
fs.writeFileSync('public/icon-192.png', renderFieldLogLogo(192));
fs.writeFileSync('public/icon-512.png', renderFieldLogLogo(512));
console.log('Saved public/icon-192.png and public/icon-512.png');


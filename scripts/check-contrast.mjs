import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssFile = path.join(__dirname, '..', 'design', 'tokens', 'design-tokens.css');

if (!fs.existsSync(cssFile)) {
  console.error(`CSS file not found: ${cssFile}`);
  process.exit(1);
}

const cssContent = fs.readFileSync(cssFile, 'utf8');

function parseCssVariables(css) {
  const lightVars = new Map();
  const darkVars = new Map();

  // Extract :root block (before media query or theme selector)
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (rootMatch) {
    const rootBlock = rootMatch[1];
    const declRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = declRegex.exec(rootBlock)) !== null) {
      lightVars.set(match[1].trim(), match[2].trim());
      darkVars.set(match[1].trim(), match[2].trim()); // dark inherits base primitives
    }
  }

  // Extract :root[data-theme="dark"] block
  const darkMatch = css.match(/:root\[data-theme=["']dark["']\]\s*\{([\s\S]*?)\n\}/);
  if (darkMatch) {
    const darkBlock = darkMatch[1];
    const declRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = declRegex.exec(darkBlock)) !== null) {
      darkVars.set(match[1].trim(), match[2].trim());
    }
  }

  return { lightVars, darkVars };
}

function resolveVar(val, varMap, visited = new Set()) {
  if (!val) return null;
  val = val.trim();
  if (val.startsWith('#')) {
    return val;
  }
  if (val.startsWith('--')) {
    if (visited.has(val)) {
      throw new Error(`Circular variable reference: ${val}`);
    }
    visited.add(val);
    const targetVal = varMap.get(val);
    if (!targetVal) {
      throw new Error(`Unresolved CSS variable: ${val}`);
    }
    return resolveVar(targetVal, varMap, visited);
  }
  const varMatch = val.match(/^var\((--[\w-]+)\)$/);
  if (varMatch) {
    const varName = varMatch[1];
    if (visited.has(varName)) {
      throw new Error(`Circular variable reference: ${varName}`);
    }
    visited.add(varName);
    const targetVal = varMap.get(varName);
    if (!targetVal) {
      throw new Error(`Unresolved CSS variable: ${varName}`);
    }
    return resolveVar(targetVal, varMap, visited);
  }
  return val;
}

function parseHex(hex) {
  hex = hex.replace('#', '').trim();
  if (hex.length === 8) hex = hex.slice(0, 6);
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ];
}

function sRGBtoLin(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relLuminance([r, g, b]) {
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function getContrast(hex1, hex2) {
  const l1 = relLuminance(parseHex(hex1));
  const l2 = relLuminance(parseHex(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const { lightVars, darkVars } = parseCssVariables(cssContent);

const colorRoles = ['primary', 'secondary', 'tertiary', 'error', 'success', 'warning', 'info'];
const statusRoles = [
  'status-draft',
  'status-submitted',
  'status-changes-requested',
  'status-approved',
  'sync-all-uploaded',
  'sync-waiting',
  'sync-offline',
  'sync-syncing',
  'sync-failed',
  'sync-offline-warning'
];

function buildChecks() {
  const checks = [];

  // >= 4.5
  checks.push({ name: 'on-surface / surface', fg: 'on-surface', bg: 'surface', threshold: 4.5 });
  checks.push({ name: 'on-surface / surface-container-high', fg: 'on-surface', bg: 'surface-container-high', threshold: 4.5 });
  checks.push({ name: 'on-surface-variant / surface', fg: 'on-surface-variant', bg: 'surface', threshold: 4.5 });
  checks.push({ name: 'on-surface-variant / surface-container-high', fg: 'on-surface-variant', bg: 'surface-container-high', threshold: 4.5 });

  for (const x of colorRoles) {
    checks.push({ name: `${x} / surface`, fg: x, bg: 'surface', threshold: 4.5 });
    checks.push({ name: `on-${x} / ${x}`, fg: `on-${x}`, bg: x, threshold: 4.5 });
    checks.push({ name: `on-${x}-container / ${x}-container`, fg: `on-${x}-container`, bg: `${x}-container`, threshold: 4.5 });
  }

  // >= 3.0
  checks.push({ name: 'outline / surface', fg: 'outline', bg: 'surface', threshold: 3.0 });
  checks.push({ name: 'focus-ring / surface', fg: 'focus-ring', bg: 'surface', threshold: 3.0 });

  for (const s of statusRoles) {
    checks.push({ name: `${s}-border / ${s}-container`, fg: `${s}-border`, bg: `${s}-container`, threshold: 3.0 });
    checks.push({ name: `${s}-border / surface`, fg: `${s}-border`, bg: 'surface', threshold: 3.0 });
  }

  // Report only (threshold = null)
  checks.push({ name: 'outline-variant / surface', fg: 'outline-variant', bg: 'surface', threshold: null });

  return checks;
}

const checks = buildChecks();

let totalPassed = 0;
let totalFailed = 0;
let totalReportOnly = 0;

console.log('| Mode  | Check Description                                  | Foreground           | Background           | FG Hex   | BG Hex   | Ratio   | Min Req | Status |');
console.log('| :---  | :------------------------------------------------- | :------------------- | :------------------- | :------- | :------- | :------ | :------ | :----- |');

function runMode(modeName, varMap) {
  for (const ch of checks) {
    const fgVarName = `--color-roles-${ch.fg}`;
    const bgVarName = `--color-roles-${ch.bg}`;
    const fgHex = resolveVar(fgVarName, varMap);
    const bgHex = resolveVar(bgVarName, varMap);

    if (!fgHex || !bgHex) {
      console.log(`| ${modeName.padEnd(5)} | ${ch.name.padEnd(50)} | ${ch.fg.padEnd(20)} | ${ch.bg.padEnd(20)} | MISSING  | MISSING  | N/A     | ${ch.threshold ? `>= ${ch.threshold.toFixed(1)}` : 'Report '} | FAIL   |`);
      totalFailed++;
      continue;
    }

    const ratio = getContrast(fgHex, bgHex);
    const ratioStr = `${ratio.toFixed(2)}:1`;
    let status = 'PASS';
    let reqStr = ch.threshold ? `>= ${ch.threshold.toFixed(1)}` : 'Report ';

    if (ch.threshold === null) {
      status = 'REPORT';
      totalReportOnly++;
    } else if (ratio >= ch.threshold) {
      status = 'PASS';
      totalPassed++;
    } else {
      status = 'FAIL';
      totalFailed++;
    }

    console.log(`| ${modeName.padEnd(5)} | ${ch.name.padEnd(50)} | ${ch.fg.padEnd(20)} | ${ch.bg.padEnd(20)} | ${fgHex.padEnd(8)} | ${bgHex.padEnd(8)} | ${ratioStr.padEnd(7)} | ${reqStr.padEnd(7)} | ${status.padEnd(6)} |`);
  }
}

runMode('LIGHT', lightVars);
runMode('DARK', darkVars);

console.log('\n--- WCAG Contrast Verification Summary ---');
console.log(`Total checks passed: ${totalPassed}`);
console.log(`Total checks failed: ${totalFailed}`);
console.log(`Report-only checks:  ${totalReportOnly}`);

if (totalFailed > 0) {
  console.error(`\nContrast check FAILED with ${totalFailed} failing pair(s).`);
  process.exit(1);
} else {
  console.log('\nAll contrast checks PASSED successfully.');
  process.exit(0);
}

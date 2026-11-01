const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'design', 'tokens', 'fieldlog.tokens.json');
const outputFile = path.join(__dirname, '..', 'design', 'tokens', 'design-tokens.css');

if (!fs.existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Format a string into kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .replace(/[()]+/g, '')
            .toLowerCase();
}

// Convert a json path array to a CSS variable name
function pathToVarName(pathArray) {
  return '--' + pathArray.map(toKebabCase).join('-');
}

// Handle alias resolution
function resolveAlias(val) {
  if (typeof val !== 'string') return val;
  // Matches {some.path.to.token}
  return val.replace(/\{([^}]+)\}/g, (match, inner) => {
    const parts = inner.split('.');
    return `var(${pathToVarName(parts)})`;
  });
}

function processValue(token) {
  let val = token.value;
  
  if (token.type === 'custom-shadow') {
    // If it's an array of shadows, we map and join by comma
    const shadows = Array.isArray(val) ? val : [val];
    return shadows.map(shadow => {
      const isInset = shadow.shadowType === 'innerShadow' ? 'inset ' : '';
      return `${isInset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.radius}px ${shadow.spread}px ${shadow.color}`;
    }).join(', ');
  }
  
  if (token.type === 'dimension') {
    if (typeof val === 'number' && val !== 0) {
      return `${val}px`;
    }
    return val;
  }

  return resolveAlias(val);
}

// Validate that color roles and color roles dark have identical keys
const lightRoles = data['color roles'] || {};
const darkRoles = data['color roles dark'] || {};
const lightKeys = Object.keys(lightRoles);
const darkKeys = Object.keys(darkRoles);

const missingInDark = lightKeys.filter(k => !darkKeys.includes(k));
const missingInLight = darkKeys.filter(k => !lightKeys.includes(k));

if (missingInDark.length > 0 || missingInLight.length > 0) {
  if (missingInDark.length > 0) {
    console.error(`Keys missing in 'color roles dark': ${missingInDark.join(', ')}`);
  }
  if (missingInLight.length > 0) {
    console.error(`Keys missing in 'color roles': ${missingInLight.join(', ')}`);
  }
  process.exit(1);
}

const darkRoleVariables = [];
for (const [key, node] of Object.entries(darkRoles)) {
  const varName = pathToVarName(['color roles', key]);
  const varValue = processValue(node);
  darkRoleVariables.push(`  ${varName}: ${varValue};`);
}

const cssVariables = {
  'primitive colors': [],
  'color roles': [],
  'effect': [],
  'typography': [],
  'spacing collection': [],
  'other': []
};

// Traverse the token JSON tree recursively
function traverse(node, currentPath = []) {
  if (node && typeof node === 'object' && node.hasOwnProperty('value')) {
    const varName = pathToVarName(currentPath);
    const varValue = processValue(node);
    
    // Categorize based on top-level key
    const topLevelKey = currentPath[0];
    if (cssVariables[topLevelKey]) {
      cssVariables[topLevelKey].push(`  ${varName}: ${varValue};`);
    } else {
      if (!cssVariables['other']) cssVariables['other'] = [];
      cssVariables['other'].push(`  ${varName}: ${varValue};`);
    }
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      // Ignore metadata keys
      if (key === 'extensions' || key === 'description') continue;
      traverse(value, [...currentPath, key]);
    }
  }
}

for (const [key, value] of Object.entries(data)) {
  if (key === 'color roles dark') continue;
  traverse(value, [key]);
}

// Generate CSS Output
let cssContent = `/* Automatically generated from fieldlog.tokens.json - do not edit directly */\n/**\n`;
cssContent += ` * Design System Tokens\n`;
cssContent += ` * Automatically generated from fieldlog.tokens.json\n`;
cssContent += ` * \n`;
cssContent += ` * Color System Architecture:\n`;
cssContent += ` * 1. Primitive Colors: The foundational palette. These should NOT be used directly in UI components.\n`;
cssContent += ` * 2. Color Roles: Semantic colors referencing primitives. These MUST be used directly in UI components.\n`;
cssContent += ` */\n\n`;
cssContent += `:root {\n`;

const categories = [
  { key: 'primitive colors', label: 'Primitive Colors (Foundation - Not to be applied directly to UI)' },
  { key: 'color roles', label: 'Color Roles (To be applied directly to UI components)' },
  { key: 'effect', label: 'Effects & Shadows' },
  { key: 'typography', label: 'Typography Tokens' },
  { key: 'spacing collection', label: 'Spacing Collection' },
  { key: 'other', label: 'Other Tokens' }
];

for (const cat of categories) {
  if (cssVariables[cat.key] && cssVariables[cat.key].length > 0) {
    cssContent += `\n  /* ==========================================================================\n`;
    cssContent += `     ${cat.label}\n`;
    cssContent += `     ========================================================================== */\n`;
    cssContent += cssVariables[cat.key].join('\n') + '\n';
  }
}

cssContent += `}\n\n`;

// Dark Mode Blocks
cssContent += `@media (prefers-color-scheme: dark) {\n`;
cssContent += `  :root:not([data-theme="light"]) {\n`;
cssContent += `    /* ==========================================================================\n`;
cssContent += `       Color Roles (Dark Mode Overrides)\n`;
cssContent += `       ========================================================================== */\n`;
cssContent += darkRoleVariables.map(line => `  ${line}`).join('\n') + '\n';
cssContent += `  }\n`;
cssContent += `}\n\n`;

cssContent += `:root[data-theme="dark"] {\n`;
cssContent += `  /* ==========================================================================\n`;
cssContent += `     Color Roles (Dark Mode Overrides)\n`;
cssContent += `     ========================================================================== */\n`;
cssContent += darkRoleVariables.join('\n') + '\n';
cssContent += `}\n`;

fs.writeFileSync(outputFile, cssContent, 'utf8');
console.log(`Successfully generated CSS variables in ${outputFile}`);

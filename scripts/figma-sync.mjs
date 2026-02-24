#!/usr/bin/env node
/**
 * Figma Sync — Push design tokens as Figma Variables + place Button component
 *
 * Usage:
 *   FIGMA_TOKEN=<token> node scripts/figma-sync.mjs
 *
 * Optional env:
 *   FIGMA_FILE_KEY  — override the default file key
 *   DRY_RUN=1       — print the payloads without sending them
 */

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'zNxR8TKmjOjBCQ0uotJoKH';
const DRY_RUN = process.env.DRY_RUN === '1';
const API = 'https://api.figma.com/v1';

if (!FIGMA_TOKEN) {
  console.error('Error: FIGMA_TOKEN environment variable is required');
  console.error('  Get one at: https://www.figma.com/developers/api#access-tokens');
  process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function hexToFigmaColor(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r: round(r), g: round(g), b: round(b), a: round(a) };
}

function pxToNumber(px) {
  return parseFloat(String(px).replace('px', ''));
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

async function figmaFetch(path, options = {}) {
  const url = `${API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Figma API error (${res.status}):`, JSON.stringify(data, null, 2));
    throw new Error(`Figma API ${res.status}: ${data.err || data.message || 'Unknown error'}`);
  }
  return data;
}

// ─── Token definitions ──────────────────────────────────────────────────────

const colorTokens = {
  'brand/50': '#E8FAF0',
  'brand/100': '#B8F0D2',
  'brand/200': '#88E6B4',
  'brand/300': '#58DC96',
  'brand/400': '#28D278',
  'brand/500': '#00B84A',
  'brand/600': '#009E3F',
  'brand/700': '#008435',
  'brand/800': '#006A2A',
  'brand/900': '#00501F',
  'semantic/success': '#16A34A',
  'semantic/success-light': '#DCFCE7',
  'semantic/warning': '#D97706',
  'semantic/warning-light': '#FEF3C7',
  'semantic/error': '#DC2626',
  'semantic/error-light': '#FEE2E2',
  'semantic/info': '#2563EB',
  'semantic/info-light': '#DBEAFE',
  'neutral/50': '#F9FAFB',
  'neutral/100': '#F3F4F6',
  'neutral/200': '#E5E7EB',
  'neutral/300': '#D1D5DB',
  'neutral/400': '#9CA3AF',
  'neutral/500': '#6B7280',
  'neutral/600': '#4B5563',
  'neutral/700': '#374151',
  'neutral/800': '#1F2937',
  'neutral/900': '#111827',
  'surface/background': '#F5F6F8',
  'surface/primary': '#FFFFFF',
  'surface/secondary': '#F0F1F3',
  'surface/elevated': '#FFFFFF',
  'text/primary': '#111827',
  'text/secondary': '#4B5563',
  'text/tertiary': '#9CA3AF',
  'text/inverse': '#FFFFFF',
  'interactive/default': '#00B84A',
  'interactive/hover': '#009E3F',
  'interactive/pressed': '#008435',
  'interactive/disabled': '#D1D5DB',
  'border/default': '#E5E7EB',
  'border/strong': '#D1D5DB',
};

const spacingTokens = {
  'spacing/0': 0,
  'spacing/0.5': 2,
  'spacing/1': 4,
  'spacing/2': 8,
  'spacing/3': 12,
  'spacing/4': 16,
  'spacing/5': 20,
  'spacing/6': 24,
  'spacing/8': 32,
  'spacing/10': 40,
  'spacing/12': 48,
  'spacing/16': 64,
  'spacing/20': 80,
  'named/xs': 4,
  'named/sm': 8,
  'named/md': 16,
  'named/lg': 24,
  'named/xl': 32,
  'named/2xl': 48,
};

const typographyTokens = {
  'display/font-size': 32,
  'display/line-height': 40,
  'display/font-weight': 600,
  'heading-lg/font-size': 24,
  'heading-lg/line-height': 32,
  'heading-lg/font-weight': 600,
  'heading-md/font-size': 20,
  'heading-md/line-height': 28,
  'heading-md/font-weight': 600,
  'heading-sm/font-size': 17,
  'heading-sm/line-height': 24,
  'heading-sm/font-weight': 500,
  'body-lg/font-size': 17,
  'body-lg/line-height': 24,
  'body-lg/font-weight': 400,
  'body-md/font-size': 15,
  'body-md/line-height': 20,
  'body-md/font-weight': 400,
  'body-sm/font-size': 13,
  'body-sm/line-height': 18,
  'body-sm/font-weight': 400,
  'caption/font-size': 11,
  'caption/line-height': 16,
  'caption/font-weight': 400,
};

const radiiTokens = {
  'radius/none': 0,
  'radius/sm': 8,
  'radius/md': 12,
  'radius/lg': 16,
  'radius/xl': 24,
  'radius/full': 9999,
};

// ─── Build Figma Variables API payload ──────────────────────────────────────

function buildVariablesPayload() {
  let tempId = 0;
  const nextId = (prefix) => `${prefix}:temp_${++tempId}`;

  const collections = [];
  const variables = [];

  // Helper to add a collection + its variables
  function addCollection(name, tokenMap, resolvedType) {
    const collectionId = nextId('VariableCollectionId');
    const modeId = nextId('VariableModeId');

    collections.push({
      action: 'CREATE',
      id: collectionId,
      name,
      initialModeId: modeId,
    });

    for (const [varName, rawValue] of Object.entries(tokenMap)) {
      const varId = nextId('VariableId');
      let value;

      if (resolvedType === 'COLOR') {
        value = hexToFigmaColor(rawValue);
      } else {
        value = typeof rawValue === 'number' ? rawValue : pxToNumber(rawValue);
      }

      variables.push({
        action: 'CREATE',
        id: varId,
        name: varName,
        variableCollectionId: collectionId,
        resolvedType,
        valuesByMode: { [modeId]: value },
      });
    }
  }

  addCollection('Colors', colorTokens, 'COLOR');
  addCollection('Spacing', spacingTokens, 'FLOAT');
  addCollection('Typography', typographyTokens, 'FLOAT');
  addCollection('Radii', radiiTokens, 'FLOAT');

  return {
    variableCollections: collections,
    variableModes: [],
    variables,
  };
}

// ─── Generate Figma Plugin code for Button component ────────────────────────

function generateButtonPluginCode() {
  return `
// ── Figma Plugin: Create Button Component ──────────────────────────────────
// Paste this into the Figma Plugin Console (Plugins → Development → Console)
// or use it in a Figma plugin.
//
// This creates a Button component set with all variants (primary, secondary,
// ghost, destructive) and sizes (sm, md, lg) bound to your design token variables.

async function createButtonComponent() {
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  const variants = {
    primary:     { fill: "interactive/default", text: "text/inverse",  hoverFill: "interactive/hover" },
    secondary:   { fill: "surface/primary",     text: "text/primary",  border: "border/default" },
    ghost:       { fill: null,                  text: "interactive/default" },
    destructive: { fill: "semantic/error",      text: "text/inverse" },
  };

  const sizes = {
    sm: { height: 36, paddingH: "named/md", fontSize: "body-sm/font-size", radius: "radius/sm" },
    md: { height: 44, paddingH: "named/lg", fontSize: "body-md/font-size", radius: "radius/md" },
    lg: { height: 52, paddingH: "named/xl", fontSize: "body-lg/font-size", radius: "radius/md" },
  };

  // Find variable collections
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const colorCollection = collections.find(c => c.name === "Colors");
  const spacingCollection = collections.find(c => c.name === "Spacing");
  const typographyCollection = collections.find(c => c.name === "Typography");
  const radiiCollection = collections.find(c => c.name === "Radii");

  function findVariable(collection, name) {
    if (!collection) return null;
    const vars = collection.variableIds.map(id => figma.variables.getVariableById(id));
    return vars.find(v => v && v.name === name) || null;
  }

  const componentSet = [];
  let xOffset = 0;

  for (const [variantName, variantConfig] of Object.entries(variants)) {
    for (const [sizeName, sizeConfig] of Object.entries(sizes)) {
      const frame = figma.createFrame();
      frame.name = \`Variant=\${variantName}, Size=\${sizeName}\`;
      frame.resize(140, sizeConfig.height);
      frame.x = xOffset;
      frame.y = 0;

      // Auto-layout
      frame.layoutMode = "HORIZONTAL";
      frame.primaryAxisAlignItems = "CENTER";
      frame.counterAxisAlignItems = "CENTER";
      frame.primaryAxisSizingMode = "HUG";
      frame.counterAxisSizingMode = "FIXED";

      // Padding — bind to spacing variable
      const paddingVar = findVariable(spacingCollection, sizeConfig.paddingH);
      if (paddingVar) {
        frame.setBoundVariable("paddingLeft", paddingVar);
        frame.setBoundVariable("paddingRight", paddingVar);
      } else {
        frame.paddingLeft = 16;
        frame.paddingRight = 16;
      }

      // Corner radius — bind to radii variable
      const radiusVar = findVariable(radiiCollection, sizeConfig.radius);
      if (radiusVar) {
        frame.setBoundVariable("topLeftRadius", radiusVar);
        frame.setBoundVariable("topRightRadius", radiusVar);
        frame.setBoundVariable("bottomLeftRadius", radiusVar);
        frame.setBoundVariable("bottomRightRadius", radiusVar);
      } else {
        frame.cornerRadius = 12;
      }

      // Fill color — bind to color variable
      if (variantConfig.fill) {
        const fillVar = findVariable(colorCollection, variantConfig.fill);
        if (fillVar) {
          const fillPaint = figma.util.solidPaint("#000000");
          frame.fills = [fillPaint];
          frame.setBoundVariable("fills", 0, "color", fillVar);
        }
      } else {
        frame.fills = [];
      }

      // Border for secondary variant
      if (variantConfig.border) {
        const borderVar = findVariable(colorCollection, variantConfig.border);
        const strokePaint = figma.util.solidPaint("#000000");
        frame.strokes = [strokePaint];
        frame.strokeWeight = 1;
        if (borderVar) {
          frame.setBoundVariable("strokes", 0, "color", borderVar);
        }
      }

      // Text node
      const text = figma.createText();
      text.characters = "Button";
      text.fontName = { family: "Inter", style: "Medium" };
      text.fontSize = sizeConfig.fontSize.includes("sm") ? 13 :
                      sizeConfig.fontSize.includes("lg") ? 17 : 15;

      // Text color — bind to variable
      const textColorVar = findVariable(colorCollection, variantConfig.text);
      if (textColorVar) {
        const textPaint = figma.util.solidPaint("#000000");
        text.fills = [textPaint];
        text.setBoundVariable("fills", 0, "color", textColorVar);
      }

      frame.appendChild(text);
      componentSet.push(frame);
      xOffset += 160;
    }
  }

  // Group into a section
  const section = figma.createSection();
  section.name = "Button";
  for (const frame of componentSet) {
    section.appendChild(frame);
  }
  section.x = 0;
  section.y = 0;

  figma.currentPage.appendChild(section);
  figma.viewport.scrollAndZoomIntoView([section]);

  console.log("✅ Button component created with " + componentSet.length + " variants");
}

createButtonComponent();
`.trim();
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎨 Figma Sync — Picnic Design Lab');
  console.log(`   File: ${FILE_KEY}`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  // Step 1: Check existing variables
  console.log('📋 Checking existing variables...');
  let existingVars;
  try {
    existingVars = await figmaFetch(`/files/${FILE_KEY}/variables/local`);
    const existingCount = Object.keys(existingVars.meta?.variables || {}).length;
    console.log(`   Found ${existingCount} existing variable(s)\n`);
  } catch (err) {
    console.log('   No existing variables found (or first-time setup)\n');
  }

  // Step 2: Build and push variables payload
  const payload = buildVariablesPayload();
  const totalVars = payload.variables.length;
  const totalCollections = payload.variableCollections.length;

  console.log(`📦 Prepared ${totalCollections} collections with ${totalVars} variables:`);
  for (const col of payload.variableCollections) {
    const varCount = payload.variables.filter(v => v.variableCollectionId === col.id).length;
    console.log(`   • ${col.name}: ${varCount} variables`);
  }
  console.log();

  if (DRY_RUN) {
    console.log('🔍 DRY RUN — Payload preview:');
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log('🚀 Pushing variables to Figma...');
    try {
      const result = await figmaFetch(`/files/${FILE_KEY}/variables`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('✅ Variables created successfully!');
      console.log(`   Created ${Object.keys(result.meta?.variables || {}).length} variables`);
      console.log(`   Created ${Object.keys(result.meta?.variableCollections || {}).length} collections\n`);
    } catch (err) {
      console.error('❌ Failed to push variables:', err.message);
      process.exit(1);
    }
  }

  // Step 3: Output the Figma Plugin code for Button component
  console.log('─'.repeat(60));
  console.log('🧩 Button Component — Figma Plugin Code');
  console.log('─'.repeat(60));
  console.log('');
  console.log('To place the Button component on the canvas:');
  console.log('1. In Figma, go to Plugins → Development → New Plugin');
  console.log('2. Choose "Figma design" → "Run once"');
  console.log('3. Paste the code from: scripts/figma-button-plugin.js');
  console.log('4. Click Run');
  console.log('');
  console.log('Or copy it from the generated file.');
  console.log('─'.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

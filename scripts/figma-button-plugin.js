// ── Figma Plugin: Create Button Component ──────────────────────────────────
//
// Creates a Button component set on the current Figma page with all variants
// (primary, secondary, ghost, destructive) × sizes (sm, md, lg) = 12 variants.
//
// All fills, padding, radii, and text colors are bound to the Figma Variables
// created by figma-sync.mjs (Colors, Spacing, Typography, Radii collections).
//
// Usage:
//   1. Run `figma-sync.mjs` first to create the variables
//   2. In Figma → Plugins → Development → New Plugin → "Run once"
//   3. Paste this code and click Run
// ────────────────────────────────────────────────────────────────────────────

async function createButtonComponent() {
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // ── Variant + Size definitions ──

  const variants = {
    primary: {
      fill: "interactive/default",
      text: "text/inverse",
      border: null,
    },
    secondary: {
      fill: "surface/primary",
      text: "text/primary",
      border: "border/default",
    },
    ghost: {
      fill: null,
      text: "interactive/default",
      border: null,
    },
    destructive: {
      fill: "semantic/error",
      text: "text/inverse",
      border: null,
    },
  };

  const sizes = {
    sm: { height: 36, paddingVar: "named/md", fontSizeVar: "body-sm/font-size", radiusVar: "radius/sm", fontSize: 13, lineHeight: 18 },
    md: { height: 44, paddingVar: "named/lg", fontSizeVar: "body-md/font-size", radiusVar: "radius/md", fontSize: 15, lineHeight: 20 },
    lg: { height: 52, paddingVar: "named/xl", fontSizeVar: "body-lg/font-size", radiusVar: "radius/md", fontSize: 17, lineHeight: 24 },
  };

  // ── Resolve variable helpers ──

  const allVars = await figma.variables.getLocalVariablesAsync();

  function findVar(name) {
    return allVars.find(v => v.name === name) || null;
  }

  function applyFill(node, colorVarName) {
    const variable = findVar(colorVarName);
    const paint = figma.util.solidPaint("#000000");
    node.fills = [paint];
    if (variable) {
      node.setBoundVariable("fills", 0, "color", variable);
    }
  }

  function applyStroke(node, colorVarName) {
    const variable = findVar(colorVarName);
    const paint = figma.util.solidPaint("#000000");
    node.strokes = [paint];
    node.strokeWeight = 1;
    if (variable) {
      node.setBoundVariable("strokes", 0, "color", variable);
    }
  }

  function applyPadding(node, spacingVarName) {
    const variable = findVar(spacingVarName);
    if (variable) {
      node.setBoundVariable("paddingLeft", variable);
      node.setBoundVariable("paddingRight", variable);
    } else {
      node.paddingLeft = 16;
      node.paddingRight = 16;
    }
    node.paddingTop = 0;
    node.paddingBottom = 0;
  }

  function applyRadius(node, radiusVarName) {
    const variable = findVar(radiusVarName);
    if (variable) {
      node.setBoundVariable("topLeftRadius", variable);
      node.setBoundVariable("topRightRadius", variable);
      node.setBoundVariable("bottomLeftRadius", variable);
      node.setBoundVariable("bottomRightRadius", variable);
    } else {
      node.cornerRadius = 12;
    }
  }

  // ── Create each variant × size combination as a component ──

  const components = [];
  let xOffset = 0;
  let yOffset = 0;

  for (const [variantName, variantCfg] of Object.entries(variants)) {
    xOffset = 0;

    for (const [sizeName, sizeCfg] of Object.entries(sizes)) {
      // Create component (not just a frame)
      const comp = figma.createComponent();
      comp.name = `Button/Variant=${variantName}, Size=${sizeName}`;

      // Size
      comp.resize(140, sizeCfg.height);

      // Auto-layout: horizontal, center-center, hug width
      comp.layoutMode = "HORIZONTAL";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.primaryAxisSizingMode = "HUG";
      comp.counterAxisSizingMode = "FIXED";
      comp.itemSpacing = 8;

      // Padding — bound to spacing variable
      applyPadding(comp, sizeCfg.paddingVar);

      // Corner radius — bound to radii variable
      applyRadius(comp, sizeCfg.radiusVar);

      // Fill
      if (variantCfg.fill) {
        applyFill(comp, variantCfg.fill);
      } else {
        comp.fills = [];
      }

      // Stroke (secondary variant)
      if (variantCfg.border) {
        applyStroke(comp, variantCfg.border);
      }

      // Text label
      const textNode = figma.createText();
      textNode.characters = "Button";
      textNode.fontName = { family: "Inter", style: "Medium" };
      textNode.fontSize = sizeCfg.fontSize;
      textNode.lineHeight = { value: sizeCfg.lineHeight, unit: "PIXELS" };

      // Text color — bound to color variable
      const textColorVar = findVar(variantCfg.text);
      if (textColorVar) {
        const textPaint = figma.util.solidPaint("#000000");
        textNode.fills = [textPaint];
        textNode.setBoundVariable("fills", 0, "color", textColorVar);
      } else {
        // Fallback: white for primary/destructive, dark for others
        const fallbackColor = (variantName === "primary" || variantName === "destructive")
          ? "#FFFFFF" : "#111827";
        textNode.fills = [figma.util.solidPaint(fallbackColor)];
      }

      comp.appendChild(textNode);

      // Position on canvas
      comp.x = xOffset;
      comp.y = yOffset;

      components.push(comp);
      xOffset += comp.width + 24;
    }

    yOffset += 72;
  }

  // ── Combine into a Component Set ──

  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = "Button";
  componentSet.x = 100;
  componentSet.y = 100;

  // Style the component set frame
  componentSet.fills = [figma.util.solidPaint("#FAFAFA", 0.5)];
  componentSet.paddingTop = 40;
  componentSet.paddingBottom = 40;
  componentSet.paddingLeft = 40;
  componentSet.paddingRight = 40;

  // Zoom to the result
  figma.viewport.scrollAndZoomIntoView([componentSet]);

  figma.notify(`✅ Button component created — ${components.length} variants (4 styles × 3 sizes)`);
  console.log("Done! Created Button component set with", components.length, "variants");
}

createButtonComponent();

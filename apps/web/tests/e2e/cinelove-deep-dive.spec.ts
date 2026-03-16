import { test } from "@playwright/test";

/**
 * Deep-dive CineLove editor DOM structure
 * Goal: Extract exactly how CraftJS is used — positioning, components, interactions
 */
test("CineLove Editor — DOM Deep Dive", async ({ page }) => {
  test.setTimeout(120000);

  // Login
  await page.goto("https://cinelove.me/login", {
    waitUntil: "domcontentloaded",
    timeout: 20000,
  });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  if (await emailInput.isVisible()) {
    await emailInput.fill("onenearcelo@gmail.com");
    await page.locator('input[type="password"]').first().fill("Admin@123");
    await page.locator('button[type="submit"], button:has-text("Sign in")').first().click();
    await page.waitForTimeout(5000);
  }

  // Go to editor template 53
  await page.goto(
    "https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4",
    { waitUntil: "domcontentloaded", timeout: 20000 },
  );
  await page.waitForTimeout(8000);

  console.log("=== URL ===", page.url());

  // 1. Extract canvas container structure
  const canvasInfo = await page.evaluate(() => {
    // Find the main canvas/craftjs container
    const craftNodes = document.querySelectorAll('[class*="craft"]');
    const results: string[] = [];
    craftNodes.forEach((node) => {
      const el = node as HTMLElement;
      const styles = window.getComputedStyle(el);
      results.push(
        `TAG=${el.tagName} CLASS=${el.className.substring(0, 80)} ` +
        `POS=${styles.position} W=${styles.width} H=${styles.height} ` +
        `DISPLAY=${styles.display} CHILDREN=${el.children.length}`
      );
    });
    return results.slice(0, 20);
  });
  console.log("\n=== CRAFTJS DOM NODES ===");
  canvasInfo.forEach((line) => console.log("  ", line));

  // 2. Find the root canvas and its direct children positioning
  const rootCanvasInfo = await page.evaluate(() => {
    // Look for the element that acts as the canvas viewport
    // CineLove uses a tall scrollable area
    const allDivs = document.querySelectorAll("div");
    let rootCanvas: HTMLElement | null = null;

    for (const div of allDivs) {
      const el = div as HTMLElement;
      const styles = window.getComputedStyle(el);
      const h = parseInt(styles.height);
      // The canvas is ~7000+ px tall
      if (h > 5000 && styles.position === "relative") {
        rootCanvas = el;
        break;
      }
    }

    if (!rootCanvas) {
      // Try another approach — look for position:relative with many absolute children
      for (const div of allDivs) {
        const el = div as HTMLElement;
        const styles = window.getComputedStyle(el);
        if (styles.position === "relative" && el.children.length > 10) {
          const childPositions = Array.from(el.children).map((c) => {
            return window.getComputedStyle(c as HTMLElement).position;
          });
          const absCount = childPositions.filter((p) => p === "absolute").length;
          if (absCount > 5) {
            rootCanvas = el;
            break;
          }
        }
      }
    }

    if (!rootCanvas) return { found: false, note: "No root canvas found" };

    const rootStyles = window.getComputedStyle(rootCanvas);
    const childDetails = Array.from(rootCanvas.children).slice(0, 15).map((child) => {
      const el = child as HTMLElement;
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        class: el.className?.substring(0, 60) || "",
        position: s.position,
        top: s.top,
        left: s.left,
        width: s.width,
        height: s.height,
        zIndex: s.zIndex,
        transform: s.transform,
        text: el.textContent?.substring(0, 40) || "",
      };
    });

    return {
      found: true,
      rootTag: rootCanvas.tagName,
      rootClass: rootCanvas.className?.substring(0, 80),
      rootPosition: rootStyles.position,
      rootWidth: rootStyles.width,
      rootHeight: rootStyles.height,
      rootDisplay: rootStyles.display,
      childCount: rootCanvas.children.length,
      children: childDetails,
    };
  });
  console.log("\n=== ROOT CANVAS ===");
  console.log(JSON.stringify(rootCanvasInfo, null, 2));

  // 3. Extract right panel structure when clicking a text element
  // Find and click a text element first
  const textEl = page.locator('div[style*="position: absolute"]').first();
  if (await textEl.isVisible().catch(() => false)) {
    await textEl.click();
    await page.waitForTimeout(1500);

    // Screenshot the right panel
    await page.screenshot({ path: "/tmp/cl-deep-text-selected.png" });

    // Extract right panel contents
    const rightPanel = await page.evaluate(() => {
      // Look for settings/properties panel (typically right side)
      const allLabels = Array.from(document.querySelectorAll("label, span, p, div"))
        .filter((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          return rect.left > window.innerWidth * 0.7; // Right 30% of screen
        })
        .map((el) => (el as HTMLElement).textContent?.trim())
        .filter((t) => t && t.length > 0 && t.length < 50);
      return [...new Set(allLabels)].slice(0, 40);
    });
    console.log("\n=== RIGHT PANEL LABELS (text selected) ===");
    rightPanel.forEach((label) => console.log("  ", label));
  }

  // 4. Check for CraftJS-specific data attributes or class names
  const craftjsEvidence = await page.evaluate(() => {
    const evidence: string[] = [];

    // Check for craftjs data attributes
    const craftAttrs = document.querySelectorAll("[data-cy]");
    craftAttrs.forEach((el) => {
      evidence.push(`data-cy="${el.getAttribute("data-cy")}" tag=${el.tagName}`);
    });

    // Check for __reactFiber or __reactInternalInstance
    const firstCanvas = document.querySelector('[style*="position: relative"]');
    if (firstCanvas) {
      const keys = Object.keys(firstCanvas).filter(
        (k) => k.startsWith("__react") || k.startsWith("__craftjs"),
      );
      evidence.push(`Canvas element react keys: ${keys.join(", ")}`);
    }

    // Check for global craft state
    // @ts-ignore
    const hasCraftStore = typeof window.__CRAFT_STATE__ !== "undefined";
    evidence.push(`window.__CRAFT_STATE__: ${hasCraftStore}`);

    // Check for next.js data
    // @ts-ignore
    const hasNext = typeof window.__NEXT_DATA__ !== "undefined";
    evidence.push(`window.__NEXT_DATA__: ${hasNext}`);

    // Check script tags for clues
    const scripts = document.querySelectorAll("script[src]");
    scripts.forEach((s) => {
      const src = s.getAttribute("src") || "";
      if (src.includes("craft") || src.includes("editor") || src.includes("canvas")) {
        evidence.push(`Script: ${src}`);
      }
    });

    return evidence;
  });
  console.log("\n=== CRAFTJS EVIDENCE ===");
  craftjsEvidence.forEach((e) => console.log("  ", e));

  // 5. Extract the inline styles of ALL elements on the canvas
  const elementStyles = await page.evaluate(() => {
    const allAbsolute = document.querySelectorAll('[style*="position: absolute"]');
    return Array.from(allAbsolute).slice(0, 30).map((el) => {
      const htmlEl = el as HTMLElement;
      const style = htmlEl.style;
      return {
        tag: htmlEl.tagName,
        top: style.top,
        left: style.left,
        width: style.width,
        height: style.height,
        zIndex: style.zIndex,
        transform: style.transform,
        position: style.position,
        textContent: htmlEl.textContent?.substring(0, 30) || "",
        childCount: htmlEl.children.length,
      };
    });
  });
  console.log("\n=== ABSOLUTE POSITIONED ELEMENTS ===");
  elementStyles.forEach((el, i) => console.log(`  [${i}]`, JSON.stringify(el)));

  // 6. Extract the actual CraftJS node tree from React internals
  const craftTree = await page.evaluate(() => {
    // Try to find CraftJS state in React fiber tree
    const findReactInternals = (el: Element): any => {
      const keys = Object.keys(el);
      const fiberKey = keys.find(
        (k) => k.startsWith("__reactFiber") || k.startsWith("__reactInternalInstance"),
      );
      if (fiberKey) {
        // @ts-ignore
        return el[fiberKey];
      }
      return null;
    };

    // Try to access store/context
    try {
      // @ts-ignore
      if (window.__NEXT_DATA__?.props?.pageProps) {
        // @ts-ignore
        const pageProps = window.__NEXT_DATA__.props.pageProps;
        return {
          source: "__NEXT_DATA__",
          keys: Object.keys(pageProps),
          hasTemplate: !!pageProps.template,
          templateKeys: pageProps.template ? Object.keys(pageProps.template) : [],
        };
      }
    } catch (e) {}

    return { source: "none", note: "Could not extract craft tree" };
  });
  console.log("\n=== CRAFT TREE / NEXT DATA ===");
  console.log(JSON.stringify(craftTree, null, 2));

  // Final screenshot
  await page.screenshot({ path: "/tmp/cl-deep-final.png" });
});

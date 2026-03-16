import { test } from "@playwright/test";

test("CineLove — Find ALL elements with positioning", async ({ page }) => {
  test.setTimeout(120000);

  await page.goto("https://cinelove.me/login", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(2000);
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  if (await emailInput.isVisible()) {
    await emailInput.fill("onenearcelo@gmail.com");
    await page.locator('input[type="password"]').first().fill("Admin@123");
    await page.locator('button[type="submit"], button:has-text("Sign in")').first().click();
    await page.waitForTimeout(5000);
  }

  await page.goto(
    "https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4",
    { waitUntil: "domcontentloaded", timeout: 20000 },
  );
  await page.waitForTimeout(10000);

  // 1. Find ALL elements that have inline style with "top:" — these are canvas elements
  const allPositioned = await page.evaluate(() => {
    const result: any[] = [];
    const allElements = document.querySelectorAll("*");

    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const style = htmlEl.getAttribute("style") || "";
      // Look for elements with inline top AND left positioning (canvas elements)
      if (style.includes("top:") && style.includes("left:") && style.includes("width:")) {
        const cs = window.getComputedStyle(htmlEl);
        const parentCs = htmlEl.parentElement ? window.getComputedStyle(htmlEl.parentElement) : null;
        result.push({
          tag: htmlEl.tagName,
          inlineStyle: style.substring(0, 250),
          computedPos: cs.position,
          computedTop: cs.top,
          computedLeft: cs.left,
          computedW: cs.width,
          computedH: cs.height,
          computedZ: cs.zIndex,
          text: htmlEl.textContent?.substring(0, 50) || "",
          parentPos: parentCs?.position || "",
          parentW: parentCs?.width || "",
          parentH: parentCs?.height || "",
        });
      }
    });

    return result;
  });

  console.log(`=== ELEMENTS WITH INLINE top+left+width (${allPositioned.length} found) ===`);
  allPositioned.forEach((el, i) => {
    console.log(`\n[${i}] ${el.tag} pos=${el.computedPos} top=${el.computedTop} left=${el.computedLeft} ${el.computedW}x${el.computedH} z=${el.computedZ}`);
    console.log(`     parent: pos=${el.parentPos} ${el.parentW}x${el.parentH}`);
    console.log(`     text: "${el.text}"`);
    console.log(`     style: ${el.inlineStyle}`);
  });

  // 2. Try intercepting the craft state from React context
  const craftState = await page.evaluate(() => {
    // Walk the React fiber tree to find CraftJS Editor context
    const rootEl = document.getElementById("__next");
    if (!rootEl) return { found: false, note: "No __next" };

    const fiberKey = Object.keys(rootEl).find(k => k.startsWith("__reactFiber"));
    if (!fiberKey) return { found: false, note: "No React fiber" };

    // @ts-ignore
    let fiber = rootEl[fiberKey];
    let craftStore: any = null;
    let depth = 0;
    const MAX_DEPTH = 200;

    // Walk up/down the fiber tree looking for CraftJS context
    const visited = new Set();
    const queue = [fiber];

    while (queue.length > 0 && depth < MAX_DEPTH) {
      const current = queue.shift();
      if (!current || visited.has(current)) continue;
      visited.add(current);
      depth++;

      // Check memoizedProps for craft-related data
      const props = current.memoizedProps;
      if (props) {
        // CraftJS stores state in its Editor context
        if (props.store || props.query || props.actions) {
          return {
            found: true,
            depth,
            hasCraftStore: !!props.store,
            hasCraftQuery: !!props.query,
            hasCraftActions: !!props.actions,
          };
        }
      }

      // Check stateNode for craft editor
      if (current.stateNode && current.stateNode !== rootEl) {
        const stateKeys = Object.keys(current.stateNode).filter(k =>
          k.includes("craft") || k.includes("editor") || k.includes("store")
        );
        if (stateKeys.length) {
          return { found: true, depth, stateKeys };
        }
      }

      if (current.child) queue.push(current.child);
      if (current.sibling) queue.push(current.sibling);
    }

    return { found: false, note: `Searched ${depth} fibers, no craft context found` };
  });
  console.log("\n=== CRAFT STATE SEARCH ===");
  console.log(JSON.stringify(craftState, null, 2));

  // 3. Check all script chunks for "craft" references
  const scriptAnalysis = await page.evaluate(() => {
    const scripts = document.querySelectorAll("script[src]");
    const craftScripts: string[] = [];
    scripts.forEach(s => {
      const src = s.getAttribute("src") || "";
      craftScripts.push(src);
    });

    // Also check inline scripts
    const inlineScripts = document.querySelectorAll("script:not([src])");
    let hasCraftRef = false;
    inlineScripts.forEach(s => {
      if (s.textContent?.includes("craft") || s.textContent?.includes("Craft")) {
        hasCraftRef = true;
      }
    });

    return {
      totalScripts: scripts.length,
      allSrcs: craftScripts.filter(s => s.includes("editor") || s.includes("craft") || s.includes("canvas")),
      hasCraftInlineRef: hasCraftRef,
      // Check for CraftJS specific globals
      // @ts-ignore
      hasFabric: typeof window.fabric !== "undefined",
      // @ts-ignore
      hasKonva: typeof window.Konva !== "undefined",
    };
  });
  console.log("\n=== SCRIPT ANALYSIS ===");
  console.log(JSON.stringify(scriptAnalysis, null, 2));

  await page.screenshot({ path: "/tmp/cl-deep-dive-4.png" });
});

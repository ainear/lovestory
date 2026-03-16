import { test } from "@playwright/test";

test("CineLove — Element-level DOM + templateData", async ({ page }) => {
  test.setTimeout(120000);

  await page.goto("https://cinelove.me/login", {
    waitUntil: "domcontentloaded",
    timeout: 20000,
  });
  await page.waitForTimeout(2000);
  const emailInput = page
    .locator('input[type="email"], input[name="email"]')
    .first();
  if (await emailInput.isVisible()) {
    await emailInput.fill("onenearcelo@gmail.com");
    await page.locator('input[type="password"]').first().fill("Admin@123");
    await page
      .locator('button[type="submit"], button:has-text("Sign in")')
      .first()
      .click();
    await page.waitForTimeout(5000);
  }

  await page.goto(
    "https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4",
    { waitUntil: "domcontentloaded", timeout: 20000 },
  );
  await page.waitForTimeout(8000);

  // 1. Drill down into the nested canvas — find all absolute elements at any depth
  const deepElements = await page.evaluate(() => {
    // Find the 500px canvas
    const allDivs = document.querySelectorAll("div");
    let canvas: HTMLElement | null = null;
    for (const div of allDivs) {
      const el = div as HTMLElement;
      const s = window.getComputedStyle(el);
      if (
        parseInt(s.width) >= 490 &&
        parseInt(s.width) <= 510 &&
        parseInt(s.height) > 5000
      ) {
        canvas = el;
        break;
      }
    }
    if (!canvas) return { found: false };

    // Recursively find the actual elements container
    let deepest = canvas;
    while (deepest.children.length <= 3) {
      const firstChild = deepest.children[0] as HTMLElement;
      if (!firstChild) break;
      const s = window.getComputedStyle(firstChild);
      if (parseInt(s.height) > 5000) {
        deepest = firstChild;
      } else {
        break;
      }
    }

    const result = {
      depth: 0,
      containerTag: deepest.tagName,
      containerClass: deepest.className?.toString().substring(0, 80),
      containerStyle: deepest.getAttribute("style")?.substring(0, 200),
      containerPosition: window.getComputedStyle(deepest).position,
      containerDisplay: window.getComputedStyle(deepest).display,
      totalChildren: deepest.children.length,
      children: [] as any[],
    };

    // Count nesting levels
    let temp = canvas;
    while (temp !== deepest) {
      result.depth++;
      temp = temp.children[0] as HTMLElement;
    }

    // Get ALL children
    Array.from(deepest.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const cs = window.getComputedStyle(el);
      result.children.push({
        i,
        tag: el.tagName,
        pos: cs.position,
        top: cs.top,
        left: cs.left,
        w: cs.width,
        h: cs.height,
        z: cs.zIndex,
        inlineStyle: (el.getAttribute("style") || "").substring(0, 150),
        text: el.textContent?.substring(0, 40) || "",
        kids: el.children.length,
      });
    });

    return result;
  });

  console.log("=== DEEPEST CANVAS CONTAINER ===");
  if ("depth" in deepElements) {
    console.log(`Depth from root: ${deepElements.depth}`);
    console.log(
      `Container: ${deepElements.containerTag} pos=${deepElements.containerPosition} display=${deepElements.containerDisplay}`,
    );
    console.log(`Style: ${deepElements.containerStyle}`);
    console.log(`Total children: ${deepElements.totalChildren}`);
    console.log("\nAll children:");
    deepElements.children?.forEach((c: any) => {
      console.log(
        `  [${c.i}] ${c.tag} pos=${c.pos} top=${c.top} left=${c.left} ${c.w}x${c.h} z=${c.z} kids=${c.kids}`,
      );
      console.log(`       text: "${c.text}"`);
      if (c.inlineStyle) console.log(`       style: ${c.inlineStyle}`);
    });
  }

  // 2. Extract templateData as object
  const templateKeys = await page.evaluate(() => {
    // @ts-ignore
    const td = window.__NEXT_DATA__?.props?.pageProps?.templateData;
    if (!td || typeof td !== "object") return { found: false };

    const keys = Object.keys(td);
    const rootNode = td["ROOT"];
    const sampleNodes: any[] = [];

    // Get first 5 non-ROOT nodes
    keys
      .filter((k) => k !== "ROOT")
      .slice(0, 5)
      .forEach((k) => {
        const node = td[k];
        sampleNodes.push({
          id: k,
          type: node?.type?.resolvedName || node?.type,
          propsKeys: node?.props ? Object.keys(node.props) : [],
          props: node?.props
            ? JSON.stringify(node.props).substring(0, 300)
            : "",
          nodesCount: node?.nodes?.length || 0,
          parent: node?.parent,
        });
      });

    return {
      found: true,
      totalNodes: keys.length,
      hasRoot: !!rootNode,
      rootType: rootNode?.type?.resolvedName || rootNode?.type,
      rootProps: rootNode?.props ? Object.keys(rootNode.props) : [],
      rootIsCanvas: rootNode?.isCanvas,
      rootNodesCount: rootNode?.nodes?.length || 0,
      sampleNodes,
    };
  });
  console.log("\n=== TEMPLATE DATA STRUCTURE ===");
  console.log(JSON.stringify(templateKeys, null, 2));

  // 3. Get ALL unique component types from templateData
  const componentTypes = await page.evaluate(() => {
    // @ts-ignore
    const td = window.__NEXT_DATA__?.props?.pageProps?.templateData;
    if (!td) return [];

    const types = new Map<string, number>();
    Object.values(td).forEach((node: any) => {
      const name = node?.type?.resolvedName || "unknown";
      types.set(name, (types.get(name) || 0) + 1);
    });

    return Array.from(types.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  });
  console.log("\n=== ALL COMPONENT TYPES ===");
  componentTypes.forEach((t: any) => console.log(`  ${t.name}: ${t.count}`));

  // 4. Get ROOT node's props to see canvas setup
  const rootProps = await page.evaluate(() => {
    // @ts-ignore
    const td = window.__NEXT_DATA__?.props?.pageProps?.templateData;
    if (!td?.ROOT) return {};
    return td.ROOT.props || {};
  });
  console.log("\n=== ROOT (AppContainer) PROPS ===");
  console.log(JSON.stringify(rootProps, null, 2));

  // 5. Get a sample Text node and PhotoBox node with ALL props
  const sampleElements = await page.evaluate(() => {
    // @ts-ignore
    const td = window.__NEXT_DATA__?.props?.pageProps?.templateData;
    if (!td) return {};

    let textNode: any = null;
    let photoNode: any = null;

    for (const [id, node] of Object.entries(td) as any[]) {
      if (!textNode && node?.type?.resolvedName === "Text") {
        textNode = { id, ...node };
      }
      if (!photoNode && node?.type?.resolvedName === "PhotoBox") {
        photoNode = { id, ...node };
      }
      if (textNode && photoNode) break;
    }

    return { textNode, photoNode };
  });
  console.log("\n=== SAMPLE TEXT NODE ===");
  console.log(JSON.stringify(sampleElements.textNode, null, 2));
  console.log("\n=== SAMPLE PHOTOBOX NODE ===");
  console.log(JSON.stringify(sampleElements.photoNode, null, 2));
});

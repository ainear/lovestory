import { test } from "@playwright/test";

test("CineLove Editor — Inner Canvas DOM", async ({ page }) => {
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

  await page.goto(
    "https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4",
    { waitUntil: "domcontentloaded", timeout: 20000 },
  );
  await page.waitForTimeout(8000);

  // 1. Get inner canvas (500x7306) children details
  const innerCanvas = await page.evaluate(() => {
    const allDivs = document.querySelectorAll("div");
    let canvas: HTMLElement | null = null;

    for (const div of allDivs) {
      const el = div as HTMLElement;
      const s = window.getComputedStyle(el);
      const w = parseInt(s.width);
      const h = parseInt(s.height);
      if (w >= 490 && w <= 510 && h > 5000) {
        canvas = el;
        break;
      }
    }

    if (!canvas) return { found: false };

    const s = window.getComputedStyle(canvas);
    const children = Array.from(canvas.children).slice(0, 40).map((child, i) => {
      const el = child as HTMLElement;
      const cs = window.getComputedStyle(el);
      const inlineStyle = el.getAttribute("style") || "";
      return {
        index: i,
        tag: el.tagName,
        class: el.className?.toString().substring(0, 80) || "",
        inlineStyle: inlineStyle.substring(0, 200),
        computedPosition: cs.position,
        computedTop: cs.top,
        computedLeft: cs.left,
        computedWidth: cs.width,
        computedHeight: cs.height,
        computedZIndex: cs.zIndex,
        computedTransform: cs.transform !== "none" ? cs.transform : "",
        textSnippet: el.textContent?.substring(0, 50) || "",
        childCount: el.children.length,
        dataAttrs: Array.from(el.attributes)
          .filter((a) => a.name.startsWith("data-"))
          .map((a) => `${a.name}=${a.value}`)
          .join(", "),
      };
    });

    return {
      found: true,
      canvasPosition: s.position,
      canvasDisplay: s.display,
      canvasWidth: s.width,
      canvasHeight: s.height,
      canvasOverflow: s.overflow,
      canvasBg: s.backgroundColor,
      totalChildren: canvas.children.length,
      children,
    };
  });

  console.log("=== INNER CANVAS (500px wide) ===");
  if (innerCanvas.found) {
    console.log(`Position: ${innerCanvas.canvasPosition}`);
    console.log(`Display: ${innerCanvas.canvasDisplay}`);
    console.log(`Size: ${innerCanvas.canvasWidth} x ${innerCanvas.canvasHeight}`);
    console.log(`Overflow: ${innerCanvas.canvasOverflow}`);
    console.log(`Background: ${innerCanvas.canvasBg}`);
    console.log(`Total children: ${innerCanvas.totalChildren}`);
    console.log("\nChildren:");
    innerCanvas.children?.forEach((c) => {
      console.log(`  [${c.index}] ${c.tag} pos=${c.computedPosition} top=${c.computedTop} left=${c.computedLeft} w=${c.computedWidth} h=${c.computedHeight} z=${c.computedZIndex}`);
      if (c.inlineStyle) console.log(`       style: ${c.inlineStyle}`);
      if (c.textSnippet) console.log(`       text: "${c.textSnippet}"`);
      if (c.dataAttrs) console.log(`       data: ${c.dataAttrs}`);
    });
  } else {
    console.log("Canvas NOT FOUND");
  }

  // 2. Check if elements use CSS classes or inline styles for positioning
  const positioningMethod = await page.evaluate(() => {
    const canvas = Array.from(document.querySelectorAll("div")).find((el) => {
      const s = window.getComputedStyle(el);
      return parseInt(s.width) >= 490 && parseInt(s.width) <= 510 && parseInt(s.height) > 5000;
    }) as HTMLElement;

    if (!canvas) return "canvas not found";

    const children = Array.from(canvas.children) as HTMLElement[];
    const methods = children.slice(0, 20).map((el) => {
      const hasInlineTop = el.style.top !== "";
      const hasInlineLeft = el.style.left !== "";
      const hasInlinePosition = el.style.position !== "";
      const hasTranslate = (el.style.transform || "").includes("translate");
      const className = el.className?.toString() || "";
      const hasPositionClass = /absolute|relative|fixed/.test(className);

      return {
        text: el.textContent?.substring(0, 20),
        inlinePosition: hasInlinePosition ? el.style.position : "",
        inlineTop: hasInlineTop ? el.style.top : "",
        inlineLeft: hasInlineLeft ? el.style.left : "",
        hasTranslate,
        positionClass: hasPositionClass,
        computedPos: window.getComputedStyle(el).position,
      };
    });

    return methods;
  });
  console.log("\n=== POSITIONING METHOD ===");
  console.log(JSON.stringify(positioningMethod, null, 2));

  // 3. Get the templateData from __NEXT_DATA__ and decode it
  const templateData = await page.evaluate(() => {
    // @ts-ignore
    const nextData = window.__NEXT_DATA__;
    if (!nextData?.props?.pageProps) return { found: false };

    const pageProps = nextData.props.pageProps;
    return {
      found: true,
      keys: Object.keys(pageProps),
      templateDataType: typeof pageProps.templateData,
      templateDataLength: typeof pageProps.templateData === "string" ? pageProps.templateData.length : 0,
      templateDataPreview: typeof pageProps.templateData === "string" ? pageProps.templateData.substring(0, 200) : "not string",
      templateId: pageProps.templateId,
    };
  });
  console.log("\n=== TEMPLATE DATA FROM __NEXT_DATA__ ===");
  console.log(JSON.stringify(templateData, null, 2));

  // 4. Try to decode templateData if it's base64
  if (templateData.found && templateData.templateDataType === "string") {
    const decoded = await page.evaluate(() => {
      // @ts-ignore
      const raw = window.__NEXT_DATA__.props.pageProps.templateData;
      try {
        const decoded = atob(raw);
        return { success: true, preview: decoded.substring(0, 500), length: decoded.length };
      } catch (e) {
        // Maybe it's JSON directly
        try {
          const parsed = JSON.parse(raw);
          const keys = Object.keys(parsed);
          return {
            success: true,
            isJson: true,
            keys,
            rootKeys: parsed.ROOT ? Object.keys(parsed.ROOT) : [],
            rootType: parsed.ROOT?.type,
            rootProps: parsed.ROOT?.props ? Object.keys(parsed.ROOT.props) : [],
            nodeCount: keys.length,
            sampleNode: keys.length > 1 ? JSON.stringify(parsed[keys[1]]).substring(0, 300) : "",
          };
        } catch (e2) {
          return { success: false, preview: raw.substring(0, 200) };
        }
      }
    });
    console.log("\n=== DECODED TEMPLATE DATA ===");
    console.log(JSON.stringify(decoded, null, 2));
  }

  await page.screenshot({ path: "/tmp/cl-deep-dive-2.png" });
});

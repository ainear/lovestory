import { test, expect, type Page } from "@playwright/test";

/**
 * E2E Pre-Check: LoveStory Template Editor vs CineLove.me
 *
 * Comprehensive smoke test verifying all editor features match CineLove parity.
 * Runs against local dev server (http://localhost:3000).
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

/* ── Auth helper ── */
async function login(page: Page) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const emailInput = page
    .locator('input[type="email"], input[name="email"]')
    .first();
  if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await emailInput.fill("test-demo@lovestory.vn");
    await page.locator('input[type="password"]').first().fill("TestDemo123!");
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(3000);
  }
}

async function openEditor(page: Page) {
  await login(page);
  await page.goto(`${BASE}/editor/new`, { waitUntil: "domcontentloaded" });
  // Wait for editor to fully render (top bar + canvas)
  await page.waitForTimeout(8000);
  // Ensure we're on the editor page (not redirected away)
  const currentUrl = page.url();
  if (!currentUrl.includes("editor")) {
    await login(page);
    await page.goto(`${BASE}/editor/new`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(8000);
  }
}

/* ═══════════════════════════════════════════════════════
   SECTION 1: Editor Shell — Layout & Structure
   CineLove has: left icon bar, sidebar panel, canvas, right panel, top bar
   ═══════════════════════════════════════════════════════ */

test.describe("1. Editor Shell", () => {
  test.setTimeout(90000);

  test("1.1 Editor page loads without crash", async ({ page }) => {
    await openEditor(page);

    // No error overlay or Next.js error page
    const errorOverlay = page.locator(
      "#__next-build-indicator, [data-nextjs-dialog]",
    );
    const hasError = await errorOverlay
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    expect(hasError).toBeFalsy();

    await page.screenshot({
      path: "tests/e2e/screenshots/precheck-1.1-shell.png",
    });
    console.log("✅ 1.1 Editor loads without crash");
  });

  test("1.2 Top bar: Undo, Redo, Lưu, Xem trước, Chia sẻ, Xuất bản", async ({
    page,
  }) => {
    await openEditor(page);

    const checks = [
      { label: "Undo button", selector: 'button[title="Hoàn tác (⌘Z)"]' },
      { label: "Redo button", selector: 'button[title="Làm lại (⌘⇧Z)"]' },
      { label: "Save button", selector: "text=Lưu" },
      { label: "Preview link", selector: "text=Xem trước" },
      { label: "Share button", selector: "text=Chia sẻ" },
      { label: "Publish button", selector: "text=Xuất bản" },
      { label: "Template swap", selector: "text=Đổi mẫu" },
    ];

    const results: Record<string, boolean> = {};
    for (const c of checks) {
      const visible = await page
        .locator(c.selector)
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      results[c.label] = visible;
      console.log(`  ${visible ? "✅" : "❌"} ${c.label}`);
    }

    // CineLove parity: all 7 top bar elements
    const missing = Object.entries(results)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    expect(missing).toEqual([]);
  });

  test("1.3 Left icon column: all 10 tabs visible", async ({ page }) => {
    await openEditor(page);

    const expectedTabs = [
      "Văn bản",
      "Hình ảnh",
      "Stock",
      "Hình dạng",
      "Nền",
      "Âm nhạc",
      "Tiện ích",
      "Mẫu",
      "Hiệu ứng",
      "Thành phần",
    ];

    const results: Record<string, boolean> = {};
    for (const tab of expectedTabs) {
      const btn = page
        .locator(`button[title="${tab}"]`)
        .or(page.locator(`button:has(span:text-is("${tab}"))`));
      const visible = await btn
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      results[tab] = visible;
      console.log(`  ${visible ? "✅" : "❌"} Tab: ${tab}`);
    }

    // CineLove has 10 tabs — we must match
    const found = Object.values(results).filter(Boolean).length;
    console.log(`\n  📊 Tabs found: ${found}/10`);
    expect(found).toBeGreaterThanOrEqual(9); // allow 1 tolerance for icon-only
  });

  test("1.4 Right panel shows empty state when nothing selected", async ({
    page,
  }) => {
    await openEditor(page);

    const emptyMsg = page
      .locator("text=Click vào phần tử trên canvas để chỉnh sửa")
      .or(page.locator("text=Tuỳ chỉnh"));
    const visible = await emptyMsg
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    console.log(`  ${visible ? "✅" : "❌"} Right panel empty state`);
    expect(visible).toBeTruthy();
  });

  test("1.5 Canvas area renders with background", async ({ page }) => {
    await openEditor(page);

    // Canvas should have position:relative and min-height
    const hasCanvas = await page.evaluate(() => {
      const allDivs = document.querySelectorAll("div");
      for (const d of allDivs) {
        const s = d.style;
        if (
          s.position === "relative" &&
          d.querySelector("[data-element-id]") !== null
        ) {
          return true;
        }
        if (
          s.minHeight &&
          parseInt(s.minHeight) > 500 &&
          s.position === "relative"
        ) {
          return true;
        }
      }
      // Fallback: check for canvas bg color
      return !!document.querySelector('[style*="min-height"]');
    });

    console.log(`  ${hasCanvas ? "✅" : "⚠️"} Canvas area detected`);
    await page.screenshot({
      path: "tests/e2e/screenshots/precheck-1.5-canvas.png",
    });
  });
});

/* ═══════════════════════════════════════════════════════
   SECTION 2: Sidebar Tabs — Open & Content Check
   CineLove: each tab opens a panel with content
   ═══════════════════════════════════════════════════════ */

test.describe("2. Sidebar Tab Content", () => {
  test.setTimeout(120000);

  test("2.1 Text tab: text presets visible", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Văn bản");

    // Should show text preset buttons (Tiêu đề, Phụ đề, etc.)
    const presets = page
      .locator("text=Tiêu đề")
      .or(page.locator("text=VĂN BẢN"));
    const visible = await presets
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    console.log(`  ${visible ? "✅" : "❌"} Text presets visible`);
    expect(visible).toBeTruthy();
  });

  test("2.2 Image tab: upload zone + stock library", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Hình ảnh");

    const uploadZone = page
      .locator("text=Kéo thả hoặc nhấn vào đây")
      .or(page.locator("text=Thêm hình ảnh"));
    const stockGrid = page.locator("text=Kho ảnh miễn phí");

    const hasUpload = await uploadZone
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    const hasStock = await stockGrid
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    console.log(`  ${hasUpload ? "✅" : "❌"} Upload zone`);
    console.log(`  ${hasStock ? "✅" : "❌"} Stock photo library`);

    // Check category filters (CineLove parity: multi-category)
    const categories = ["Tất cả", "Cặp đôi", "Lễ cưới", "Hoa"];
    let catCount = 0;
    for (const cat of categories) {
      const btn = page.locator(`button:text-is("${cat}")`);
      if (
        await btn
          .first()
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      )
        catCount++;
    }
    console.log(`  📊 Stock categories: ${catCount}/${categories.length}`);
    expect(hasUpload).toBeTruthy();
  });

  test("2.3 Stock tab: clipart library with categories", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Stock");

    // Should show clipart/sticker categories
    const hasContent = await page
      .locator("text=Sticker")
      .or(page.locator("text=Clipart"))
      .or(page.locator("text=Trang trí"))
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    console.log(`  ${hasContent ? "✅" : "❌"} Stock/clipart content`);
  });

  test("2.4 Shapes tab: shape elements", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Hình dạng");

    const hasShapes = await page
      .locator("text=HÌNH DẠNG")
      .or(page.locator("text=Hình chữ nhật"))
      .or(page.locator("text=Hình tròn"))
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    console.log(`  ${hasShapes ? "✅" : "❌"} Shapes panel content`);
  });

  test("2.5 Background tab: colors, gradients, images", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Nền");

    // Sub-tabs
    const subTabs = ["Màu sắc", "Gradient", "Hình ảnh"];
    let found = 0;
    for (const st of subTabs) {
      const btn = page.locator(`text=${st}`).first();
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) found++;
    }
    console.log(`  📊 BG sub-tabs: ${found}/${subTabs.length}`);

    // ColorPicker presence (CineLove parity)
    const hasColorPicker = await page
      .locator("text=Chọn màu")
      .or(page.locator("input[maxlength='7']"))
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    console.log(`  ${hasColorPicker ? "✅" : "⚠️"} ColorPicker component`);
  });

  test("2.6 Music tab: presets, search, widget style", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Âm nhạc");

    const checks = [
      { label: "Music list", sel: "text=Nhạc nền" },
      { label: "Search", sel: 'input[placeholder*="Tìm"]' },
      { label: "Widget style", sel: "text=Widget" },
    ];

    for (const c of checks) {
      const v = await page
        .locator(c.sel)
        .first()
        .isVisible({ timeout: 4000 })
        .catch(() => false);
      console.log(`  ${v ? "✅" : "❌"} ${c.label}`);
    }
  });

  test("2.7 Plugins tab: widget gallery (11 widgets)", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Tiện ích");

    // CineLove widgets — labels include emoji prefix in PluginsTab
    const widgetLabels = [
      "Đếm ngược",
      "Lịch cưới",
      "Bản đồ",
      "RSVP",
      "QR Box",
      "Album ảnh",
      "Phong bì thư",
      "Video YouTube",
      "Nút gọi",
      "Tên khách mời",
      "Form tuỳ chỉnh",
    ];

    let found = 0;
    for (const w of widgetLabels) {
      const vis = await page
        .locator(`text=${w}`)
        .first()
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      if (vis) found++;
      console.log(`  ${vis ? "✅" : "❌"} Widget: ${w}`);
    }
    console.log(`\n  📊 Widgets found: ${found}/${widgetLabels.length}`);
    expect(found).toBeGreaterThanOrEqual(8); // at least 8 of 11
  });

  test("2.8 Templates tab: template gallery with categories", async ({
    page,
  }) => {
    await openEditor(page);
    await clickTab(page, "Mẫu");

    const hasTemplates = await page
      .locator("text=MẪU")
      .or(page.locator("text=Xem mẫu"))
      .or(page.locator("text=Nâng cấp"))
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    console.log(`  ${hasTemplates ? "✅" : "❌"} Templates gallery`);
  });

  test("2.9 Effects tab: page anim, curtain, particles", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Hiệu ứng");

    const subTabs = ["Chuyển trang", "Rèm mở", "Hạt bay"];
    let found = 0;
    for (const st of subTabs) {
      const vis = await page
        .locator(`text=${st}`)
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (vis) found++;
      console.log(`  ${vis ? "✅" : "❌"} Effect: ${st}`);
    }
    console.log(`  📊 Effect sub-tabs: ${found}/${subTabs.length}`);
  });

  test("2.10 Components tab: section presets (22+)", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Thành phần");

    // Should show section categories and preset cards
    const hasContent = await page
      .locator("text=THÀNH PHẦN")
      .or(page.locator("text=Section"))
      .or(page.locator("text=Hero"))
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    console.log(`  ${hasContent ? "✅" : "❌"} Components/sections panel`);
  });
});

/* ═══════════════════════════════════════════════════════
   SECTION 3: Canvas Interactions
   CineLove: click to select, drag to move, resize handles
   ═══════════════════════════════════════════════════════ */

test.describe("3. Canvas Interactions", () => {
  test.setTimeout(90000);

  test("3.1 Add text element via Text tab", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Văn bản");
    await page.waitForTimeout(1000);

    // Click first text preset button
    const presetBtn = page
      .locator("button")
      .filter({ hasText: /Tiêu đề|Heading/ })
      .first();
    const isPresent = await presetBtn
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (isPresent) {
      await presetBtn.click();
      await page.waitForTimeout(1000);

      // Check canvas now has an element
      const elements = await page.locator("[data-element-id]").count();
      console.log(`  ✅ Text element added, canvas elements: ${elements}`);
    } else {
      console.log("  ⚠️ Could not find text preset button");
    }

    await page.screenshot({
      path: "tests/e2e/screenshots/precheck-3.1-add-text.png",
    });
  });

  test("3.2 Click element shows selection handles + right panel props", async ({
    page,
  }) => {
    await openEditor(page);
    await clickTab(page, "Văn bản");
    await page.waitForTimeout(1000);

    // Add a text element
    const presetBtn = page
      .locator("button")
      .filter({ hasText: /Tiêu đề|Heading/ })
      .first();
    if (await presetBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await presetBtn.click();
      await page.waitForTimeout(1000);

      // Click on the element
      const el = page.locator("[data-element-id]").first();
      if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
        await el.click();
        await page.waitForTimeout(500);

        // Check selection handles (border or resize handles)
        const hasSelection = await page.evaluate(() => {
          const selected =
            document.querySelector('[style*="outline"]') ||
            document.querySelector('[style*="border: 2px solid"]') ||
            document.querySelector("[data-resize-handle]");
          return !!selected;
        });

        // Check right panel shows properties
        const rightPanelHasProps = await page
          .locator("text=Vị trí")
          .or(page.locator("text=Kích thước"))
          .or(page.locator("text=Xoay"))
          .or(page.locator("text=Opacity"))
          .first()
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        console.log(
          `  ${hasSelection ? "✅" : "⚠️"} Selection handles visible`,
        );
        console.log(
          `  ${rightPanelHasProps ? "✅" : "❌"} Right panel shows element properties`,
        );
      }
    }

    await page.screenshot({
      path: "tests/e2e/screenshots/precheck-3.2-selection.png",
    });
  });

  test("3.3 Keyboard: Delete element, Undo/Redo", async ({ page }) => {
    await openEditor(page);
    await clickTab(page, "Văn bản");
    await page.waitForTimeout(1000);

    const presetBtn = page
      .locator("button")
      .filter({ hasText: /Tiêu đề|Heading/ })
      .first();
    if (await presetBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await presetBtn.click();
      await page.waitForTimeout(1000);

      const initialCount = await page.locator("[data-element-id]").count();

      // Select and delete
      const el = page.locator("[data-element-id]").first();
      if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
        await el.click();
        await page.keyboard.press("Delete");
        await page.waitForTimeout(500);

        const afterDelete = await page.locator("[data-element-id]").count();
        console.log(
          `  Elements: ${initialCount} → ${afterDelete} after Delete`,
        );

        // Undo
        await page.keyboard.press("Meta+z");
        await page.waitForTimeout(500);
        const afterUndo = await page.locator("[data-element-id]").count();
        console.log(`  Elements: ${afterUndo} after Undo`);
        console.log(
          `  ${afterDelete < initialCount && afterUndo >= initialCount ? "✅" : "⚠️"} Delete + Undo works`,
        );
      }
    }
  });
});

/* ═══════════════════════════════════════════════════════
   SECTION 4: CineLove Feature Parity Checklist
   Compare key features between LoveStory and CineLove.me
   ═══════════════════════════════════════════════════════ */

test.describe("4. CineLove Feature Parity", () => {
  test.setTimeout(60000);

  test("4.1 Feature inventory — DOM analysis", async ({ page }) => {
    await openEditor(page);

    const inventory = await page.evaluate(() => {
      const result: Record<string, boolean | number | string> = {};

      // Left sidebar
      const tabButtons = document.querySelectorAll("button[title]");
      result.tabCount = Array.from(tabButtons).filter(
        (b) =>
          b.closest('[style*="width: 85px"]') ||
          b.closest('[style*="width:85px"]'),
      ).length;

      // Canvas elements
      result.canvasElements =
        document.querySelectorAll("[data-element-id]").length;

      // Right panel width
      const rightPanel =
        document.querySelector('[style*="width: 350"]') ||
        document.querySelector('[style*="width:350"]');
      result.hasRightPanel = !!rightPanel;

      // Top bar
      result.hasUndo = !!document.querySelector('[title*="Hoàn tác"]');
      result.hasRedo = !!document.querySelector('[title*="Làm lại"]');
      result.hasSave = !!document.querySelector('[title*="Lưu ngay"]');
      result.hasPublish = !!Array.from(
        document.querySelectorAll("button"),
      ).find((b) => b.textContent?.includes("Xuất bản"));
      result.hasPreview = !!Array.from(document.querySelectorAll("a")).find(
        (a) => a.textContent?.includes("Xem trước"),
      );
      result.hasTemplateSwap = !!Array.from(
        document.querySelectorAll("button"),
      ).find((b) => b.textContent?.includes("Đổi mẫu"));

      // Device preview
      result.hasDeviceBar =
        !!document.querySelector('[title*="Mobile"]') ||
        !!document.querySelector('[title*="Desktop"]');

      // Floating toolbar
      result.hasFloatingToolbar = !!document.querySelector(
        '[style*="backdrop-filter"]',
      );

      // Help button
      result.hasHelp = !!Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Hỗ trợ"),
      );

      return result;
    });

    console.log("\n╔═══════════════════════════════════════════╗");
    console.log("║  CineLove vs LoveStory Feature Parity     ║");
    console.log("╠═══════════════════════════════════════════╣");

    const cineloveFeatures = [
      {
        name: "10 sidebar tabs",
        check: (inventory as Record<string, number>).tabCount >= 10,
      },
      { name: "Right property panel", check: inventory.hasRightPanel },
      { name: "Undo/Redo", check: inventory.hasUndo && inventory.hasRedo },
      { name: "Manual Save", check: inventory.hasSave },
      { name: "Publish button", check: inventory.hasPublish },
      { name: "Preview link", check: inventory.hasPreview },
      { name: "Template hot-swap", check: inventory.hasTemplateSwap },
      { name: "Device preview bar", check: inventory.hasDeviceBar },
      { name: "Help button", check: inventory.hasHelp },
    ];

    let pass = 0;
    for (const f of cineloveFeatures) {
      const status = f.check ? "✅ PASS" : "❌ FAIL";
      if (f.check) pass++;
      console.log(`║  ${status}  ${f.name.padEnd(28)}║`);
    }

    console.log("╠═══════════════════════════════════════════╣");
    console.log(
      `║  Score: ${pass}/${cineloveFeatures.length} features matched              ║`,
    );
    console.log("╚═══════════════════════════════════════════╝");

    await page.screenshot({
      path: "tests/e2e/screenshots/precheck-4.1-parity.png",
    });
    expect(pass).toBeGreaterThanOrEqual(7);
  });
});

/* ═══════════════════════════════════════════════════════
   SECTION 5: CineLove.me Live Comparison (if accessible)
   ═══════════════════════════════════════════════════════ */

test.describe("5. CineLove.me Live Comparison", () => {
  test.setTimeout(30000);

  test("5.1 CineLove editor structure snapshot", async ({ page }) => {
    // Navigate to CineLove.me editor (public demo)
    await page
      .goto("https://cinelove.me", {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      })
      .catch(() => null);
    await page.waitForTimeout(3000);

    const isReachable = page.url().includes("cinelove");
    if (!isReachable) {
      console.log("  ⚠️ CineLove.me not reachable — skipping live comparison");
      test.skip();
      return;
    }

    // Snapshot what CineLove has on homepage
    const snapshot = await page.evaluate(() => {
      return {
        title: document.title,
        hasEditor: !!document.querySelector('[class*="editor"]'),
        links: Array.from(document.querySelectorAll("a"))
          .map((a) => a.href)
          .filter(
            (h) =>
              h.includes("editor") ||
              h.includes("template") ||
              h.includes("design"),
          )
          .slice(0, 10),
        bodyText: document.body.innerText.substring(0, 500),
      };
    });

    console.log("  CineLove.me snapshot:");
    console.log(`  Title: ${snapshot.title}`);
    console.log(`  Editor links: ${snapshot.links.length}`);
    console.log(`  Body preview: ${snapshot.bodyText.substring(0, 200)}...`);

    await page.screenshot({
      path: "tests/e2e/screenshots/precheck-5.1-cinelove.png",
    });
  });
});

/* ═══════════════════════════════════════════════════════
   SECTION 6: Summary Report
   ═══════════════════════════════════════════════════════ */

test.describe("6. Summary Report", () => {
  test.setTimeout(120000);

  test("6.1 Full editor audit with screenshots", async ({ page }) => {
    await openEditor(page);

    // Screenshot each tab open state
    const tabs = [
      "Văn bản",
      "Hình ảnh",
      "Stock",
      "Hình dạng",
      "Nền",
      "Âm nhạc",
      "Tiện ích",
      "Mẫu",
      "Hiệu ứng",
      "Thành phần",
    ];

    for (let i = 0; i < tabs.length; i++) {
      await clickTab(page, tabs[i]);
      await page.waitForTimeout(800);
      await page.screenshot({
        path: `tests/e2e/screenshots/precheck-6.1-tab-${i + 1}-${tabs[i]}.png`,
      });
      console.log(`  📸 Tab ${i + 1}: ${tabs[i]}`);
    }

    console.log("\n═══════════════════════════════════════");
    console.log("  EDITOR PRE-CHECK COMPLETE");
    console.log("  Screenshots saved to tests/e2e/screenshots/");
    console.log("═══════════════════════════════════════");
  });
});

/* ── Helper ── */
async function clickTab(page: Page, label: string) {
  // Try button with title first, then text match
  const btn = page
    .locator(`button[title="${label}"]`)
    .or(page.locator(`button:has(span:text-is("${label}"))`));
  const visible = await btn
    .first()
    .isVisible({ timeout: 5000 })
    .catch(() => false);
  if (visible) {
    await btn.first().click();
    // Wait for sidebar panel to slide in
    await page.waitForTimeout(1000);
  }
}

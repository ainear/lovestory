import { test } from '@playwright/test';
import * as fs from 'fs';

const OUT = '/tmp/cinelove-analysis';

test.beforeAll(() => { fs.mkdirSync(OUT, { recursive: true }); });

test('Part 1: Framework and DOM', async ({ page }) => {
  await page.goto('https://cinelove.me/login');
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', 'onenearcelo@gmail.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  await page.goto('https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4');
  await page.waitForTimeout(10000);

  // Framework
  const fw = await page.evaluate(() => {
    return JSON.stringify({
      hasNext: !!document.getElementById('__next'),
      hasReact: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
      hasVue: !!(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__,
      hasNuxt: !!(window as any).__NUXT__,
      scripts: Array.from(document.querySelectorAll('script[src]')).map(s => (s as any).src).slice(0, 15),
    });
  });
  fs.writeFileSync(`${OUT}/framework.json`, fw);

  // Positioning
  const pos = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('div'));
    const abs = all.filter(el => getComputedStyle(el).position === 'absolute');
    return JSON.stringify({
      total: all.length,
      absCount: abs.length,
      absSamples: abs.slice(0, 12).map(el => ({
        cls: (el.className || '').toString().substring(0, 60),
        l: getComputedStyle(el).left,
        t: getComputedStyle(el).top,
        w: getComputedStyle(el).width,
        h: getComputedStyle(el).height,
        txt: (el.textContent || '').substring(0, 30),
      })),
    });
  });
  fs.writeFileSync(`${OUT}/positioning.json`, pos);

  // Fonts
  const fnts = await page.evaluate(() => {
    const s = new Set<string>();
    document.querySelectorAll('*').forEach((el, i) => {
      if (i > 300) return;
      s.add(getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/"/g, ''));
    });
    return JSON.stringify({
      fonts: Array.from(s),
      links: Array.from(document.querySelectorAll('link[href*="fonts"]')).map(l => (l as any).href),
    });
  });
  fs.writeFileSync(`${OUT}/fonts.json`, fnts);

  // CSS classes sample
  const cssClasses = await page.evaluate(() => {
    const s = new Set<string>();
    document.querySelectorAll('*').forEach((el, i) => {
      if (i > 300) return;
      (el.className?.toString?.() || '').split(' ').forEach(c => { if (c.length > 2) s.add(c); });
    });
    return JSON.stringify(Array.from(s).slice(0, 60));
  });
  fs.writeFileSync(`${OUT}/css-classes.json`, cssClasses);

  // Canvas HTML (first 30KB)
  const html = await page.evaluate(() => {
    return document.body.innerHTML.substring(0, 30000);
  });
  fs.writeFileSync(`${OUT}/page-html.html`, html);

  // API / storage info
  const api = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    return JSON.stringify({
      lsKeys: keys.filter(k => k.includes('supabase') || k.includes('auth') || k.includes('sb-')),
    });
  });
  fs.writeFileSync(`${OUT}/api.json`, api);

  console.log('Part 1 done');
});

test('Part 2: Element interaction', async ({ page }) => {
  await page.goto('https://cinelove.me/login');
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', 'onenearcelo@gmail.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  await page.goto('https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4');
  await page.waitForTimeout(10000);

  // Click on text to see selection behavior
  await page.locator('text="Lễ Vu Quy"').first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/after-click.png` });

  // Analyze what changed after click (selection UI)
  const sel = await page.evaluate(() => {
    // Find any element with drag/resize cursors
    const allEls = Array.from(document.querySelectorAll('*'));
    const withCursor = allEls.filter(el => {
      const c = getComputedStyle(el).cursor;
      return c === 'move' || c === 'grab' || c === 'nwse-resize' || c === 'nesw-resize' || c === 'pointer';
    });
    // Find elements with blue/selection styling added dynamically
    const withBorder = allEls.filter(el => {
      const s = (el as HTMLElement).style;
      return s.border?.includes('dashed') || s.outline?.includes('dashed') || s.border?.includes('solid');
    });
    return JSON.stringify({
      cursorElements: withCursor.slice(0, 8).map(el => ({
        tag: el.tagName,
        cls: (el.className || '').toString().substring(0, 60),
        cursor: getComputedStyle(el).cursor,
        style: (el as HTMLElement).style.cssText.substring(0, 200),
      })),
      borderedElements: withBorder.slice(0, 5).map(el => ({
        tag: el.tagName,
        cls: (el.className || '').toString().substring(0, 60),
        style: (el as HTMLElement).style.cssText.substring(0, 300),
      })),
    });
  });
  fs.writeFileSync(`${OUT}/selection.json`, sel);

  // Double-click to see edit mode
  await page.locator('text="Lễ Vu Quy"').first().dblclick();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/after-dblclick.png` });

  console.log('Part 2 done');
});

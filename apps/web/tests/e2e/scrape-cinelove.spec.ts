import { test } from '@playwright/test';
import * as fs from 'fs';

test('Deep extract CineLove canvas elements', async ({ page }) => {
    test.setTimeout(120000);
    
    // 1. Login
    await page.goto('https://cinelove.me/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'onenearcelo@gmail.com');
    await page.fill('input[type="password"], input[name="password"], input[placeholder*="mật khẩu" i]', 'Admin@123');
    const loginBtn = page.locator('button[type="submit"], button:has-text("Đăng nhập"), button:has-text("Login")').first();
    await loginBtn.click();
    await page.waitForTimeout(5000);
    
    // 2. Navigate to editor template    
    await page.goto('https://cinelove.me/editor-template/a038df05-e9a9-408e-bd48-3cd7a239bbc4', { waitUntil: 'networkidle' });
    await page.waitForTimeout(15000);
    
    // 3. Find the canvas container and extract all meaningful elements
    const canvasData = await page.evaluate(() => {
        // Find the craft.js canvas - it's usually a div with specific attributes
        // Look for the AppContainer or canvas-area
        const allDivs = document.querySelectorAll('div');
        let canvasEl: Element | null = null;
        
        for (const d of allDivs) {
            // CineLove uses craft.js - look for data-cy="craftjs-renderer" or similar
            if (d.getAttribute('data-cy') === 'craftjs-renderer' 
                || d.classList.contains('craftjs-renderer')
                || d.getAttribute('data-template')) {
                canvasEl = d;
                break;
            }
        }
        
        // Fallback: look for the scrollable center area with the actual invitation content
        if (!canvasEl) {
            // The canvas is typically the center panel between left sidebar and right panel
            // Look for elements with absolute positioning (craft.js elements are absolute)
            for (const d of allDivs) {
                const style = window.getComputedStyle(d);
                const bgColor = style.backgroundColor;
                // The canvas background is cream (#f8f3eb)
                if (bgColor.includes('248, 243, 235') || bgColor.includes('f8f3eb')) {
                    canvasEl = d;
                    break;
                }
            }
        }
        
        // Fallback 2: find by scanning for the invitation text content
        if (!canvasEl) {
            const textNodes = document.querySelectorAll('*');
            for (const n of textNodes) {
                if (n.textContent && (n.textContent.includes('Lễ Vu Quy') || n.textContent.includes('Vu Quy'))) {
                    // Walk up to find the canvas container
                    let parent = n.parentElement;
                    let depth = 0;
                    while (parent && depth < 10) {
                        const cs = window.getComputedStyle(parent);
                        if (parseInt(cs.height) > 2000) { // Canvas is tall
                            canvasEl = parent;
                            break;
                        }
                        parent = parent.parentElement;
                        depth++;
                    }
                    if (canvasEl) break;
                }
            }
        }
        
        if (!canvasEl) {
            return { error: 'Could not find canvas element', bodyClasses: document.body.className, allDivCount: allDivs.length };
        }
        
        // Now extract all child elements with full detail
        const elements: any[] = [];
        
        function extractDeep(el: Element, depth: number) {
            if (depth > 20) return;
            const cs = window.getComputedStyle(el);
            if (cs.display === 'none') return;
            
            const tag = el.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style') return;
            
            const isAbsolute = cs.position === 'absolute';
            const hasText = el.children.length === 0 && el.textContent && el.textContent.trim().length > 0;
            const isImg = tag === 'img';
            const hasBgImage = cs.backgroundImage !== 'none';
            
            if (isAbsolute || hasText || isImg || hasBgImage) {
                const entry: any = {
                    tag,
                    position: cs.position,
                    top: cs.top,
                    left: cs.left,
                    width: cs.width,
                    height: cs.height,
                    fontSize: cs.fontSize,
                    fontFamily: cs.fontFamily?.substring(0, 80),
                    fontWeight: cs.fontWeight,
                    fontStyle: cs.fontStyle,
                    color: cs.color,
                    textAlign: cs.textAlign,
                    lineHeight: cs.lineHeight,
                    letterSpacing: cs.letterSpacing,
                    backgroundColor: cs.backgroundColor,
                    backgroundImage: hasBgImage ? cs.backgroundImage.substring(0, 200) : undefined,
                    borderRadius: cs.borderRadius,
                    opacity: cs.opacity,
                    transform: cs.transform !== 'none' ? cs.transform : undefined,
                    zIndex: cs.zIndex,
                    className: typeof el.className === 'string' ? el.className.substring(0, 100) : undefined,
                };
                
                if (hasText) entry.text = el.textContent!.trim().substring(0, 300);
                if (isImg) entry.src = (el as HTMLImageElement).src?.substring(0, 300);
                if (hasBgImage) entry.bgImage = cs.backgroundImage.substring(0, 300);
                
                // Get bounding rect relative to canvas
                const rect = el.getBoundingClientRect();
                const canvasRect = canvasEl!.getBoundingClientRect();
                entry.relativeTop = rect.top - canvasRect.top;
                entry.relativeLeft = rect.left - canvasRect.left;
                entry.rectWidth = rect.width;
                entry.rectHeight = rect.height;
                
                elements.push(entry);
            }
            
            for (const child of el.children) {
                extractDeep(child, depth + 1);
            }
        }
        
        const canvasCs = window.getComputedStyle(canvasEl);
        const canvasInfo = {
            width: canvasCs.width,
            height: canvasCs.height,
            backgroundColor: canvasCs.backgroundColor,
            position: canvasCs.position,
        };
        
        extractDeep(canvasEl, 0);
        
        return { canvasInfo, elementsCount: elements.length, elements };
    });
    
    fs.writeFileSync('/tmp/cinelove_canvas_elements.json', JSON.stringify(canvasData, null, 2));
    console.log('Result:', typeof canvasData === 'object' && 'error' in canvasData ? canvasData.error : `Found ${canvasData.elementsCount} elements!`);
    
    // Take screenshot of just the canvas area for visual reference
    await page.screenshot({ path: '/tmp/cinelove_editor_canvas.png', fullPage: true });
});

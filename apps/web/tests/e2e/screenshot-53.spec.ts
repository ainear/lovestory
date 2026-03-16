import { test, expect } from '@playwright/test';

test('Screenshot local template 53 vs original', async ({ page }) => {
    // 1. Take a screenshot of the original thumbnail
    await page.goto('http://localhost:3000/templates/long_thumbnail/a038df05-e9a9-408e-bd48-3cd7a239bbc4_1767931340.webp');
    await page.waitForTimeout(2000); // wait to load
    await page.screenshot({ path: '/tmp/original-cinelove-53.png', fullPage: true });

    // 2. Take a screenshot of the live local template
    await page.goto('http://localhost:3000/editor/3ddee8e4-59cd-4aef-8d04-93a1d201cf3d');
    
    // Login if redirected
    if (page.url().includes('login')) {
       await page.fill('input[type="email"]', 'ainear@lovestory.com'); // try a common lovestory test user
       await page.fill('input[type="password"]', 'password123'); // or no password needed for passwordless? Let's try password
       await page.click('button[type="submit"]');
       await page.waitForTimeout(2000);
       await page.goto('http://localhost:3000/editor/3ddee8e4-59cd-4aef-8d04-93a1d201cf3d');
    }

    // Give it time to fully render the Craft.js canvas
    await page.waitForTimeout(4000);
    await page.screenshot({ path: '/tmp/local-implemented-53.png', fullPage: true });
});

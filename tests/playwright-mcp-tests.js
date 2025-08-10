// playwright-lexibot-tests.js
// Use this with your Playwright MCP server to test LexiBot

const { test, expect } = require('@playwright/test');

test.describe('LexiBot MCP Tests', () => {
  test('Test Legal Help Navigation', async ({ page }) => {
    // Navigate to your local LexiBot
    await page.goto('http://localhost:3000');
    
    // Test your beautiful navbar
    await expect(page.locator('nav')).toBeVisible();
    
    // Test Legal Help feature
    await page.click('text=Legal Help');
    await expect(page).toHaveURL(/legal-help/);
    
    // Test family law category
    await page.click('text=Family Law');
    await expect(page).toHaveURL(/chat\?category=family/);
    
    // Verify starter message appears
    await expect(page.locator('text=Family Law Questions')).toBeVisible();
  });

  test('Test Document Upload Flow', async ({ page }) => {
    await page.goto('http://localhost:3000/upload');
    
    // Test file upload (you'll need a test PDF)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-document.pdf');
    
    // Wait for upload success
    await expect(page.locator('text=Upload successful')).toBeVisible();
    
    // Should redirect to chat with document mode
    await expect(page).toHaveURL(/chat\?mode=document/);
  });

  test('Test Language Detection', async ({ page }) => {
    await page.goto('http://localhost:3000/chat?category=family&language=urdu');
    
    // Verify Urdu content appears
    await expect(page.locator('text=خاندانی قانون')).toBeVisible();
    
    // Test English mode
    await page.goto('http://localhost:3000/chat?category=family&language=english');
    await expect(page.locator('text=Family Law Questions')).toBeVisible();
  });

  test('Test Mobile Responsiveness', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // Test mobile navigation
    await page.click('[aria-label="Open menu"]');
    await expect(page.locator('.md\\:hidden')).toBeVisible();
    
    // Test mobile chat interface
    await page.goto('http://localhost:3000/chat');
    await expect(page.locator('input[placeholder*="legal question"]')).toBeVisible();
  });
});

// Export for MCP usage
module.exports = { test, expect };

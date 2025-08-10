import { test, expect } from '@playwright/test';

test.describe('LexiBot Document Processing Flow', () => {
  test('should test complete document upload and analysis flow', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    
    // Navigate to upload
    await page.click('text=/upload/i');
    await expect(page).toHaveURL(/upload/);
    
    // Check upload interface
    await expect(page.locator('input[type="file"]')).toBeVisible();
    
    // Look for Pakistani legal context
    const uploadContent = await page.textContent('body');
    expect(uploadContent?.toLowerCase()).toMatch(/(pakistan|legal|document|analysis)/);
    
    // Test the flow to chat (simulate successful upload)
    await page.goto('/chat?mode=document&vectorStoreId=test-123');
    
    // Should show document mode
    const chatContent = await page.textContent('body');
    expect(chatContent?.toLowerCase()).toMatch(/(document|upload|analysis)/);
  });

  test('should test legal help categories integration', async ({ page }) => {
    // Test legal help page
    await page.goto('/legal-help');
    
    // Should show Pakistani legal categories
    const categories = ['family', 'property', 'criminal', 'business', 'civil'];
    const content = await page.textContent('body');
    
    let foundCategories = 0;
    for (const category of categories) {
      if (content?.toLowerCase().includes(category)) {
        foundCategories++;
      }
    }
    
    expect(foundCategories).toBeGreaterThan(2);
    
    // Test category navigation
    const familyLaw = page.locator('text=/family.*law/i').first();
    if (await familyLaw.count() > 0) {
      await familyLaw.click();
      await expect(page).toHaveURL(/chat.*category=family/);
    }
  });

  test('should test language switching functionality', async ({ page }) => {
    // Test Urdu/English language support
    await page.goto('/chat?category=family&language=urdu');
    
    // Should show Urdu content
    await page.waitForLoadState('networkidle');
    const urduContent = await page.textContent('body');
    
    // Check for Urdu characters or language indicators
    const hasUrduContent = /[\u0600-\u06FF]/.test(urduContent || '');
    const hasUrduIndicator = urduContent?.includes('اردو') || urduContent?.includes('🇵🇰');
    
    if (hasUrduContent || hasUrduIndicator) {
      console.log('✅ Urdu language support detected');
    }
    
    // Test English mode
    await page.goto('/chat?category=family&language=english');
    await page.waitForLoadState('networkidle');
    
    const englishContent = await page.textContent('body');
    expect(englishContent?.toLowerCase()).toContain('family');
  });

  test('should test responsive design across devices', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1280, height: 720, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Test upload page on each viewport
      await page.goto('/upload');
      await page.waitForLoadState('networkidle');
      
      // Upload interface should be visible and usable
      await expect(page.locator('input[type="file"]')).toBeVisible();
      
      // Navigation should work
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();
      
      console.log(`✅ Upload page responsive on ${viewport.name}`);
    }
  });

  test('should test performance and loading', async ({ page }) => {
    // Test page load performance
    const startTime = Date.now();
    
    await page.goto('/upload');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (10 seconds for Vercel)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`✅ Upload page loaded in ${loadTime}ms`);
    
    // Test navigation performance
    const navStartTime = Date.now();
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
    const navTime = Date.now() - navStartTime;
    
    expect(navTime).toBeLessThan(8000);
    console.log(`✅ Navigation to chat in ${navTime}ms`);
  });

  test('should test accessibility features', async ({ page }) => {
    await page.goto('/upload');
    
    // Check for proper ARIA labels
    const fileInput = page.locator('input[type="file"]');
    const ariaLabel = await fileInput.getAttribute('aria-label');
    const hasLabel = ariaLabel || await fileInput.getAttribute('id');
    
    expect(hasLabel).toBeTruthy();
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test color contrast (basic check)
    const bodyStyles = await page.locator('body').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    expect(bodyStyles.backgroundColor).toBeTruthy();
    expect(bodyStyles.color).toBeTruthy();
    
    console.log('✅ Basic accessibility checks passed');
  });
});

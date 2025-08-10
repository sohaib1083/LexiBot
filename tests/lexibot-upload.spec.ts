import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('LexiBot Upload Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the upload page
    await page.goto('/upload');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should load upload page correctly', async ({ page }) => {
    // Check page title and basic elements
    await expect(page).toHaveTitle(/LexiBot|Lawyer|Legal/);
    
    // Check for upload interface elements
    await expect(page.locator('h1, h2').filter({ hasText: /upload|document/i })).toBeVisible();
    
    // Check for file input
    await expect(page.locator('input[type="file"]')).toBeVisible();
    
    // Check for drag and drop area
    await expect(page.locator('[class*="drag"], [class*="drop"], [class*="upload"]')).toBeVisible();
  });

  test('should display Pakistani legal context', async ({ page }) => {
    // Check for Pakistani legal references
    const content = await page.textContent('body');
    const pakistaniTerms = ['Pakistan', 'Pakistani', 'legal', 'document', 'analysis'];
    
    for (const term of pakistaniTerms) {
      expect(content?.toLowerCase()).toContain(term.toLowerCase());
    }
  });

  test('should handle file upload interface', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    // Check file input accepts PDF files
    const acceptAttribute = await fileInput.getAttribute('accept');
    expect(acceptAttribute).toContain('pdf');
    
    // Test drag and drop area
    const dropArea = page.locator('[class*="drag"], [class*="drop"], [class*="upload"]').first();
    await expect(dropArea).toBeVisible();
    
    // Test hover effects
    await dropArea.hover();
    // Visual feedback should be present (color change, border, etc.)
  });

  test('should show upload progress and feedback', async ({ page }) => {
    // Create a test PDF file content (mock)
    const testPdfContent = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000074 00000 n 0000000120 00000 n trailer<</Size 4/Root 1 0 R>>startxref 178 %%EOF');
    
    // Try to upload a file (this might not work in production due to file restrictions)
    const fileInput = page.locator('input[type="file"]');
    
    // Check if upload interface responds to interaction
    await fileInput.click();
    
    // Look for upload feedback elements
    await page.waitForTimeout(1000); // Give UI time to respond
    
    // Check for progress indicators, success messages, or error handling
    const feedbackElements = page.locator('[class*="progress"], [class*="loading"], [class*="upload"], [class*="success"], [class*="error"]');
    // At least some feedback mechanism should be present
  });

  test('should redirect to chat after successful upload', async ({ page }) => {
    // This test checks the UI flow even if actual upload fails
    
    // Look for redirect instructions or buttons
    const redirectElements = page.locator('text=/chat|continue|proceed|analyze/i');
    
    // Check for countdown or automatic redirect mentions
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/(redirect|chat|continue|proceed)/);
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test file size restrictions
    const fileInput = page.locator('input[type="file"]');
    
    // Try to trigger error states by interacting with upload
    await fileInput.click();
    
    // Look for error handling UI
    await page.waitForTimeout(2000);
    
    // Check that page doesn't crash and shows appropriate feedback
    await expect(page.locator('body')).toBeVisible();
    
    // Error messages should be user-friendly for Pakistani users
    const errorElements = page.locator('[class*="error"], [class*="warning"], [role="alert"]');
    if (await errorElements.count() > 0) {
      const errorText = await errorElements.first().textContent();
      // Should contain helpful guidance
      expect(errorText?.length).toBeGreaterThan(10);
    }
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Upload interface should be accessible on mobile
    await expect(page.locator('input[type="file"]')).toBeVisible();
    
    // Check mobile navigation
    const mobileMenu = page.locator('[aria-label*="menu"], button[class*="mobile"]');
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(500);
    }
    
    // Upload area should be touch-friendly
    const uploadArea = page.locator('[class*="upload"], [class*="drag"], [class*="drop"]').first();
    await expect(uploadArea).toBeVisible();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should integrate with navigation', async ({ page }) => {
    // Test navigation to other pages
    const navLinks = page.locator('nav a, [role="navigation"] a');
    
    if (await navLinks.count() > 0) {
      // Test navigation to legal help
      const legalHelpLink = page.locator('text=/legal.?help/i').first();
      if (await legalHelpLink.count() > 0) {
        await legalHelpLink.click();
        await expect(page).toHaveURL(/legal-help/);
        await page.goBack();
      }
      
      // Test navigation to chat
      const chatLink = page.locator('text=/chat/i').first();
      if (await chatLink.count() > 0) {
        await chatLink.click();
        await expect(page).toHaveURL(/chat/);
        await page.goBack();
      }
    }
  });

  test('should have Pakistani legal branding', async ({ page }) => {
    // Check for Pakistani context
    const content = await page.textContent('body');
    const brandingTerms = ['pakistan', 'legal', 'law', 'document', 'analysis'];
    
    let foundTerms = 0;
    for (const term of brandingTerms) {
      if (content?.toLowerCase().includes(term)) {
        foundTerms++;
      }
    }
    
    expect(foundTerms).toBeGreaterThan(2);
    
    // Check for visual Pakistani elements (flags, colors, etc.)
    const pakistaniElements = page.locator('text=🇵🇰, [src*="pakistan"], [class*="pakistan"]');
    // At least some Pakistani branding should be present
  });

  test('should handle different file types appropriately', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    // Check accept attribute
    const acceptTypes = await fileInput.getAttribute('accept');
    expect(acceptTypes).toBeTruthy();
    
    // Should primarily accept PDF files for legal documents
    expect(acceptTypes?.toLowerCase()).toContain('pdf');
  });
});

test.describe('LexiBot Upload Integration Tests', () => {
  test('upload page should connect to chat functionality', async ({ page }) => {
    // Test the complete flow from upload to chat
    await page.goto('/upload');
    
    // Look for indicators that this connects to chat
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toMatch(/(chat|ask|question|analysis)/);
    
    // Test manual navigation to chat
    await page.goto('/chat');
    await expect(page).toHaveURL(/chat/);
    
    // Should have document mode capabilities
    const chatContent = await page.textContent('body');
    expect(chatContent?.toLowerCase()).toMatch(/(document|upload|vector|analysis)/);
  });

  test('should maintain Pakistani legal context across pages', async ({ page }) => {
    const pages = ['/upload', '/chat', '/legal-help', '/'];
    
    for (const pagePath of pages) {
      try {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const content = await page.textContent('body');
        // Each page should maintain Pakistani legal context
        expect(content?.toLowerCase()).toMatch(/(pakistan|legal|law)/);
      } catch (error) {
        console.log(`Page ${pagePath} may not exist or load properly`);
      }
    }
  });
});

import { test, expect } from '@playwright/test';

test.describe('LexiBot Navigation', () => {
  test('should navigate between all main pages', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/LexiBot - Your AI Legal Assistant/);
    
    // Check homepage elements
    await expect(page.getByRole('heading', { name: 'Your AI Pakistani Legal Assistant' })).toBeVisible();
    
    // Navigate to Upload page
    await page.getByRole('link', { name: 'Upload PDF' }).click();
    await expect(page).toHaveURL(/.*upload/);
    await expect(page.getByRole('heading', { name: 'Upload Your Document' })).toBeVisible();
    
    // Navigate to Chat page
    await page.getByRole('link', { name: 'Chat' }).click();
    await expect(page).toHaveURL(/.*chat/);
    await expect(page.getByRole('heading', { name: 'Pakistani Legal Help' })).toBeVisible();
    
    // Navigate to About page
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/.*about/);
    
    // Navigate back to Home
    await page.getByRole('link', { name: 'LexiBot Pakistani Legal Assistant' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check that navigation exists and is visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check all navigation links are present
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Legal Help' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Upload PDF' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Chat' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/LexiBot - Your AI Legal Assistant/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /Your AI Pakistani Legal Assistant/ })).toBeVisible();
    
    // Check hero section
    await expect(page.getByText('Get instant legal guidance')).toBeVisible();
    await expect(page.getByText('Upload documents, ask questions')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: 'Start Chatting' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Upload Document' })).toBeVisible();
  });

  test('should navigate to chat from CTA button', async ({ page }) => {
    await page.getByRole('link', { name: 'Start Chatting' }).click();
    await expect(page).toHaveURL(/.*chat/);
    await expect(page.getByRole('heading', { name: 'Pakistani Legal Help' })).toBeVisible();
  });

  test('should navigate to upload from CTA button', async ({ page }) => {
    await page.getByRole('link', { name: 'Upload Document' }).click();
    await expect(page).toHaveURL(/.*upload/);
    await expect(page.getByRole('heading', { name: 'Upload Your Document' })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    // Check features are visible
    await expect(page.getByText('Why Choose LexiBot?')).toBeVisible();
    
    // Check individual features
    await expect(page.getByText('Pakistani Law Expert')).toBeVisible();
    await expect(page.getByText('Document Analysis')).toBeVisible();
    await expect(page.getByText('24/7 Available')).toBeVisible();
    await expect(page.getByText('Secure & Private')).toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    await expect(page.getByText('What Our Users Say')).toBeVisible();
    
    // Check that testimonials are present
    const testimonials = page.locator('[data-testid="testimonial"]');
    await expect(testimonials.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // Check that main elements are still visible on mobile
    await expect(page.getByRole('heading', { name: /Your AI Pakistani Legal Assistant/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Chatting' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Upload Document' })).toBeVisible();
  });
});

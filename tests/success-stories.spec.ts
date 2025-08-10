import { test, expect } from '@playwright/test';

test.describe('Homepage Success Stories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display success stories section', async ({ page }) => {
    // Check success stories section exists
    await expect(page.getByRole('heading', { name: 'Real Success Stories' })).toBeVisible();
    
    // Check that all three success stories are present
    await expect(page.getByText('Contract Dispute Resolved')).toBeVisible();
    await expect(page.getByText('Property Rights Clarified')).toBeVisible(); 
    await expect(page.getByText('Employment Rights Protected')).toBeVisible();
    
    // Check categories are displayed
    await expect(page.getByText('Business Law')).toBeVisible();
    await expect(page.getByText('Property Law')).toBeVisible();
    await expect(page.getByText('Employment Law')).toBeVisible();
    
    // Check savings information
    await expect(page.getByText('₨2,00,000 Saved')).toBeVisible();
    await expect(page.getByText('Legal Fees Avoided')).toBeVisible();
    await expect(page.getByText('Fair Settlement')).toBeVisible();
  });

  test('should have working CTA in success stories section', async ({ page }) => {
    // Check the success stories CTA button
    const ctaButton = page.getByRole('link', { name: 'Start Your Success Story' });
    await expect(ctaButton).toBeVisible();
    
    // Click and verify navigation
    await ctaButton.click();
    await expect(page).toHaveURL(/.*upload/);
    await expect(page.getByRole('heading', { name: 'Upload Your Document' })).toBeVisible();
  });

  test('should have hover effects on success story cards', async ({ page }) => {
    // Test hover interactions (check if cards are interactive)
    const firstCard = page.locator('text=Contract Dispute Resolved').locator('..');
    await expect(firstCard).toBeVisible();
    
    // Check that the card has hover-responsive classes
    await expect(firstCard).toHaveClass(/hover:scale-105/);
  });

  test('should display testimonials with data-testid', async ({ page }) => {
    // Check that testimonials have the data-testid we added
    const testimonials = page.locator('[data-testid="testimonial"]');
    await expect(testimonials.first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Upload Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/upload');
  });

  test('should display upload page correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/LexiBot - Your AI Legal Assistant/);
    await expect(page.getByRole('heading', { name: 'Upload Your Document' })).toBeVisible();
    
    // Check security features are displayed
    await expect(page.getByText('Encrypted')).toBeVisible();
    await expect(page.getByText('Auto-Delete')).toBeVisible();
    await expect(page.getByText('PDF Only')).toBeVisible();
    
    // Check upload area
    await expect(page.getByText('Drag & drop your PDF')).toBeVisible();
    await expect(page.getByText('Choose PDF File')).toBeVisible();
  });

  test('should open file chooser when clicking upload button', async ({ page }) => {
    // Set up file chooser listener
    const fileChooserPromise = page.waitForEvent('filechooser');
    
    // Click the choose file button
    await page.getByText('Choose PDF File').click();
    
    // Verify file chooser opened
    const fileChooser = await fileChooserPromise;
    expect(fileChooser).toBeTruthy();
  });

  test('should display workflow steps', async ({ page }) => {
    await expect(page.getByText('What happens next?')).toBeVisible();
    await expect(page.getByText('1. Your PDF is securely processed')).toBeVisible();
    await expect(page.getByText('2. We create a searchable knowledge base')).toBeVisible();
    await expect(page.getByText('3. You can then chat with our AI')).toBeVisible();
    await expect(page.getByText('4. Your file is automatically deleted')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // Check that upload area is still visible and functional on mobile
    await expect(page.getByText('Drag & drop your PDF')).toBeVisible();
    await expect(page.getByText('Choose PDF File')).toBeVisible();
    
    // Check that security features are still visible
    await expect(page.getByText('Encrypted')).toBeVisible();
    await expect(page.getByText('Auto-Delete')).toBeVisible();
    await expect(page.getByText('PDF Only')).toBeVisible();
  });
});

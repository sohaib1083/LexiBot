import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('should display chat interface correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/LexiBot - Your AI Legal Assistant/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Pakistani Legal Help' })).toBeVisible();
    
    // Check language indicator
    await expect(page.getByText('🇺🇸 English')).toBeVisible();
    
    // Check description text
    await expect(page.getByText('Ask any Pakistani legal question or upload a document')).toBeVisible();
    
    // Check input area
    const input = page.getByRole('textbox', { name: /Ask any Pakistani legal question/ });
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
    
    // Check send button (should be disabled initially)
    const sendButton = page.getByRole('button', { name: 'Send' });
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeDisabled();
  });

  test('should enable send button when text is entered', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Ask any Pakistani legal question/ });
    const sendButton = page.getByRole('button', { name: 'Send' });
    
    // Initially disabled
    await expect(sendButton).toBeDisabled();
    
    // Type some text
    await input.fill('What are tenant rights in Pakistan?');
    
    // Should now be enabled
    await expect(sendButton).toBeEnabled();
    
    // Clear text
    await input.clear();
    
    // Should be disabled again
    await expect(sendButton).toBeDisabled();
  });

  test('should display sidebar with chat options', async ({ page }) => {
    // Check sidebar title
    await expect(page.getByText('LexiBot Chats')).toBeVisible();
    
    // Check chat mode buttons
    await expect(page.getByRole('button', { name: 'Legal Help' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Document' })).toBeVisible();
    
    // Check new chat button
    await expect(page.getByRole('button', { name: 'New Legal Chat' })).toBeVisible();
    
    // Check empty state message
    await expect(page.getByText('No chat sessions yet')).toBeVisible();
    await expect(page.getByText('Start a new chat to begin')).toBeVisible();
  });

  test('should handle keyboard interactions', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Ask any Pakistani legal question/ });
    
    // Focus the input
    await input.focus();
    await expect(input).toBeFocused();
    
    // Type a question
    await input.type('What is the process for property registration in Pakistan?');
    
    // Check that text was entered
    await expect(input).toHaveValue('What is the process for property registration in Pakistan?');
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // Check that main elements are still visible on mobile
    await expect(page.getByRole('heading', { name: 'Pakistani Legal Help' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /Ask any Pakistani legal question/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });
});

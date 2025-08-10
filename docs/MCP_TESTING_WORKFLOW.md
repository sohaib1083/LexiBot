# LexiBot MCP Testing Workflow

This document outlines the complete workflow for using Model Context Protocol (MCP) with Playwright for automated testing and preview deployment validation.

## 🎯 Workflow Overview

### 1. **Preview per PR** 
- Vercel automatically deploys preview URLs for each PR
- GitHub Actions creates a preview environment
- PR comments include direct links to preview URLs

### 2. **Interactive Test Development with MCP**
- Use Playwright MCP in VS Code to explore flows interactively
- Generate/update tests through AI assistance
- Real-time browser automation and test scaffolding

### 3. **Automated CI/CD Testing**
- GitHub Actions runs headless Playwright tests
- Tests run against preview URLs
- Coverage and performance gates block merge if thresholds fail

## 🛠️ Setup Instructions

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Install VS Code MCP extension (if not already installed)
```

### MCP Configuration

1. **VS Code Settings** (`.vscode/settings.json`):
```json
{
  "mcp.client.npmExecutionPolicy": "allowed",
  "mcp.client.serverConfig": "/path/to/.vscode/mcp.json"
}
```

2. **MCP Server Config** (`.vscode/mcp.json`):
```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "github": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Environment Variables

Required GitHub Secrets:
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID  
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `GITHUB_PERSONAL_ACCESS_TOKEN` - For GitHub MCP integration

## 🎭 Using Playwright MCP

### Interactive Test Development

1. **Start MCP Session**:
```bash
npm run test:mcp
```

2. **Use Copilot with MCP**:
   - Ask Copilot to navigate to specific pages
   - Test user interactions in real-time
   - Generate test assertions based on live exploration
   - Update existing tests when UI changes

3. **Example MCP Commands**:
```typescript
// Navigate and test upload flow
await page.goto('/upload');
await page.getByText('Choose PDF File').click();
await expect(fileChooser).toBeTruthy();

// Test chat functionality  
await page.goto('/chat');
await page.getByRole('textbox').fill('What are tenant rights?');
await expect(page.getByRole('button', { name: 'Send' })).toBeEnabled();
```

### Test Generation Workflow

1. **Explore with MCP**: Use browser automation to understand user flows
2. **Generate Tests**: Ask Copilot to create test cases based on exploration
3. **Validate**: Run tests against live preview URLs
4. **Commit**: Include generated tests in your PR

## 🚀 GitHub Actions Workflow

### Automatic Preview Deployment

```yaml
# .github/workflows/pr-preview-and-test.yml
jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Comment PR with Preview URL
        uses: actions/github-script@v7
        # Posts preview URL to PR comments
```

### E2E Testing Pipeline

```yaml
e2e-tests:
  needs: deploy-preview
  runs-on: ubuntu-latest
  steps:
    - name: Run Playwright tests
      env:
        PLAYWRIGHT_BASE_URL: ${{ needs.deploy-preview.outputs.preview-url }}
      run: npx playwright test
```

### Merge Gate Protection

```yaml
merge-gate:
  needs: [deploy-preview, e2e-tests, lighthouse-audit]
  steps:
    - name: Check all tests passed
      run: |
        if [[ "${{ needs.e2e-tests.result }}" != "success" ]]; then
          echo "❌ E2E tests failed - blocking merge"
          exit 1
        fi
```

## 📋 Test Structure

### Test Categories

1. **Navigation Tests** (`tests/navigation.spec.ts`)
   - Page-to-page navigation
   - Responsive navigation
   - URL validation

2. **Upload Tests** (`tests/upload.spec.ts`)
   - File upload interface
   - Drag & drop functionality
   - Error handling

3. **Chat Tests** (`tests/chat.spec.ts`)
   - Input/output functionality
   - Button state management
   - Pakistani legal context

4. **Integration Tests** (`tests/lexibot-integration.spec.ts`)
   - End-to-end user flows
   - Cross-page functionality
   - Performance validation

### Test Configuration

**Playwright Config** (`playwright.config.ts`):
```typescript
export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://lexi-botai.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## 🎯 Testing Best Practices

### MCP-Driven Test Development

1. **Explore First**: Use MCP to navigate and understand user flows
2. **Generate Assertions**: Let AI create test assertions based on real interactions
3. **Validate Continuously**: Run tests against preview URLs during development
4. **Update Iteratively**: Use MCP to update tests when UI changes

### Test Scenarios to Cover

✅ **Core Functionality**:
- Upload PDF workflow
- Chat interface interactions
- Navigation between pages
- Form submissions

✅ **Pakistani Legal Context**:
- Legal terminology display
- Urdu/English language switching
- Pakistani law-specific features
- Currency and date formats

✅ **Responsive Design**:
- Mobile device testing
- Tablet viewport validation
- Desktop responsiveness
- Touch interaction support

✅ **Performance & Accessibility**:
- Page load times
- Lighthouse audit scores
- WCAG compliance
- Keyboard navigation

## 🔧 Available Scripts

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Generate test report
npm run test:report

# Run MCP test generator
npm run test:mcp

# Run tests against preview URL
npm run test:preview https://preview-url.vercel.app

# CI-specific test run
npm run e2e:ci
```

## 🎨 Integration Examples

### PR Comment Automation

```yaml
- name: Comment PR with Test Results
  uses: actions/github-script@v7
  with:
    script: |
      const comment = `✅ **E2E Test Results: All tests passed!**
      
      📊 **Test Summary:**
      - Preview URL: ${{ needs.deploy-preview.outputs.preview-url }}
      - Tests: 35 passed, 0 failed
      
      📋 **Tested Features:**
      - ✅ Navigation between pages
      - ✅ Upload page functionality  
      - ✅ Chat interface
      - ✅ File upload modal
      - ✅ Responsive design`;
```

### Lighthouse Integration

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      ${{ needs.deploy-preview.outputs.preview-url }}
      ${{ needs.deploy-preview.outputs.preview-url }}/upload
      ${{ needs.deploy-preview.outputs.preview-url }}/chat
```

## 🎯 Success Metrics

- **Test Coverage**: >90% of user flows covered
- **Performance**: Lighthouse scores >80 for all categories  
- **Accessibility**: WCAG AA compliance
- **Cross-browser**: Chrome, Firefox, Safari, Mobile devices
- **Response Time**: Average test execution <2 minutes

## 🚨 Troubleshooting

### Common Issues

1. **Browser Installation**:
```bash
npx playwright install --with-deps
```

2. **MCP Connection Issues**:
   - Restart VS Code
   - Check MCP server configuration
   - Verify npm execution policy

3. **Test Failures on CI**:
   - Check preview URL accessibility
   - Validate environment variables
   - Review test selectors for UI changes

### Debug Commands

```bash
# Debug specific test
npx playwright test --debug tests/upload.spec.ts

# Generate test code
npx playwright codegen https://lexi-botai.vercel.app

# View test trace
npx playwright show-trace trace.zip
```

---

## 🎉 Results

This workflow provides:
- **Automated Preview Deployments** for every PR
- **Interactive Test Development** with MCP and AI assistance  
- **Comprehensive CI/CD Pipeline** with merge gates
- **Real-time Feedback** through PR comments
- **Performance Monitoring** with Lighthouse integration
- **Cross-browser Validation** across devices and browsers

The combination of MCP for interactive test development and GitHub Actions for automated validation creates a robust testing pipeline that catches issues early while maintaining development velocity.

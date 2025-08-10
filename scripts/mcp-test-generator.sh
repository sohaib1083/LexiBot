#!/bin/bash

# LexiBot MCP Test Generator
# This script uses Playwright MCP to explore the live site and generate/update tests

echo "🎭 LexiBot MCP Test Generator"
echo "=============================="

# Check if preview URL is provided
PREVIEW_URL=${1:-"https://lexi-botai.vercel.app"}
echo "📍 Testing URL: $PREVIEW_URL"

# Export the base URL for Playwright
export PLAYWRIGHT_BASE_URL="$PREVIEW_URL"

echo ""
echo "🔧 Starting MCP exploration..."
echo "This will:"
echo "1. Navigate through all pages"
echo "2. Test user interactions"
echo "3. Generate test snapshots"
echo "4. Update test files if needed"

echo ""
echo "🚀 Use Copilot with MCP to:"
echo "- Explore user flows interactively"
echo "- Generate new test cases"
echo "- Update existing tests based on UI changes"
echo "- Validate accessibility and performance"

echo ""
echo "💡 Example MCP commands:"
echo "- Navigate to upload page and test file selection"
echo "- Test chat input and send button states"
echo "- Verify responsive design on mobile viewports"
echo "- Check page load performance"

echo ""
echo "🔗 Key testing areas:"
echo "✅ Navigation between pages"
echo "✅ Upload functionality"
echo "✅ Chat interface"
echo "✅ Form interactions"
echo "✅ Mobile responsiveness"
echo "✅ Accessibility compliance"
echo "✅ Performance metrics"

# Run the actual tests
echo ""
echo "🧪 Running existing tests..."
npx playwright test --reporter=html

echo ""
echo "📊 Test report generated: playwright-report/index.html"
echo "🎯 Open VS Code and use @playwright MCP to explore flows"

#!/bin/bash

# LexiBot MCP Workflow Setup Script
echo "🎭 Setting up LexiBot MCP Testing Workflow"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if project is LexiBot
if ! grep -q "lexibot" package.json; then
    echo "❌ Error: This doesn't appear to be the LexiBot project"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

echo "🔧 Setting up MCP configuration..."

# Create .vscode directory if it doesn't exist
mkdir -p .vscode

# Check if MCP config already exists
if [ -f ".vscode/mcp.json" ]; then
    echo "✅ MCP configuration already exists"
else
    echo "⚙️  Creating MCP configuration..."
    cat > .vscode/mcp.json << 'EOF'
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
				"GITHUB_PERSONAL_ACCESS_TOKEN": ""
			}
		}
	}
}
EOF
fi

# Update VS Code settings
echo "⚙️  Updating VS Code settings..."
if [ -f ".vscode/settings.json" ]; then
    # Backup existing settings
    cp .vscode/settings.json .vscode/settings.json.backup
    echo "📋 Backed up existing settings to .vscode/settings.json.backup"
fi

# Add MCP settings to VS Code config
cat > .vscode/settings.json << 'EOF'
{
    "github.copilot.chat.codesearch.enabled": true,
    "github.copilot.chat.reviewSelection.instructions": [],
    "github.copilot.chat.completionContext.typescript.mode": "on",
    "github.copilot.chat.editor.temporalContext.enabled": true,
    "github.copilot.chat.edits.temporalContext.enabled": true,
    "github.copilot.chat.languageContext.fix.typescript.enabled": true,
    "github.copilot.chat.languageContext.inline.typescript.enabled": true,
    "github.copilot.chat.generateTests.codeLens": true,
    "github.copilot.chat.languageContext.typescript.enabled": true,
    "github.copilot.chat.notebook.followCellExecution.enabled": true,
    "mcp.client.npmExecutionPolicy": "allowed",
    "mcp.client.serverConfig": "$(workspaceFolder)/.vscode/mcp.json"
}
EOF

echo "🧪 Running initial test to verify setup..."
npm run test:mcp &
TEST_PID=$!

# Wait a few seconds then kill the test process
sleep 10
kill $TEST_PID 2>/dev/null || true

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🎯 Next Steps:"
echo "1. Set up GitHub secrets for deployment:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID" 
echo "   - VERCEL_PROJECT_ID"
echo "   - GITHUB_PERSONAL_ACCESS_TOKEN"
echo ""
echo "2. Add GitHub personal access token to .vscode/mcp.json"
echo ""
echo "3. Test the MCP workflow:"
echo "   npm run test:mcp"
echo ""
echo "4. Use Copilot with @playwright to:"
echo "   - Navigate to pages interactively"
echo "   - Generate test cases"
echo "   - Update existing tests"
echo ""
echo "5. Create a PR to see the full workflow in action!"
echo ""
echo "📚 Documentation: docs/MCP_TESTING_WORKFLOW.md"
echo "🎭 Happy testing with MCP!"

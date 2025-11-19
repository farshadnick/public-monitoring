#!/bin/bash

echo "🔧 Setting up URL Monitoring System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the web application:"
echo "   npm run dev"
echo ""
echo "🐳 To start monitoring services (after adding URLs):"
echo "   chmod +x scripts/start-monitoring.sh"
echo "   ./scripts/start-monitoring.sh"
echo ""
echo "📖 Read README.md for more information."


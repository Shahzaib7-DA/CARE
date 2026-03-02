#!/bin/bash

# CareMind Frontend - Quick Install Script

echo "🏥 CareMind Frontend - Installation Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
fi

echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm run dev     - Start development server"
echo "  2. Open http://localhost:5173 in your browser"
echo ""
echo "Other commands:"
echo "  npm run build      - Build for production"
echo "  npm run preview    - Preview production build"
echo "  npm run lint       - Run linter"
echo ""
echo "Happy coding! 💻"

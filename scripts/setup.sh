#!/bin/bash

# Imoya Flow Setup Script
echo "🌬️  Setting up Imoya Flow..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Node.js version is 20+
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ pnpm $(pnpm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Starting PostgreSQL with Docker..."
    docker compose up -d
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 5
else
    echo "⚠️  Docker not found. Please make sure PostgreSQL is running locally."
fi

# Setup environment
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Created .env file from template. Please update with your settings."
fi

# Setup database
echo "🗄️  Setting up database..."
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma:seed

echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  pnpm dev"
echo ""
echo "This will start:"
echo "  - Backend API on http://localhost:4000"
echo "  - Frontend app on http://localhost:3000"
echo ""
echo "Happy coding! 🚀"

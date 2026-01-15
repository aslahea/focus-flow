#!/bin/bash

# FocusFlow Microservices Setup Script

echo "🚀 FocusFlow Microservices Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend || exit
npm install
echo "✅ Backend dependencies installed"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend || exit
npm install
echo "✅ Frontend dependencies installed"

# Back to root
cd ..

echo ""
echo "✨ Setup Complete!"
echo ""
echo "To start development:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""

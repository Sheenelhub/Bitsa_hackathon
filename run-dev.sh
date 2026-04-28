#!/bin/bash

# BITSA Club Development Script
# This script ensures Node.js 20 is used and starts the development servers

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Check Node version
echo "Using Node.js $(node --version)"
echo ""

# Check if MongoDB URI is set
if [ -f "backend/.env" ]; then
    echo "✓ Backend .env file found"
else
    echo "❌ Backend .env file not found!"
    exit 1
fi

if [ -f ".env.local" ]; then
    echo "✓ Frontend .env.local file found"
else
    echo "❌ Frontend .env.local file not found!"
    exit 1
fi

echo ""
echo "🚀 Starting BITSA Club..."
echo ""
echo "To run both servers:"
echo "  1. Terminal 1: cd backend && npm run dev"
echo "  2. Terminal 2: npm run dev"
echo ""
echo "Or use the start script: ./start.sh"
echo ""

# Option to auto-start (uncomment to enable)
# echo "Starting backend..."
# cd backend && npm run dev &
# sleep 3
# cd ..
# echo "Starting frontend..."
# npm run dev


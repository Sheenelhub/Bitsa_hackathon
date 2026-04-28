#!/bin/bash

# BITSA Club Startup Script

echo "🚀 Starting BITSA Club..."

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB found"
else
    echo "⚠️  MongoDB not found in PATH"
    echo "   Make sure MongoDB is installed and running, or use MongoDB Atlas"
fi

# Check if .env files exist
if [ -f "backend/.env" ]; then
    echo "✓ Backend .env file exists"
else
    echo "❌ Backend .env file not found!"
    echo "   Please create backend/.env file"
    exit 1
fi

if [ -f ".env.local" ]; then
    echo "✓ Frontend .env.local file exists"
else
    echo "❌ Frontend .env.local file not found!"
    echo "   Please create .env.local file"
    exit 1
fi

echo ""
echo "📦 Starting backend server..."
echo "   Backend will run on http://localhost:5000"
echo ""
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

echo ""
echo "🌐 Starting frontend server..."
echo "   Frontend will run on http://localhost:3000"
echo ""
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ BITSA Club is starting!"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "   Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID


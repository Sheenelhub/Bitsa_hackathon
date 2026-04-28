#!/bin/bash

# Load nvm and use Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Verify Node version
echo "Using Node.js $(node --version)"
echo ""

# Run the dev command
npm run dev


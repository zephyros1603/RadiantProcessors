#!/bin/bash

# Navigate to the frontend directory
cd /Users/sanjanathyady/Desktop/AiBB/frontend

# Check if we're in the correct directory by looking for package.json
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in current directory"
    exit 1
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the development server
echo "Starting development server..."
npm run dev
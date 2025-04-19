#!/bin/bash

# Navigate to the HTTP traffic server directory
cd /Users/sanjanathyady/Desktop/AiBB/Backend/httptraffic

# Check if we're in the correct directory
if [ ! -f "server.js" ]; then
    echo "Error: server.js not found in current directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the HTTP traffic server
echo "Starting HTTP traffic server..."
node server.js
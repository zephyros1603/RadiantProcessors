#!/bin/bash

# Navigate to the correct directory
cd /Users/sanjanathyady/Desktop/AiBB/Backend/terminal

# Check if we're in the correct directory
if [ ! -f "server.js" ]; then
    echo "Error: server.js not found in current directory"
    exit 1
fi

# Run the Node.js server
echo "Starting Node.js server..."
node server.js
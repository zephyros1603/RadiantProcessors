#!/bin/bash

# Store the base directory
BASE_DIR="/Users/sanjanathyady/Desktop/AiBB"

# Function to make scripts executable
make_executable() {
    chmod +x "$1"
}

# Make all scripts executable
make_executable "$BASE_DIR/terminal.sh"
make_executable "$BASE_DIR/frontend.sh"
make_executable "$BASE_DIR/rag.sh"
make_executable "$BASE_DIR/http.sh"

# Open new terminal windows and run each script
osascript -e '
tell application "Terminal"
    # First terminal for backend server
    do script "cd '"$BASE_DIR"' && ./terminal.sh"
    
    # Second terminal for frontend
    delay 2
    do script "cd '"$BASE_DIR"' && ./frontend.sh"
    
    # Third terminal for RAG server
    delay 2
    do script "cd '"$BASE_DIR"' && ./rag.sh"
    
    # Fourth terminal for HTTP traffic server
    delay 2
    do script "cd '"$BASE_DIR"' && ./http.sh"
    
    activate
end tell'
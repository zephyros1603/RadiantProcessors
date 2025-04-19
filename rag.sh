#!/bin/bash

# Navigate to the RAG directory
cd /Users/sanjanathyady/Desktop/AiBB/Backend/RAG

# Check if we're in the correct directory
if [ ! -f "groqNote.py" ]; then
    echo "Error: note.py not found in current directory"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found. Please create one first."
    echo "Run: python3 -m venv venv"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Run the Python script
echo "Starting RAG server..."
python3 groqNote.py
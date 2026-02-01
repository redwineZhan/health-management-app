#!/bin/bash

echo "Setting up Health Management App..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create client directory if it doesn't exist and install frontend dependencies
if [ ! -d "client" ]; then
    mkdir client
fi

cd client

# Check if package.json exists in client directory
if [ ! -f "package.json" ]; then
    echo "Initializing client package.json..."
    npm init -y
    # Set the necessary dependencies in package.json
    npm install react react-dom react-router-dom redux react-redux @reduxjs/toolkit axios chart.js react-chartjs-2
    npm install -D react-scripts
fi

echo "Installing frontend dependencies..."
npm install

echo "Setup complete!"
echo "To start the application:"
echo "1. Make sure PostgreSQL is running"
echo "2. Run 'npm run dev' in the root directory for backend"
echo "3. Run 'npm start' in the client directory for frontend"
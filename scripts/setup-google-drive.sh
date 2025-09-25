#!/bin/bash

# Google Drive Setup Script for BuffrLend
# This script helps set up Google Drive integration by copying template files

echo "🚀 Setting up Google Drive integration for BuffrLend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create credentials.json from template if it doesn't exist
if [ ! -f "credentials.json" ]; then
    if [ -f "credentials.json.template" ]; then
        cp credentials.json.template credentials.json
        echo "✅ Created credentials.json from template"
        echo "⚠️  Please update credentials.json with your actual Google service account credentials"
    else
        echo "❌ Error: credentials.json.template not found"
        exit 1
    fi
else
    echo "ℹ️  credentials.json already exists, skipping..."
fi

# Create token.json from template if it doesn't exist
if [ ! -f "token.json" ]; then
    if [ -f "token.json.template" ]; then
        cp token.json.template token.json
        echo "✅ Created token.json from template"
        echo "⚠️  Please update token.json with your actual OAuth2 tokens (if using OAuth2)"
    else
        echo "❌ Error: token.json.template not found"
        exit 1
    fi
else
    echo "ℹ️  token.json already exists, skipping..."
fi

# Create .env.local from template if it doesn't exist
if [ ! -f ".env.local" ]; then
    if [ -f "env.template" ]; then
        cp env.template .env.local
        echo "✅ Created .env.local from template"
        echo "⚠️  Please update .env.local with your actual environment variables"
    else
        echo "❌ Error: env.template not found"
        exit 1
    fi
else
    echo "ℹ️  .env.local already exists, skipping..."
fi

echo ""
echo "🎉 Google Drive setup completed!"
echo ""
echo "Next steps:"
echo "1. Update credentials.json with your Google service account credentials"
echo "2. Update .env.local with your Google Drive folder IDs and other configuration"
echo "3. If using OAuth2, update token.json with your OAuth2 tokens"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed setup instructions, see GOOGLE_DRIVE_SETUP.md"

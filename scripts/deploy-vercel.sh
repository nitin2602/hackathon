#!/bin/bash

echo "🚀 Deploying EcoCreds to Vercel..."

# Build the client
echo "📦 Building client..."
npm run build:client

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app should be available at the provided URL"

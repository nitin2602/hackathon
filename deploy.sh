#!/bin/bash

echo "🚀 Deploying EcoCreds Frontend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project locally to test
echo "🔨 Testing build locally..."
npm run build:client

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    echo "✅ Deployment complete!"
    echo "🔗 Your app is now live on Vercel"
else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

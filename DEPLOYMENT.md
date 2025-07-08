# Frontend-Only Deployment to Vercel

This guide will help you deploy just the React frontend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Push your code to GitHub
3. **Node.js**: Ensure you have Node.js installed

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:

   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your project

3. **Configure Build Settings**:

   - **Framework Preset**: Other
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `npm install`

4. **Deploy**: Click "Deploy" and wait for the build to complete

### Method 2: Deploy via CLI

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   # First deployment (setup)
   vercel

   # Production deployment
   vercel --prod
   ```

## Configuration Notes

### Build Process

- The build process only builds the React client (`npm run build:client`)
- Output goes to `dist/spa` directory
- All routes are handled by the React Router (SPA mode)

### API Integration

Since this is frontend-only, your app will use:

- **Local Development**: Mock data and localStorage
- **Production**: External APIs or mock data

### Environment Variables

For frontend-only deployment, you may want to set:

- `VITE_API_BASE_URL`: If connecting to external APIs
- `VITE_ENV`: To distinguish frontend-only mode

### Routing

- React Router handles all client-side routing
- All routes fallback to `index.html` (SPA behavior)
- No server-side rendering

## Post-Deployment

### Testing Your Deployment

1. Visit your Vercel URL
2. Test all routes (Home, Products, Cart, etc.)
3. Verify localStorage functionality
4. Check that all features work without backend

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Analytics & Monitoring

- Vercel provides built-in analytics
- Check Performance and Real Experience Score
- Monitor build logs for any issues

## Troubleshooting

### Common Issues

1. **Build Fails**:

   ```bash
   # Test build locally first
   npm run build:client
   ```

2. **Routes Don't Work**:

   - Ensure `vercel.json` has the catch-all route
   - Check React Router configuration

3. **Assets Not Loading**:
   - Verify `dist/spa` contains all assets
   - Check public folder is being copied

### Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/help

## Example vercel.json

```json
{
  "version": 2,
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist/spa",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

Your EcoCreds app will be deployed as a fast, modern SPA! 🚀

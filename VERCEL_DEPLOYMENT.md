# Deploying EcoCreds Frontend to Vercel

This guide explains how to deploy the EcoCreds frontend to Vercel as a static single-page application (SPA).

## Quick Deployment

### Option 1: Using Vercel CLI

1. Install Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

## Configuration

The project includes a `vercel.json` file that:

- Builds only the frontend using `npm run build:client`
- Serves files from the `dist/spa` directory
- Handles client-side routing by redirecting all routes to `index.html`

## Demo Features

The deployed app includes:

- **Demo Authentication**: Works without a backend using localStorage
- **Demo Users**:
  - Email: `alex@example.com`, Password: `password`
  - Email: `demo@example.com`, Password: `demo`
- **Offline Support**: All features work without API connectivity
- **Local Storage**: User data and activities are saved locally

## Build Commands

- `npm run build:client` - Build frontend for production
- `npm run dev` - Development server (includes backend)

## Troubleshooting

### Blank Page Issues

- Ensure you're using the latest `vercel.json` configuration
- Check browser console for JavaScript errors
- Verify the build completed successfully

### Routing Issues

- The SPA routing is handled by the `routes` configuration in `vercel.json`
- All routes redirect to `index.html` to enable client-side routing

### API Features

- The frontend-only deployment doesn't include backend APIs
- User authentication and data storage work through localStorage
- For full backend features, deploy the backend separately or use Vercel Functions

## Environment Variables

No environment variables are required for the frontend-only deployment.

## Performance

The build includes:

- Code splitting and optimization via Vite
- CSS minification
- Asset optimization
- Gzip compression enabled by Vercel

## Custom Domain

To use a custom domain:

1. Go to your Vercel project dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

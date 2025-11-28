# Vercel Deployment Guide

## Environment Variables Setup

To ensure your app connects to the correct backend in production, you need to set environment variables in Vercel.

### Steps:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

   **Name:** `VITE_API_BASE_URL`
   
   **Value:** `https://backend-nodejs-jobportal-production.up.railway.app/api`
   
   **Environment:** Select all (Production, Preview, Development)

4. Click **Save**

5. Redeploy your application for the changes to take effect

### Automatic Fallback

If you don't set the environment variable, the app will automatically use the Railway production URL when deployed to Vercel (production mode). However, it's recommended to set it explicitly in Vercel for better control.

### Verification

After deployment, check the browser console to verify the API base URL being used. It should show:
```
https://backend-nodejs-jobportal-production.up.railway.app/api
```

If you see `http://localhost:3000/api`, the environment variable is not set correctly.


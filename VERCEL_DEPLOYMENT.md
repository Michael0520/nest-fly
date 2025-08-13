# Vercel Deployment Guide

This guide will help you deploy both the backend and frontend of your restaurant management system to Vercel.

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│  Frontend       │────▶│  Backend        │
│  (Vercel)       │     │  (Vercel)       │
│  React + Vite   │     │  NestJS API     │
└─────────────────┘     └─────────────────┘
                              │
                        ┌─────────────────┐
                        │  Database       │
                        │  (Vercel/Supabase) │
                        └─────────────────┘
```

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Database**: Set up PostgreSQL (recommended: Vercel Postgres or Supabase)

## 🚀 Step 1: Deploy Backend API

### 1.1 Create New Vercel Project (Backend)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Project Name**: `restaurant-backend` (or your preference)
   - **Framework Preset**: Other
   - **Root Directory**: `apps/backend`
   - **Build Command**: Leave empty (uses vercel.json)
   - **Output Directory**: Leave empty
   - **Install Command**: `pnpm install --frozen-lockfile`

### 1.2 Environment Variables (Backend)
Add these environment variables in Vercel project settings:

```bash
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
```

**Get DATABASE_URL from:**
- **Vercel Postgres**: Create in Vercel Dashboard → Storage → Postgres
- **Supabase**: Project Settings → Database → Connection String
- **Neon**: Connection Details → Connection String

### 1.3 Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your API URL: `https://your-backend.vercel.app`

## 🌐 Step 2: Deploy Frontend

### 2.1 Create New Vercel Project (Frontend)
1. Create another new project in Vercel
2. Import the same GitHub repository
3. Configure project settings:
   - **Project Name**: `restaurant-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install --frozen-lockfile`

### 2.2 Environment Variables (Frontend)
Add this environment variable:

```bash
VITE_API_URL=https://your-backend.vercel.app
```
*Replace with your actual backend URL from Step 1.3*

### 2.3 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at: `https://your-frontend.vercel.app`

## 🔧 Step 3: Database Setup

### Option A: Vercel Postgres (Recommended)
```bash
# After creating Vercel Postgres database
# Use the connection string provided by Vercel
DATABASE_URL="postgres://username:password@host:5432/database?sslmode=require"
```

### Option B: Supabase (Free Alternative)
```bash
# From Supabase project settings
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## 🗃️ Step 4: Initialize Database

You have two options to set up your database:

### Option A: Manual Migration
1. Connect to your database using a PostgreSQL client
2. Run the migration files from `apps/backend/prisma/migrations/`

### Option B: Automatic (if using Supabase)
The `vercel-build` script will automatically run `prisma db push`

## ✅ Step 5: Test Your Deployment

1. **Frontend Test**: Visit your frontend URL
2. **Backend Test**: Try API endpoints:
   ```bash
   curl https://your-backend.vercel.app/restaurant/menu
   ```
3. **Database Test**: Check if data loads correctly in the frontend

## 🔄 Continuous Deployment

Both projects are now set up for automatic deployment:
- Push to `main` branch → Both frontend and backend will auto-deploy
- Separate URLs allow independent scaling and management

## 🛠️ Troubleshooting

### Common Issues:

**Build Failures**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

**Database Connection Issues**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled (`sslmode=require`)

**CORS Issues**
- Backend CORS is configured for `*.vercel.app` domains
- Update CORS origins in `api/index.ts` if needed

**Cold Start Issues**
- First requests may be slow (serverless cold start)
- Consider upgrading to Vercel Pro for better performance

## 📊 Monitoring

Monitor your deployments:
1. **Vercel Analytics**: Enable in project settings
2. **Function Logs**: Check in Vercel dashboard → Functions tab
3. **Performance**: Use Vercel Speed Insights

## 💰 Cost Considerations

**Free Tier Limits:**
- **Vercel**: 100GB bandwidth/month, 12 serverless function executions/hour
- **Supabase**: 500MB database, 2 million row reads/month
- **Vercel Postgres**: 256MB storage, 10,000 requests/month

## 🔐 Security Notes

- Database credentials are stored as Vercel environment variables
- CORS is configured for production domains
- API endpoints have input validation
- Prisma provides SQL injection protection

---

## 🎉 You're Done!

Your restaurant management system is now live on Vercel with:
- ✅ Serverless NestJS API
- ✅ React frontend with TailwindCSS + Shadcn-UI
- ✅ PostgreSQL database
- ✅ Automatic deployments
- ✅ Type-safe API integration

**Frontend**: https://your-frontend.vercel.app  
**Backend**: https://your-backend.vercel.app

Enjoy your modern, scalable restaurant management system! 🚀
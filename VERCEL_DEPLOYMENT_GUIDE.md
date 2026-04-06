# Vercel Deployment Guide - Finance Dashboard

This guide will help you deploy both the frontend (Next.js) and backend (Express API) to Vercel using GitHub integration.

## Prerequisites

1. GitHub account with your code pushed to a repository
2. Vercel account (sign up at https://vercel.com)
3. Supabase account with a PostgreSQL database (https://supabase.com)

## Step 1: Prepare Your Supabase Database

1. Go to https://supabase.com and create a new project
2. Wait for the database to be provisioned (2-3 minutes)
3. Go to **Project Settings** → **Database**
4. Copy the following information:
   - **Connection String** (URI format) - Use the "Transaction" pooler mode
   - It looks like: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`

## Step 2: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Finance Dashboard"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy Backend API to Vercel

### 3.1 Create New Project in Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Click **"Import"**

### 3.2 Configure Backend Project

1. **Framework Preset**: Select "Other"
2. **Root Directory**: Leave as `.` (root)
3. **Build Command**: `npm run vercel-build`
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add the following:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
CORS_ORIGINS=*
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRATION=7d
APP_NAME=Finance Dashboard Backend
APP_VERSION=1.0.0
```

**Important Notes:**
- Replace `DATABASE_URL` with your actual Supabase connection string
- Generate a strong `JWT_SECRET` (at least 32 characters)
- After deploying frontend, update `CORS_ORIGINS` with your frontend URL

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Copy your backend API URL (e.g., `https://your-project.vercel.app`)

### 3.5 Test Backend API

Visit: `https://your-backend-url.vercel.app/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2026-04-06T...",
  "version": "1.0.0"
}
```

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Another New Project

1. Go back to Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. Import the SAME GitHub repository again
4. Click **"Import"**

### 4.2 Configure Frontend Project

1. **Framework Preset**: Select "Next.js"
2. **Root Directory**: Click **"Edit"** and set to `frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 4.3 Add Environment Variables

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_NAME=Finance Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Important:** Replace `your-backend-url.vercel.app` with your actual backend URL from Step 3.4

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Copy your frontend URL (e.g., `https://your-frontend.vercel.app`)

## Step 5: Update Backend CORS Settings

1. Go to your backend project in Vercel
2. Go to **Settings** → **Environment Variables**
3. Find `CORS_ORIGINS` and click **"Edit"**
4. Change value from `*` to your frontend URL: `https://your-frontend.vercel.app`
5. Click **"Save"**
6. Go to **Deployments** tab
7. Click the three dots on the latest deployment → **"Redeploy"**

## Step 6: Seed Initial Data (Optional)

You can seed an admin user by running the seed script locally with production database:

```bash
# Create a .env.production file
DATABASE_URL=your-supabase-connection-string
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
JWT_SECRET=same-as-vercel

# Run seed
NODE_ENV=production npm run seed
```

Or manually create an admin user via API:

```bash
curl -X POST https://your-backend-url.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "Admin@123456",
    "role": "admin"
  }'
```

## Step 7: Test Your Application

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Try to register a new user
3. Login with your credentials
4. Test the dashboard features

## Troubleshooting

### Database Connection Issues

If you see database errors:
- Verify your `DATABASE_URL` is correct
- Make sure you're using the **Transaction pooler** connection string from Supabase
- Ensure `DB_SSL=true` and `DB_SSL_REJECT_UNAUTHORIZED=false`
- Check Supabase project is not paused

### CORS Errors

If you see CORS errors in browser console:
- Verify `CORS_ORIGINS` in backend includes your frontend URL
- Make sure there are no trailing slashes
- Redeploy backend after changing CORS settings

### API Not Responding

- Check backend deployment logs in Vercel
- Visit `/health` endpoint to verify backend is running
- Verify `NEXT_PUBLIC_API_URL` in frontend matches backend URL

### Build Failures

Backend build fails:
- Check TypeScript compilation errors
- Verify all dependencies are in `package.json`
- Check build logs in Vercel

Frontend build fails:
- Verify `NEXT_PUBLIC_API_URL` is set
- Check for TypeScript errors
- Review build logs in Vercel

## Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

## Environment Variables Per Branch

You can set different environment variables for:
- **Production** (main branch)
- **Preview** (pull requests)
- **Development** (local)

Go to **Settings** → **Environment Variables** and select which environments each variable applies to.

## Custom Domains (Optional)

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `CORS_ORIGINS` in backend with new domain

## Monitoring

- **Logs**: Go to project → **Deployments** → Click deployment → **View Function Logs**
- **Analytics**: Available in Vercel dashboard
- **Errors**: Check deployment logs for runtime errors

## Security Checklist

- ✅ Strong JWT_SECRET (32+ characters)
- ✅ CORS_ORIGINS set to specific frontend URL (not *)
- ✅ DATABASE_URL kept secret
- ✅ SSL enabled for database connection
- ✅ Environment variables not committed to git
- ✅ Rate limiting enabled (already in code)
- ✅ Helmet security headers enabled (already in code)

## Cost Considerations

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - 100 hours serverless function execution
  - Unlimited deployments
  
- **Supabase Free Tier**:
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth

Both should be sufficient for development and small production apps.

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domain
3. Add more users via admin panel
4. Set up CI/CD tests
5. Configure backup strategy for database

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Date**: April 6, 2026
**Version**: 1.0.0

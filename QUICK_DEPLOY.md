# Quick Deployment Guide - Finance Dashboard

## 🚀 Fast Track Deployment (Recommended)

This is the simplest way to deploy your Finance Dashboard to Vercel with Supabase.

### Prerequisites
- GitHub account
- Vercel account (free)
- Supabase account (free)

---

## Part 1: Setup Supabase Database (5 minutes)

1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - Name: `finance-dashboard`
   - Database Password: (generate strong password)
   - Region: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes
5. Once ready, go to **Settings** → **Database**
6. Scroll to **Connection String** → **URI** → **Transaction pooler**
7. Click **"Copy"** - this is your `DATABASE_URL`
   - Example: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

---

## Part 2: Push to GitHub (2 minutes)

```bash
# If not already initialized
git init
git add .
git commit -m "Ready for deployment"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy Backend API (5 minutes)

### 3.1 Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Project Name**: `finance-dashboard-backend` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### 3.2 Environment Variables

Add these environment variables (click "Environment Variables"):

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
CORS_ORIGINS=*
JWT_SECRET=change-this-to-random-32-char-string-min
JWT_EXPIRATION=7d
APP_NAME=Finance Dashboard Backend
APP_VERSION=1.0.0
```

**Important:**
- Replace `DATABASE_URL` with your Supabase connection string from Part 1
- Generate a strong random `JWT_SECRET` (minimum 32 characters)
- We'll update `CORS_ORIGINS` later

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once deployed, copy your backend URL (e.g., `https://finance-dashboard-backend.vercel.app`)
4. Test it: Visit `https://your-backend-url.vercel.app/health`

You should see:
```json
{"status":"OK","timestamp":"...","version":"1.0.0"}
```

---

## Part 4: Deploy Frontend (5 minutes)

### 4.1 Create Another Vercel Project

1. Go to https://vercel.com/new again
2. Import the **SAME** GitHub repository
3. Configure:
   - **Project Name**: `finance-dashboard-frontend` (or your choice)
   - **Framework Preset**: Next.js
   - **Root Directory**: Click "Edit" → Set to `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### 4.2 Environment Variables

Add these:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_NAME=Finance Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Important:** Replace `your-backend-url.vercel.app` with your actual backend URL from Part 3.3

### 4.3 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your frontend URL (e.g., `https://finance-dashboard-frontend.vercel.app`)

---

## Part 5: Update CORS (2 minutes)

1. Go to your **backend** project in Vercel
2. **Settings** → **Environment Variables**
3. Find `CORS_ORIGINS` → Click **"Edit"**
4. Change from `*` to your frontend URL: `https://your-frontend-url.vercel.app`
5. Click **"Save"**
6. Go to **Deployments** tab
7. Click ⋯ (three dots) on latest deployment → **"Redeploy"** → **"Redeploy"**

---

## Part 6: Create Admin User (2 minutes)

Option A - Using API:
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

Option B - Using Browser:
1. Visit your frontend URL
2. Click "Register"
3. Fill in details (first user can be admin if you modify registration)
4. Login

---

## ✅ Done! Test Your App

1. Visit: `https://your-frontend-url.vercel.app`
2. Register/Login
3. Test dashboard features

---

## 🔧 Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` is correct (use Transaction pooler, not Session pooler)
- Verify Supabase project is active (not paused)
- Ensure `DB_SSL=true`

### CORS Error in Browser
- Verify `CORS_ORIGINS` in backend matches frontend URL exactly
- No trailing slash in URL
- Redeploy backend after changing CORS

### Frontend Can't Connect to Backend
- Check `NEXT_PUBLIC_API_URL` in frontend settings
- Verify backend `/health` endpoint works
- Check browser console for errors

### Build Failed
- Check deployment logs in Vercel
- Verify all environment variables are set
- Check for TypeScript errors

---

## 📝 Important URLs to Save

- **Frontend**: https://your-frontend-url.vercel.app
- **Backend API**: https://your-backend-url.vercel.app
- **Backend Health**: https://your-backend-url.vercel.app/health
- **Supabase Dashboard**: https://supabase.com/dashboard/project/YOUR-PROJECT-ID

---

## 🔄 Future Deployments

After initial setup, deployments are automatic:
- Push to `main` branch → Auto-deploys to production
- Create Pull Request → Auto-creates preview deployment

---

## 🎯 Next Steps

1. ✅ Change default admin password
2. ✅ Add more users via admin panel
3. ✅ Test all features
4. ✅ Set up custom domain (optional)
5. ✅ Configure monitoring/alerts

---

## 💰 Cost

Both Vercel and Supabase free tiers are sufficient for:
- Development
- Small production apps
- Testing

**Vercel Free**: 100GB bandwidth, 100hrs serverless execution
**Supabase Free**: 500MB database, 1GB storage

---

## 📚 Full Documentation

For detailed information, see: `VERCEL_DEPLOYMENT_GUIDE.md`

---

**Last Updated**: April 6, 2026

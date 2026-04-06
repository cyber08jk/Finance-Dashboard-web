# Single Project Deployment - Finance Dashboard

Deploy both frontend and backend together in ONE Vercel project.

## 🚀 Quick Deployment (15 minutes)

### Step 1: Setup Supabase (5 minutes)

1. Go to https://supabase.com
2. Click **"New Project"**
3. Create project:
   - Name: `finance-dashboard`
   - Password: (generate strong password - save it!)
   - Region: Choose closest to you
4. Wait 2-3 minutes for provisioning
5. Go to **Settings** → **Database**
6. Find **Connection String** → **URI** → **Transaction pooler**
7. Copy the connection string (looks like):
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

---

### Step 2: Push to GitHub (2 minutes)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Finance Dashboard"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel (8 minutes)

#### 3.1 Create Project

1. Go to https://vercel.com/new
2. Click **"Import"** your GitHub repository
3. Configure project:
   - **Project Name**: `finance-dashboard` (or your choice)
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (leave as root - important!)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

#### 3.2 Add Environment Variables

Click **"Environment Variables"** and add ALL of these:

```bash
# Node Environment
NODE_ENV=production

# Database (from Step 1)
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# CORS (use your Vercel domain or * for now)
CORS_ORIGINS=*

# JWT Secret (generate random 32+ character string)
JWT_SECRET=your-super-secret-random-string-min-32-characters-long
JWT_EXPIRATION=7d

# App Info
APP_NAME=Finance Dashboard
APP_VERSION=1.0.0

# Frontend Environment Variables (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_API_URL=/
NEXT_PUBLIC_APP_NAME=Finance Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Important Notes:**
- Replace `DATABASE_URL` with your actual Supabase connection string
- Generate a strong random `JWT_SECRET` (you can use: `openssl rand -base64 32`)
- `NEXT_PUBLIC_API_URL=/` means frontend will call backend on same domain
- Set all variables for **Production**, **Preview**, and **Development** environments

#### 3.3 Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes (building both backend and frontend)
3. Once complete, you'll get your URL: `https://your-project.vercel.app`

---

### Step 4: Test Your Deployment (2 minutes)

#### Test Backend API
Visit: `https://your-project.vercel.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-04-06T...",
  "version": "1.0.0"
}
```

#### Test Frontend
Visit: `https://your-project.vercel.app`

You should see the Finance Dashboard homepage.

---

### Step 5: Create Admin User (2 minutes)

#### Option A - Via API:
```bash
curl -X POST https://your-project.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "Admin@123456",
    "role": "admin"
  }'
```

#### Option B - Via Frontend:
1. Go to `https://your-project.vercel.app`
2. Click "Register"
3. Fill in your details
4. Login and start using the app

---

## ✅ Done!

Your app is now live at: `https://your-project.vercel.app`

- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-project.vercel.app/api/*`
- Health Check: `https://your-project.vercel.app/health`

---

## 🔧 Troubleshooting

### Build Failed

**Check build logs in Vercel:**
1. Go to your project in Vercel
2. Click **"Deployments"**
3. Click the failed deployment
4. Check logs for errors

**Common issues:**
- Missing environment variables
- TypeScript compilation errors
- Missing dependencies

**Fix:**
```bash
# Test build locally first
npm run build

# If it works locally, check Vercel environment variables
```

### Database Connection Error

**Symptoms:** API returns 500 errors, logs show database connection failed

**Fix:**
1. Verify `DATABASE_URL` is correct
2. Use **Transaction pooler** (not Session pooler)
3. Ensure `DB_SSL=true`
4. Check Supabase project is not paused

### Frontend Can't Connect to Backend

**Symptoms:** Frontend shows connection errors

**Fix:**
1. Check `NEXT_PUBLIC_API_URL=/` is set correctly
2. Verify backend `/health` endpoint works
3. Check browser console for errors

### CORS Errors

**Symptoms:** Browser console shows CORS policy errors

**Fix:**
1. Update `CORS_ORIGINS` in Vercel environment variables
2. Set to your Vercel domain: `https://your-project.vercel.app`
3. Or use `*` for testing (not recommended for production)
4. Redeploy after changing

---

## 🔄 Update CORS (Optional - for production)

For better security, update CORS after deployment:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Find `CORS_ORIGINS`
3. Change from `*` to your domain: `https://your-project.vercel.app`
4. Click **"Save"**
5. Go to **Deployments** → Click ⋯ on latest → **"Redeploy"**

---

## 📝 Project Structure

```
your-project.vercel.app/
├── /                    → Frontend (Next.js)
├── /health             → Backend health check
├── /auth/*             → Backend auth endpoints
├── /users/*            → Backend user management
├── /records/*          → Backend financial records
└── /dashboard/*        → Backend analytics
```

All backend routes are handled by Express, all other routes by Next.js frontend.

---

## 🎯 Advantages of Single Project

✅ One deployment URL
✅ No CORS issues (same origin)
✅ Simpler environment variables
✅ Single GitHub repository
✅ Easier to manage
✅ Automatic deployments on push

---

## 🔄 Future Deployments

After initial setup, deployments are automatic:
- **Push to `main`** → Auto-deploys to production
- **Create PR** → Auto-creates preview deployment
- **Merge PR** → Auto-deploys to production

---

## 📊 Monitoring

### View Logs
1. Go to Vercel project
2. Click **"Deployments"**
3. Click a deployment
4. Click **"View Function Logs"**

### Check Performance
1. Go to **"Analytics"** tab
2. View page views, response times, errors

---

## 💰 Cost

**Vercel Free Tier:**
- 100GB bandwidth/month
- 100 hours serverless execution/month
- Unlimited deployments
- Perfect for development and small apps

**Supabase Free Tier:**
- 500MB database
- 1GB file storage
- 2GB bandwidth/month

---

## 🔐 Security Checklist

- ✅ Strong `JWT_SECRET` (32+ characters)
- ✅ `DATABASE_URL` kept secret
- ✅ SSL enabled for database
- ✅ Environment variables not in code
- ✅ `.env` files in `.gitignore`
- ✅ Rate limiting enabled (in code)
- ✅ Helmet security headers (in code)

---

## 🚀 Next Steps

1. Change default admin password
2. Add more users
3. Test all features
4. Set up custom domain (optional)
5. Configure monitoring/alerts
6. Set up database backups

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express Docs**: https://expressjs.com

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console errors
3. Verify all environment variables are set
4. Test backend `/health` endpoint
5. Check Supabase database is active

---

**Deployment Type**: Single Project (Monorepo)
**Last Updated**: April 6, 2026
**Version**: 1.0.0

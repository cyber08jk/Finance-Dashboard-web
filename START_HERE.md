# 🚀 Finance Dashboard - Deployment Guide

## Quick Start

You have **TWO options** for deploying to Vercel:

### ⭐ Option 1: Single Project (RECOMMENDED)
Deploy frontend + backend together in ONE Vercel project.

**Best for:** Simplicity, no CORS issues, faster setup

👉 **Follow: [SINGLE_PROJECT_DEPLOY.md](SINGLE_PROJECT_DEPLOY.md)** (15 minutes)

---

### Option 2: Separate Projects
Deploy frontend and backend as TWO separate Vercel projects.

**Best for:** Independent scaling, microservices, large apps

👉 **Follow: [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** (20 minutes)

---

## Not Sure Which to Choose?

Read: **[DEPLOYMENT_OPTIONS.md](DEPLOYMENT_OPTIONS.md)** for detailed comparison.

**TL;DR:** Start with **Single Project** - it's simpler and you can migrate later if needed.

---

## What You Need

1. ✅ **GitHub Account** - To store your code
2. ✅ **Vercel Account** - To deploy (free tier is fine)
3. ✅ **Supabase Account** - For PostgreSQL database (free tier is fine)

All are free to sign up!

---

## Deployment Steps Overview

### Single Project (Recommended)
1. Setup Supabase database (5 min)
2. Push code to GitHub (2 min)
3. Deploy to Vercel (8 min)
4. Test and create admin user (2 min)

**Total: ~15 minutes**

### Separate Projects
1. Setup Supabase database (5 min)
2. Push code to GitHub (2 min)
3. Deploy backend to Vercel (5 min)
4. Deploy frontend to Vercel (5 min)
5. Update CORS settings (2 min)
6. Test and create admin user (2 min)

**Total: ~20 minutes**

---

## All Documentation Files

### Quick Start Guides
- 📘 **[SINGLE_PROJECT_DEPLOY.md](SINGLE_PROJECT_DEPLOY.md)** - Single project deployment (recommended)
- 📗 **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Separate projects quick guide
- 📕 **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** - Separate projects detailed guide

### Configuration
- 🔧 **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)** - Complete environment variables guide
- 📄 **[.env.example](.env.example)** - Backend environment template
- 📄 **[frontend/.env.example](frontend/.env.example)** - Frontend environment template

### Reference
- 📊 **[DEPLOYMENT_OPTIONS.md](DEPLOYMENT_OPTIONS.md)** - Compare deployment options
- ✅ **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre/post deployment checklist
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture diagrams and flow

### Project Info
- 📖 **[README.md](README.md)** - Project overview and API documentation
- 📋 **[PROJECT_OVERVIEW.txt](PROJECT_OVERVIEW.txt)** - Technical summary

---

## Need Help?

### Common Issues

**Build Failed?**
- Check Vercel deployment logs
- Verify all environment variables are set
- Test build locally: `npm run build`

**Database Connection Error?**
- Use Transaction pooler URL (not Session pooler)
- Verify `DB_SSL=true`
- Check Supabase project is active

**CORS Error?**
- Single Project: Should not happen
- Separate Projects: Update `CORS_ORIGINS` in backend

**Frontend Can't Connect?**
- Single Project: Set `NEXT_PUBLIC_API_URL=/`
- Separate Projects: Set `NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app`

**Environment Variables Not Working?**
- See detailed guide: **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)**

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Your Application              │
├─────────────────────────────────────────┤
│  Frontend (Next.js)                     │
│  - React 18                             │
│  - TypeScript                           │
│  - Tailwind CSS                         │
│  - Recharts                             │
├─────────────────────────────────────────┤
│  Backend (Express API)                  │
│  - Node.js + TypeScript                 │
│  - JWT Authentication                   │
│  - Role-based Access Control            │
│  - Financial Records CRUD               │
│  - Dashboard Analytics                  │
├─────────────────────────────────────────┤
│  Database (Supabase PostgreSQL)         │
│  - Users table                          │
│  - Financial records table              │
│  - Automatic backups                    │
└─────────────────────────────────────────┘
```

---

## Features

✨ **Authentication**
- User registration and login
- JWT token-based auth
- Role-based access control (Viewer, Analyst, Admin)

💰 **Financial Records**
- Create, read, update, delete records
- Income and expense tracking
- Category management
- Date filtering

📊 **Analytics Dashboard**
- Summary cards (total income, expenses, balance)
- Category breakdown charts
- Monthly and weekly trends
- Recent activity feed

👥 **User Management** (Admin only)
- Create and manage users
- Assign roles
- View permissions

---

## Tech Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Axios

**Backend:**
- Node.js
- Express
- TypeScript
- TypeORM
- JWT
- Zod validation

**Database:**
- PostgreSQL (Supabase)

**Deployment:**
- Vercel (Frontend + Backend)
- GitHub (Source control)

---

## Security Features

✅ JWT authentication
✅ Password hashing (bcrypt)
✅ Role-based access control
✅ Rate limiting
✅ Helmet security headers
✅ CORS protection
✅ SQL injection protection (TypeORM)
✅ Input validation (Zod)

---

## Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- 100 hours serverless execution/month
- Unlimited deployments
- ✅ Sufficient for development and small production apps

**Supabase:**
- 500MB database storage
- 1GB file storage
- 2GB bandwidth/month
- ✅ Sufficient for development and small production apps

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Change default admin password
3. ✅ Add more users
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring
6. ✅ Configure database backups
7. ✅ Add more financial records
8. ✅ Explore analytics dashboard

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com

---

## Ready to Deploy?

### Single Project (Recommended)
👉 **Open [SINGLE_PROJECT_DEPLOY.md](SINGLE_PROJECT_DEPLOY.md) and follow the steps**

### Separate Projects
👉 **Open [QUICK_DEPLOY.md](QUICK_DEPLOY.md) or [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)**

---

**Good luck with your deployment! 🚀**

---

**Version**: 1.0.0  
**Last Updated**: April 6, 2026  
**Deployment Platform**: Vercel + Supabase

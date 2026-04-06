# Deployment Troubleshooting Guide

## Current Deployment Status

Your deployment is building! Here's what's happening:

1. ✅ Cloning repository - DONE
2. ✅ Installing root dependencies - DONE
3. ✅ Building Next.js frontend - DONE
4. ✅ Installing backend dependencies - DONE
5. 🔄 Building backend TypeScript - IN PROGRESS
6. 🔄 Building frontend again - IN PROGRESS

## Common Issues & Solutions

### Issue 1: Build Takes Too Long

**Symptom**: Build process exceeds 10 minutes

**Solution**:
- This is normal for first deployment
- Vercel caches builds after first deployment
- Subsequent deployments will be faster (2-3 minutes)

### Issue 2: Frontend Build Fails

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Locally test the build
cd frontend
npm install
npm run build
```

If it works locally but fails on Vercel:
- Check all dependencies are in `frontend/package.json`
- Verify no relative imports outside frontend directory
- Check environment variables are set in Vercel

### Issue 3: Backend Build Fails

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Locally test the build
npm install
npm run build:backend
```

Check for:
- TypeScript errors in `src/` directory
- Missing type definitions
- Import path issues

### Issue 4: Deployment Succeeds but App Doesn't Work

**Symptom**: Deployment shows success but app returns errors

**Common Causes**:

1. **Missing Environment Variables**
   - Go to Vercel → Settings → Environment Variables
   - Verify all variables from `VERCEL_ENV_SETUP.txt` are set
   - Redeploy after adding variables

2. **Database Connection Failed**
   - Check `DATABASE_URL` is correct
   - Use Transaction pooler (port 6543)
   - Verify `DB_SSL=true`
   - Check Supabase project is active

3. **API Routes Not Working**
   - Check `/health` endpoint: `https://your-project.vercel.app/health`
   - Should return: `{"status":"OK",...}`
   - If 404: Check `vercel.json` routes configuration

4. **Frontend Can't Connect to Backend**
   - Verify `NEXT_PUBLIC_API_URL=/` is set
   - Check browser console for errors
   - Test API directly: `https://your-project.vercel.app/health`

### Issue 5: CORS Errors

**Error**: `Access-Control-Allow-Origin` header missing

**Solution**:
- For single project: Set `CORS_ORIGINS=*`
- Or set to your domain: `CORS_ORIGINS=https://your-project.vercel.app`
- Redeploy after changing

### Issue 6: 500 Internal Server Error

**Symptom**: API returns 500 errors

**Debug Steps**:
1. Check Vercel function logs:
   - Go to Vercel → Deployments → Click deployment
   - Click "View Function Logs"
   - Look for error messages

2. Common causes:
   - Database connection failed
   - Missing environment variables
   - JWT_SECRET not set or too short
   - TypeORM synchronize issues

**Solution**:
- Verify all environment variables
- Check database connection
- Review function logs for specific error

### Issue 7: Build Warnings

**Warning**: `React Hook useEffect has a missing dependency`

**Impact**: This is just a warning, not an error
**Action**: Can be ignored for now, or fix by adding the dependency

**Warning**: `npm warn deprecated`

**Impact**: Just warnings about old package versions
**Action**: Can be ignored, packages still work

### Issue 8: High Severity Vulnerability

**Warning**: `1 high severity vulnerability`

**Check**: Run `npm audit` to see details
**Fix**: Usually in development dependencies, safe to ignore for now
**Action**: Can run `npm audit fix` locally and commit

## Monitoring Your Deployment

### Check Build Progress

1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments" tab
4. Click the running deployment
5. Watch the build logs in real-time

### Check Deployment Status

**Building**: Yellow indicator, logs showing progress
**Success**: Green checkmark, deployment URL available
**Failed**: Red X, error logs available

### Test Deployment

Once deployment succeeds:

1. **Test Health Endpoint**:
   ```bash
   curl https://your-project.vercel.app/health
   ```
   Should return: `{"status":"OK","timestamp":"...","version":"1.0.0"}`

2. **Test Frontend**:
   Visit: `https://your-project.vercel.app`
   Should show Finance Dashboard homepage

3. **Test API**:
   ```bash
   curl https://your-project.vercel.app/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

## What to Do If Deployment Fails

### Step 1: Read the Error Logs

1. Go to failed deployment in Vercel
2. Scroll through logs to find the error
3. Look for red error messages

### Step 2: Common Error Patterns

**"Cannot find module"**
- Missing dependency in package.json
- Add it: `npm install <package-name>`
- Commit and push

**"TypeScript error"**
- Fix TypeScript errors locally first
- Run `npm run build` to test
- Fix errors, commit, and push

**"Build exceeded maximum duration"**
- Build took too long (>10 minutes)
- Usually happens on first build
- Try redeploying (click "Redeploy")

**"Out of memory"**
- Build used too much memory
- Rare for this project size
- Contact Vercel support if persists

### Step 3: Test Locally First

Before redeploying:

```bash
# Test backend build
npm install
npm run build:backend

# Test frontend build
cd frontend
npm install
npm run build
cd ..

# Test full build
npm run build
```

If all pass locally, the issue is likely:
- Environment variables not set in Vercel
- Vercel configuration issue
- Network/timeout issue (retry)

### Step 4: Redeploy

After fixing issues:

```bash
git add .
git commit -m "Fix deployment issues"
git push origin main
```

Vercel will automatically redeploy.

Or manually redeploy:
1. Go to Vercel → Deployments
2. Click ⋯ on latest deployment
3. Click "Redeploy"

## Getting Help

### Check These First

1. ✅ All environment variables set in Vercel
2. ✅ Database connection string is correct
3. ✅ JWT_SECRET is at least 32 characters
4. ✅ Supabase project is active
5. ✅ Code builds successfully locally

### Vercel Support

- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

### Project Documentation

- `SINGLE_PROJECT_DEPLOY.md` - Deployment guide
- `ENVIRONMENT_VARIABLES.md` - Environment variables
- `VERCEL_ENV_SETUP.txt` - Quick reference
- `ARCHITECTURE.md` - System architecture

## Success Checklist

After deployment succeeds:

- [ ] `/health` endpoint returns 200 OK
- [ ] Frontend homepage loads
- [ ] Can register a new user
- [ ] Can login
- [ ] Dashboard displays
- [ ] No console errors in browser
- [ ] No errors in Vercel function logs

## Next Steps After Successful Deployment

1. Test all features
2. Create admin user
3. Update CORS if needed (change from `*` to specific domain)
4. Set up custom domain (optional)
5. Configure monitoring
6. Set up database backups

---

**Last Updated**: April 6, 2026
**Version**: 1.0.0

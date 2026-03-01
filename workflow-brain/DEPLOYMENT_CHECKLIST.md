# WorkflowBrain - Deployment Checklist

## Pre-Deployment Checklist ✅

### Code Readiness
- [ ] All features tested locally at http://localhost:3002
- [ ] No console errors in browser Dev Tools
- [ ] All API endpoints working (upload, query, tasks, workflow)
- [ ] `.env.local` is in `.gitignore` (sensitive data not exposed)
- [ ] `package.json` dependencies are stable (no unstable versions)

### Git Setup
- [ ] Code pushed to GitHub
- [ ] Repository is public (for Vercel to access)
- [ ] `.gitignore` includes `.env.local` and `.next`
- [ ] No sensitive data in git history

### Services Configured
- [ ] **MongoDB Atlas:** 
  - [ ] Cluster running and accessible
  - [ ] Database created: `workflow_brain`
  - [ ] IP Whitelist includes 0.0.0.0/0 (Vercel access)
  - [ ] Connection string: `mongodb+srv://kkmessi10barca_db_user:NMgjSpk48We7z4eW@cluster12.raam01n.mongodb.net/workflow_brain?appName=Cluster12b`

- [ ] **Groq API:**
  - [ ] API key generated and valid
  - [ ] Key: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (from https://console.groq.com)
  - [ ] Can make API calls from Vercel region

### Vercel Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Project imported from repository
- [ ] Environment variables set in Vercel dashboard:
  - [ ] `MONGODB_URI`
  - [ ] `GROQ_API_KEY`
  - [ ] `NODE_ENV=production`

---

## Deployment Steps

### 1. Local Build Test
Run this to verify build works locally:
```bash
npm run build
npm run start
```
Open http://localhost:3000 and test key features.

### 2. Git Commit & Push
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 3. Deploy via Vercel
Option A: **Vercel Dashboard** (Easiest)
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your repository
4. Add environment variables
5. Click "Deploy"

Option B: **Vercel CLI** (Advanced)
```bash
npm install -g vercel
vercel
```

### 4. Verify Deployment
- [ ] Built successfully (check build logs)
- [ ] Live URL provided by Vercel
- [ ] Can access homepage
- [ ] Can upload documents
- [ ] Can query documents
- [ ] Can extract tasks
- [ ] Dashboard loads

---

## Post-Deployment Verification

Test each feature on live URL:

### Research Tab
```
1. Upload a PDF or TXT file
2. Wait for "Document uploaded" message
3. Type a question about the document
4. Should get an answer with citations
```

### Tasks Tab
```
1. Paste some text with tasks
2. Click "Extract Tasks"
3. Tasks should appear with priority colors
4. Can toggle completion and delete
```

### Dashboard
```
1. Should show task statistics
2. Should list critical tasks
3. Should show recent documents
```

### Workflow
```
1. Graph should render with nodes
2. Should show documents, tasks, and users
3. "Refresh Graph" button should work
```

---

## Common Deployment Issues & Fixes

### ❌ Build Fails: "Module not found: pdf-parse"
**Fix:** Already handled by `next.config.mjs` serverComponentsExternalPackages

### ❌ API Returns 500: "Cannot connect to MongoDB"
**Checklist:**
- [ ] MONGODB_URI environment variable is set in Vercel
- [ ] Connection string is correct and not expired
- [ ] MongoDB IP Whitelist includes 0.0.0.0/0
- [ ] Database exists: `workflow_brain`

**Debug:** Check Vercel function logs for MongoDB error

### ❌ Upload Fails: "File too large"
**Fix:** Vercel free tier has 5MB request limit
- Use smaller PDFs for testing
- Or upgrade Vercel plan

### ❌ Slow Performance: Cold starts (10-20 seconds)
**Expected:** First request after deploy takes time
**Workaround:** Subsequent requests are normal speed (~200-500ms)

### ❌ Vector Search Not Working
**Expected:** In-memory vectors don't persist in serverless
**Upgrade Path:** 
1. Implement MongoDB Atlas Vector Search, or
2. Use Pinecone (separate service), or
3. Keep in-memory for MVP phase

---

## Performance Optimization

### Already Optimized ✅
- TailwindCSS (production build)
- Next.js Image optimization
- Code splitting per route
- Client-side caching

### Optional Later
- Add Redis for vector caching
- Implement image compression
- Add CDN for static assets
- Database query optimization

---

## Monitoring Live App

### Vercel Dashboard
- View real-time logs
- Monitor build/deployment times
- Check error tracking
- See usage analytics

### Command Line Logs
```bash
vercel logs workflow-brain --tail
```

### MongoDB Logs
- Atlas Dashboard → Activity
- View query performance
- Monitor storage usage

---

## Next Steps After Going Live

1. **Collect Feedback**
   - Share URL with users
   - Monitor Vercel error tracking

2. **Monitor Scale**
   - Watch MongoDB connection count
   - Monitor Groq API usage
   - Check Vercel function duration

3. **Plan Upgrades**
   - When ready: implement persistent vector search
   - Add user authentication
   - Scale database as needed

4. **Production Hardening**
   - Rate limiting on APIs
   - Input validation
   - Security headers
   - Error monitoring (Sentry)

---

## Rollback (If Something Goes Wrong)

### Via Vercel Dashboard
1. Go to Deployments
2. Find last working deployment
3. Click "Redeploy"

### Via Git
```bash
git revert HEAD
git push origin main
# Vercel will auto-redeploy
```

---

## Success! 🎉

Your app is now live and accessible to anyone online!

**Live URL:** https://workflow-brain-[your-id].vercel.app

Share it with:
- Friends and testers
- Team members
- Portfolio/resume
- Investors

---

## Support & Troubleshooting

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Groq API: https://console.groq.com/docs

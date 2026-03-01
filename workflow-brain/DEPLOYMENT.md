# WorkflowBrain - Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel is the official Next.js hosting platform - fastest and easiest for your app.

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: WorkflowBrain prototype"
git remote add origin https://github.com/YOUR_USERNAME/workflow-brain.git
git branch -M main
git push -u origin main
```

### 1.2 Verify `.env.local` is NOT in Git
Make sure `.env.local` is in `.gitignore`:
```bash
# Check if it exists
cat .gitignore
```

If not present, create/update `.gitignore`:
```
.env.local
.next
node_modules
```

---

## Step 2: Deploy to Vercel

### 2.1 Go to Vercel Dashboard
1. Open https://vercel.com
2. Sign up with GitHub (easiest)
3. Click "Import Project"
4. Select your `workflow-brain` repository
5. Click "Import"

### 2.2 Configure Environment Variables
In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/workflow_brain
NODE_ENV=production
```

### 2.3 Deploy
1. Click "Deploy"
2. Wait ~2-3 minutes for build to complete
3. You'll get a live URL like: `https://workflow-brain-xyz.vercel.app`

---

## Step 3: Verify Deployment

### Test Your Live App:
1. **Home Page:** Should load fine
2. **Dashboard:** Check if it connects to MongoDB
3. **Research Tab:** Try uploading a small document
4. **Query:** Ask a question about the document
5. **Tasks:** Try extracting tasks
6. **Workflow:** Check if graph renders

---

## Important Notes for Vercel

### ✅ What Works Great
- Frontend (React pages with TailwindCSS)
- API routes (Node.js runtime)
- File uploads (up to 5MB per request in free tier)
- MongoDB connection
- Vector search (in-memory per request)

### ⚠️ Limitations to Know
- **In-memory vector store loses data between requests**
  - Each Vercel function is stateless
  - Vectors stored only during that request
  - For production scale: upgrade to MongoDB Atlas Vector Search or Pinecone
  
- **Cold starts:** First request after deployment takes ~10-20 seconds
  - Subsequent requests are fast (~200-500ms)

- **File upload limit:** 5MB max per request (free tier)

---

## Step 4: Optional - Production Improvements

### Upgrade Vector Search (Recommended for Scale)
Replace in-memory vector store with MongoDB Vector Search:
- Works across all serverless instances
- Data persists between requests
- Perfect for Vercel

### Enable Redis Cache (Advanced)
Add Redis to cache embeddings and queries:
- Faster responses
- Reduced MongoDB calls
- Better for multiple users

---

## Troubleshooting Deployment

### Build Fails
Check Vercel build logs:
1. Go to Vercel dashboard
2. Click on your project
3. View Deployments → Recent deployment → Logs

### API Routes Return 500
- Check environment variables are set
- Verify MongoDB connection string is correct
- Check Groq API key is valid

### Uploads Don't Work
- Verify MONGODB_URI is accessible from Vercel (IP allowlist)
- Check file size (max 5MB)

### Vector Search Not Working
- This is expected for MVP (in-memory only)
- For production: implement MongoDB Vector Search upgrade

---

## Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (follow Vercel instructions)
4. HTTPS auto-enabled! 🔒

---

## Monitoring & Logs

### View Real-time Logs
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Stream logs
vercel logs workflow-brain --tail
```

### Monitor Performance
- Vercel dashboard shows: deployments, usage, errors
- Real-time analytics for page loads
- Function execution time tracking

---

## Next Steps After Deployment

### 1. Test with Real Users
- Share the live URL
- Collect feedback
- Monitor errors in Vercel dashboard

### 2. When Ready to Scale
- Implement MongoDB Vector Search (data persistence)
- Add authentication (NextAuth.js)
- Add rate limiting
- Upgrade Vercel plan if needed

### 3. Future Enhancements
- Pinecone integration (better vector search)
- User accounts and document sharing
- Advanced analytics
- Mobile app

---

## Cost Estimate

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel** | ✅ 100GB/month | $20+/month |
| **MongoDB Atlas** | ✅ 512MB free | ~$9/month (M10 cluster) |
| **Groq API** | ✅ Free tier | Pay-as-you-go ($0.20/M tokens) |
| **Total** | Free to start! | ~$30-50/month at scale |

---

## Questions?

- Verify `.env.local` not in git
- MongoDB allows Vercel IP (IP Whitelist: 0.0.0.0/0 = anywhere)
- Groq API key is valid and not expired
- All environment variables exactly match what's in code

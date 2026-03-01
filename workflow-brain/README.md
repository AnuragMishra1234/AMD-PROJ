# WorkflowBrain 🧠

An AI-powered productivity web application combining a RAG-based research assistant, task extraction, and workflow visualization.

**Live Demo:** [Deploy to Vercel](#deployment)

---

## Features ✨

### 📚 Research Copilot (RAG)
- Upload PDF/TXT/MD documents
- Ask natural-language questions
- Get AI-powered answers with citations
- Vector search on document chunks

### 🎯 Smart Task Extractor
- Paste meeting notes or emails
- AI automatically extracts actionable tasks
- Set priorities (low → critical)
- Track deadlines
- Mark completion

### 📊 Dashboard
- Task statistics and overview
- Critical tasks list
- Recent documents
- Task list table

### 🔗 Workflow Graph
- Visual representation of your workflow
- Interactive graph with React Flow
- Shows documents, tasks, and deadlines
- Drag-and-drop nodes
- Auto-layout

---

## Tech Stack 🛠️

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 14, React 18, TailwindCSS, React Flow |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB Atlas |
| **AI/LLM** | Groq (llama-3.3-70b), LangChain |
| **Vector Store** | In-memory (MVP) / MongoDB Vector Search (scale) |
| **Hosting** | Vercel (serverless) |

---

## Quick Start 🚀

### Local Development

**Prerequisites:**
- Node.js 18+
- Groq API key: https://console.groq.com
- MongoDB Atlas account: https://cloud.mongodb.com

**Setup:**
```bash
cd workflow-brain

# Create .env.local
cp .env.local.example .env.local

# Add your credentials:
# GROQ_API_KEY=your_key
# MONGODB_URI=your_connection_string

# Install & run
npm install
npm run dev
```

Open http://localhost:3000 (or the suggested port)

---

## Usage 📖

### 1. Upload a Document (Research Tab)
```
1. Click "Upload Document"
2. Select PDF/TXT/MD file
3. Wait for "Document uploaded"
4. Ask questions about it
```

### 2. Extract Tasks (Tasks Tab)
```
1. Paste text (meeting notes, emails, etc.)
2. Click "Extract Tasks"
3. AI extracts structured tasks
4. Edit, delete, or mark complete
```

### 3. View Dashboard
```
- See all statistics
- Critical tasks overview
- Recent documents list
```

### 4. Workflow Visualization
```
- See graph of your documents, tasks, deadlines
- Interact with nodes
- Track relationships
```

---

## Deployment 🌍

### Deploy to Vercel (Recommended)

**1. Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/workflow-brain.git
git push -u origin main
```

**2. Go to Vercel**
- Visit https://vercel.com
- Click "Import Project"
- Select your GitHub repository

**3. Add Environment Variables**
In Vercel dashboard → Settings → Environment Variables:
```
GROQ_API_KEY=your_groq_key
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

**4. Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Get your live URL!

**Complete Guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Project Structure 📁

```
workflow-brain/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── research/
│   │   ├── tasks/
│   │   └── workflow/
│   ├── dashboard/                # Dashboard page
│   ├── research/                 # Research copilot
│   ├── tasks/                    # Task management
│   ├── workflow/                 # Workflow graph
│   └── layout.tsx
├── components/                   # Reusable components
│   ├── research/
│   ├── tasks/
│   ├── ui/
│   └── workflow/
├── lib/                          # Utilities
│   ├── chromadb.ts              # Vector store
│   ├── groq.ts                  # LLM integration
│   ├── langchain.ts             # RAG pipeline
│   ├── mongodb.ts               # Database
│   └── utils.ts
├── models/                       # MongoDB models
│   ├── Document.ts
│   └── Task.ts
├── types/                        # TypeScript types
│   └── index.ts
├── public/                       # Static assets
├── package.json
├── next.config.mjs
├── tsconfig.json
└── tailwind.config.ts
```

---

## API Endpoints 🔌

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/research/upload` | Upload and ingest document |
| GET | `/api/research/upload` | List uploaded documents |
| POST | `/api/research/query` | RAG query with citations |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks` | Update task |
| DELETE | `/api/tasks` | Delete task |
| POST | `/api/tasks/extract` | Extract tasks from text |
| GET | `/api/workflow` | Get workflow graph data |

---

## Configuration 🔧

### Environment Variables

```env
# Required
GROQ_API_KEY=gsk_...              # From https://console.groq.com
MONGODB_URI=mongodb+srv://...     # From MongoDB Atlas

# Optional
NODE_ENV=development              # or production
```

### Chunking Strategy

Edit `lib/langchain.ts`:
```typescript
chunkSize: 400        // Smaller = more chunks, detailed retrieval
chunkOverlap: 80      // Context continuity
```

---

## Limitations & Future Work 🔮

### Current (MVP)
- ✅ Local vector store (works for <100 documents)
- ✅ Single user (no auth)
- ✅ Basic RAG with embeddings
- ✅ Task extraction from text

### Planned Upgrades
- [ ] User authentication (NextAuth.js)
- [ ] Persistent vector search (MongoDB Vector Search)
- [ ] Document sharing & permissions
- [ ] Real-time collaboration
- [ ] Advanced search filters
- [ ] Export to calendar/Notion

---

## Performance Notes ⚡

### Local Development
- Warm start: ~500ms
- Cold build: ~30 seconds

### Production (Vercel)
- Cold start: 10-20 seconds (first request)
- Warm requests: ~200-500ms
- Auto-scaling based on load

### Scaling Recommendations
1. **Document Storage:** MongoDB Atlas
2. **Vector Search:** MongoDB Vector Search or Pinecone
3. **Caching:** Redis
4. **Analytics:** Vercel Analytics / PostHog

---

## Troubleshooting 🐛

### Build Fails
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### MongoDB Connection Error
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database exists

### Groq API Rate Limited
- Check API key usage at https://console.groq.com
- Free tier has rate limits - wait or upgrade

### Port Already in Use
Dev server auto-tries next port (3001, 3002, etc.)

---

## Performance Monitoring 📊

### Local
```bash
# Build analysis
npm run build
# Check .next folder size
```

### Production (Vercel)
- Dashboard shows:
  - Deployment times
  - Function duration
  - Error tracking
  - Usage analytics

```bash
# Stream logs
npx vercel logs workflow-brain --tail
```

---

## Security 🔒

### Already Implemented
- ✅ API key validation
- ✅ .env.local not in git
- ✅ HTTPS on Vercel (auto-enabled)
- ✅ Environment variable isolation

### Recommended for Production
- [ ] Rate limiting on APIs
- [ ] Input validation & sanitization
- [ ] CORS configuration
- [ ] Request size limits
- [ ] Error tracking (Sentry)

---

## Contributing 🤝

Want to improve WorkflowBrain?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License 📄

MIT License - feel free to use this project!

---

## Support & Questions ❓

- 📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- ✅ Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) before going live
- 📚 See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for local development
- 🙋 GitHub Issues for bugs and features

---

## Roadmap 🗺️

### Phase 1: MVP (Current) ✅
- Document upload & RAG
- Task extraction
- Workflow visualization
- Single-user experience

### Phase 2: Scaling
- User accounts
- Persistent vector search
- Document sharing

### Phase 3: Enterprise
- Team collaboration
- Advanced analytics
- Custom integrations
- Self-hosted option

---

## Built with ❤️

Made with [Next.js](https://nextjs.org), [Groq](https://groq.com), and ☕ coffee.

---

**Made for productivity. Built for scale. Ready for deployment.** 🚀

[🚀 Deploy Now](#deployment) | [📖 Read Docs](./DEPLOYMENT.md) | [✅ Checklist](./DEPLOYMENT_CHECKLIST.md)

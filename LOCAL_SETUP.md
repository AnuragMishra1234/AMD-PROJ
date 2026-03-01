# WorkflowBrain - Local Setup (No Docker Required)

This guide shows how to run the project locally without Docker.

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org)
2. **Groq API Key** - Get from [Groq Console](https://console.groq.com) (free tier)
3. **MongoDB** - Use free MongoDB Atlas or local MongoDB

---

## Option A: Using MongoDB Atlas (Easiest - Recommended ⭐)

### 1. Create Free MongoDB Atlas Account
- Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Sign up (free tier available)
- Create a project and cluster (M0 free tier)

### 2. Get Connection String
- In Atlas → Connect → Copy connection string
- It will look like: `mongodb+srv://username:password@cluster.mongodb.net/workflow_brain`

### 3. Configure Environment
Edit `.env.local` and add:
```
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflow_brain
NODE_ENV=development
```

### 4. Install & Run
```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Option B: Using Local MongoDB

### 1. Install MongoDB
- **Windows**: [MongoDB MSI Installer](https://www.mongodb.com/try/download/community)
- During installation, check "Install MongoDB as a Service"

### 2. Verify MongoDB is Running
```bash
mongosh
```

If connected, you'll see a MongoDB shell prompt. Exit with `exit()`

### 3. Configure Environment
Edit `.env.local`:
```
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb://localhost:27017/workflow_brain
NODE_ENV=development
```

### 4. Install & Run
```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Getting Groq API Key

1. Go to [Groq Console](https://console.groq.com)
2. Sign up/Login
3. Go to **API Keys** section
4. Create a new API key
5. Copy it to `.env.local` as `GROQ_API_KEY=gsk_xxxxx`

---

## Troubleshooting

### "MONGODB_URI is not defined"
- Make sure `.env.local` file exists
- Verify the `MONGODB_URI` line is present
- Restart the dev server: `npm run dev`

### "Cannot connect to MongoDB"
**Option A (Atlas):**
- Check internet connection
- Verify username and password in connection string
- Allow your IP in MongoDB Atlas → Network Access

**Option B (Local):**
- Verify MongoDB is running: `mongosh`
- If service stopped, restart it (Windows Services)

### "Groq API Key missing"
- Get a key from [Groq Console](https://console.groq.com)
- Add to `.env.local`: `GROQ_API_KEY=gsk_xxxxx`
- Restart dev server

### "ENOENT: no such file or directory"
- Make sure you're in the correct directory:
  ```bash
  cd workflow-brain
  npm run dev
  ```

---

## Features Available

✅ **Research Copilot** - Upload documents, ask questions (RAG)  
✅ **Task Extractor** - Extract tasks from text  
✅ **Workflow Graph** - Visualize your workflow  
✅ **Dashboard** - View tasks and documents overview  

---

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Need Help?

Check the logs for error messages:
- **MongoDB errors**: Check `.env.local` MONGODB_URI
- **Groq errors**: Check API key in `.env.local`
- **Build errors**: Delete `node_modules` and `.next`, then `npm install` again

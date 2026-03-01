# WorkflowBrain — Requirements

## Overview

WorkflowBrain is a full-stack AI-powered productivity web application for students and early professionals. It combines a RAG-based research assistant, an AI task extractor, and an interactive workflow graph into a single cohesive tool.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Full-stack React framework, file-based routing |
| TailwindCSS 3 | Utility-first CSS styling |
| React Flow (reactflow v11) | Interactive graph visualisation |

### Backend
| Technology | Purpose |
|---|---|
| Next.js API Routes (Node.js runtime) | Server-side API handlers |
| Mongoose 8 | MongoDB ODM for data modelling |
| MongoDB | Primary data store for documents and tasks |

### AI Layer
| Technology | Purpose |
|---|---|
| Groq SDK (`groq-sdk`) | LLM inference via `llama-3.3-70b-versatile` |
| LangChain (`langchain`, `@langchain/core`) | Text splitting (RAG preprocessing) |
| ChromaDB (`chromadb` v1.9) | Local vector database for embeddings |
| `pdf-parse` | Server-side PDF text extraction |

---

## Feature Requirements

### 1. Research Copilot (RAG Pipeline)

| ID | Requirement |
|---|---|
| RC-01 | Users can upload PDF or TXT/MD documents via drag-and-drop or file picker |
| RC-02 | System extracts raw text from uploaded files on the server |
| RC-03 | Extracted text is split into overlapping chunks (800 chars / 100 overlap) |
| RC-04 | Each chunk is embedded and stored in ChromaDB with document metadata |
| RC-05 | Document record (name, content, chunks) is persisted in MongoDB |
| RC-06 | Users can type natural-language questions in the query interface |
| RC-07 | Query is embedded and used to retrieve the top-5 most relevant chunks from ChromaDB |
| RC-08 | Retrieved chunks + question are sent to Groq LLM via a structured prompt |
| RC-09 | LLM response must include numbered in-line citations referencing source chunks |
| RC-10 | Citations are displayed in a collapsible section below each answer |
| RC-11 | Q&A history is shown in reverse-chronological order in the session |

### 2. Smart Task Extractor

| ID | Requirement |
|---|---|
| TE-01 | Users can paste free-form text (meeting notes, emails, messages) |
| TE-02 | System sends text to Groq LLM with a strict JSON extraction prompt |
| TE-03 | Extracted output is a JSON array of tasks with: `title`, `description`, `deadline` (ISO date or null), `priority` (low / medium / high / critical) |
| TE-04 | Markdown code fences in LLM output are stripped before JSON parsing |
| TE-05 | All extracted tasks are persisted to MongoDB via `insertMany` |
| TE-06 | Tasks are displayed in a real-time list immediately after extraction |
| TE-07 | Users can toggle task completion state (optimistic update) |
| TE-08 | Users can delete tasks |
| TE-09 | Overdue tasks (deadline in the past, not completed) are visually highlighted |
| TE-10 | Priority is colour-coded: critical = red, high = yellow, medium = green, low = blue |

### 3. Workflow Graph Visualisation

| ID | Requirement |
|---|---|
| WG-01 | Graph is rendered client-side only (no SSR) using React Flow |
| WG-02 | Graph data (nodes + edges) is fetched from `/api/workflow` on mount |
| WG-03 | Four node types are rendered with distinct visual styles: User, Document, Task, Deadline |
| WG-04 | Edges connect: User → Document ("uploaded"), User → Task ("assigned"), Task → Deadline ("due") |
| WG-05 | Nodes are auto-laid out in columns by type (Documents left, User center, Tasks right, Deadlines far right) |
| WG-06 | MiniMap and Controls are visible for navigation |
| WG-07 | A "Refresh Graph" button re-fetches data and re-renders the graph |
| WG-08 | Task nodes display priority level and a checkmark if completed |

### 4. Dashboard

| ID | Requirement |
|---|---|
| DB-01 | Displays four summary statistics: Total Tasks, Pending, Completed, Documents |
| DB-02 | Shows a "Critical Tasks" panel listing uncompleted critical-priority tasks |
| DB-03 | Shows a "Recent Documents" panel listing the latest uploaded documents |
| DB-04 | Shows a full task table with columns: Title, Priority, Deadline, Status |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/research/upload` | Upload file, extract text, ingest into ChromaDB, save to MongoDB |
| `GET` | `/api/research/upload` | List all uploaded documents (excluding content/chunks) |
| `POST` | `/api/research/query` | RAG query: embed question → retrieve chunks → LLM answer + citations |
| `GET` | `/api/tasks` | List all tasks, sorted newest first |
| `POST` | `/api/tasks` | Create a single task manually |
| `PATCH` | `/api/tasks` | Update a task by `id` (e.g. toggle completion) |
| `DELETE` | `/api/tasks?id=` | Delete a task by `id` |
| `POST` | `/api/tasks/extract` | Extract tasks from raw text via LLM, persist to MongoDB |
| `GET` | `/api/workflow` | Build and return graph nodes + edges from all DB documents and tasks |

---

## Data Models

### Document (MongoDB)
```ts
{
  _id:        ObjectId
  name:       string        // original filename
  content:    string        // full extracted text
  chunks:     string[]      // split text chunks (post-ingest)
  uploadedAt: Date
  userId?:    string
}
```

### Task (MongoDB)
```ts
{
  _id:         ObjectId
  title:       string
  description: string
  deadline?:   string        // ISO date string e.g. "2024-12-31"
  priority:    "low" | "medium" | "high" | "critical"
  completed:   boolean
  sourceText?: string        // original input text
  createdAt:   Date
  userId?:     string
}
```

---

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Architecture** | Clean folder separation: `app/`, `components/`, `lib/`, `models/`, `types/` |
| **Async** | All I/O (DB reads/writes, LLM calls, vector queries) uses `async/await` |
| **Error handling** | All API routes wrap logic in `try/catch`; frontend shows error states |
| **Environment** | Secrets (`GROQ_API_KEY`, `MONGODB_URI`, `CHROMA_URL`) are loaded via `.env.local` |
| **Type safety** | Strict TypeScript throughout; shared types in `types/index.ts` |
| **Responsiveness** | UI is responsive across mobile, tablet, and desktop breakpoints |
| **Performance** | Server-side modules (`pdf-parse`, `chromadb`) are externalised from the webpack bundle |
| **SSR safety** | React Flow is loaded client-only via `next/dynamic` with `ssr: false` |
| **DB connection** | Mongoose uses a global singleton cache to avoid connection storms on serverless |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for LLM inference |
| `MONGODB_URI` | Yes | MongoDB connection string (local or Atlas) |
| `CHROMA_URL` | No | ChromaDB base URL (default: `http://localhost:8000`) |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# → fill in GROQ_API_KEY and MONGODB_URI

# 3. Start ChromaDB (Docker)
docker run -p 8000:8000 chromadb/chroma

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
workflow-brain/
├── app/
│   ├── layout.tsx                    # Root layout (Navbar + body)
│   ├── page.tsx                      # Landing / hero page
│   ├── globals.css                   # Tailwind base styles
│   ├── dashboard/page.tsx            # Dashboard overview
│   ├── research/page.tsx             # Research Copilot page
│   ├── tasks/page.tsx                # Task Extractor page
│   ├── workflow/page.tsx             # Workflow Graph page
│   └── api/
│       ├── research/upload/route.ts  # File upload + ingest
│       ├── research/query/route.ts   # RAG query
│       ├── tasks/route.ts            # Tasks CRUD
│       ├── tasks/extract/route.ts    # AI task extraction
│       └── workflow/route.ts         # Graph data builder
├── components/
│   ├── ui/                           # Navbar, Button, Card, Input, Badge
│   ├── research/                     # DocumentUpload, QueryInterface
│   ├── tasks/                        # TaskExtractor, TaskList
│   └── workflow/                     # WorkflowGraph (React Flow)
├── lib/
│   ├── mongodb.ts                    # Mongoose singleton connection
│   ├── chromadb.ts                   # ChromaDB client helpers
│   ├── groq.ts                       # Groq chat + mock embedding
│   ├── langchain.ts                  # Text splitting, RAG, task extraction
│   └── utils.ts                      # PDF/TXT parsing, API response helpers
├── models/
│   ├── Document.ts                   # Mongoose Document model
│   └── Task.ts                       # Mongoose Task model
├── types/
│   └── index.ts                      # Shared TypeScript interfaces
├── .env.local.example
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

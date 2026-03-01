# Workflow Brain - Docker Setup

This project requires Docker and Docker Compose to run all services (Next.js app + MongoDB).

## Prerequisites

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** - Usually included with Docker Desktop
3. **Groq API Key** - Get one from [Groq Console](https://console.groq.com)

## Quick Start

### 1. Clone/Setup
```bash
cd workflow-brain
```

### 2. Create Environment File
```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Groq API key:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. Start with Docker Compose
```bash
docker-compose up --build
```

This will:
- Build the Next.js application
- Start MongoDB with auth enabled
- Start the Next.js dev server with hot-reload

### 4. Access the App
Open your browser and go to:
```
http://localhost:3000
```

## Services

- **App:** http://localhost:3000 (Next.js development server)
- **MongoDB:** localhost:27017 (internal to containers, or use `mongodb://admin:mongodb123@localhost:27017/workflow_brain?authSource=admin` from host)

## Stopping the Project

Press `Ctrl+C` in the terminal, or in another terminal run:
```bash
docker-compose down
```

## Useful Commands

### View logs
```bash
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Rebuild after dependency changes
```bash
docker-compose up --build
```

### Clean up everything (including data)
```bash
docker-compose down -v
```

### Rebuild image without cache
```bash
docker-compose build --no-cache
```

## Troubleshooting

### Port 3000 already in use
Edit `docker-compose.yml` and change `3000:3000` to `3001:3000` (or any free port)

### MongoDB connection errors
Wait for MongoDB to be ready (~10 seconds). Docker Compose waits for the health check, but initial startup may take time.

### Changes not reflecting
With volumes mounted, code changes should auto-reload. If not:
```bash
docker-compose restart app
```

## Environment Variables

All variables from `.env.local` are automatically loaded. Key ones:

- `GROQ_API_KEY` - Your Groq LLM API key (required)
- `MONGODB_URI` - MongoDB connection string (defaults to docker-compose MongoDB)
- `NODE_ENV` - Set to `development` for dev server with hot-reload

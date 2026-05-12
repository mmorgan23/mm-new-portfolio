# AI Agent Portfolio (Phase 1)

Interactive portfolio demonstrating multi-agent orchestration: a **COO** agent (Mel) coordinates **Research**, **Content**, and **QA** agents. The **Agent dashboard** streams statuses, handoffs, and reasoning over **WebSockets** while a **FastAPI** backend calls the **Anthropic Claude** API.

**Creator:** Melissa Morgan Whiz · **Contact:** info@morganwhiz.com

## Repository layout

| Path | Purpose |
|------|---------|
| [frontend/](frontend/) | Vite + React + TypeScript + Tailwind + shadcn/ui |
| [backend/](backend/) | FastAPI + async Claude streaming + in-memory task state |
| [blog_content/](blog_content/) | Markdown posts (built into the SPA) |
| [projects_data/](projects_data/) | `projects.json` for the projects gallery |

## Local development

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # add CLAUDE_API_KEY
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check: `GET http://127.0.0.1:8000/health`

### Frontend

```bash
cd frontend
cp .env.example .env.local  # set VITE_API_URL=http://127.0.0.1:8000
npm install
npm run dev
```

Open the URL printed by Vite (default `http://127.0.0.1:5173`). Use **Agent dashboard** to submit a task; the UI opens a WebSocket to `/ws/tasks/{task_id}` after `POST /api/tasks`.

### Tests

```bash
cd backend
source .venv/bin/activate
pytest tests/
```

## Deployment

### Frontend (Vercel)

1. Create a Vercel project with **root directory** `frontend`.
2. Build command: `npm run build`, output: `dist`.
3. Environment variable: `VITE_API_URL` = your public backend URL (e.g. `https://api.example.com`, no trailing slash).

### Backend (Railway or Render)

1. Create a service from this repo with **root directory** `backend`.
2. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (Railway/Render inject `PORT`).
3. Environment variables: `CLAUDE_API_KEY`, `FRONTEND_URL` (your Vercel origin), optional `COO_MODEL` / `WORKER_MODEL`, `MAX_TASK_CHARS`, `MAX_CONCURRENT_LLM`.
4. Ensure WebSockets are enabled (default on both platforms for HTTP/1.1 upgrade).

CORS allows `FRONTEND_URL` plus local dev origins configured in [backend/app/config.py](backend/app/config.py).

## API contract (summary)

- `POST /api/tasks` — JSON `{ "description": string }` → `{ "task_id", "ws_path" }`.
- `GET /api/tasks/{task_id}` — snapshot for refresh.
- `WS /ws/tasks/{task_id}` — JSON events: `snapshot`, `agent_status_update`, `agent_message`, `agent_thinking`, `task_complete`, `error`.

Phase 1 keeps task state **in memory** (no database).

## Notes

- Default model IDs in config are placeholders; set `COO_MODEL` / `WORKER_MODEL` in `.env` to the exact model strings your Anthropic project supports.
- The orchestrator runs a **deterministic pipeline** (COO plan → Research → Content → QA, with at most one QA-driven revision) for reliable demos while still surfacing rich multi-agent telemetry.

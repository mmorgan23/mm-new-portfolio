# Backend — AI Agent Portfolio API

FastAPI service for task creation, WebSocket streaming, and the Claude-powered agent pipeline.

See the [root README](../README.md) for environment variables, run commands, and deployment.

Quick start:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

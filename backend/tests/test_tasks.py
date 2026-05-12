from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    client = TestClient(app)
    assert client.get("/health").json() == {"ok": True}


def test_create_task(monkeypatch) -> None:
    async def fake_run(task_id: str) -> None:
        return None

    monkeypatch.setattr("app.api.routes.run_pipeline", fake_run)
    client = TestClient(app)
    res = client.post("/api/tasks", json={"description": "Write a short haiku about APIs"})
    assert res.status_code == 200
    data = res.json()
    assert "task_id" in data
    assert data["ws_path"].startswith("/ws/tasks/")


def test_get_unknown_task() -> None:
    client = TestClient(app)
    res = client.get("/api/tasks/00000000-0000-0000-0000-000000000000")
    assert res.status_code == 404

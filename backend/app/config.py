from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    claude_api_key: str = ""
    frontend_url: str = "http://127.0.0.1:5173"
    coo_model: str = "claude-sonnet-4-20250514"
    worker_model: str = "claude-sonnet-4-20250514"
    max_task_chars: int = 8000
    max_concurrent_llm: int = 2

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"]


settings = Settings()

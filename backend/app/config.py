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
        origins = [self.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"]
        # always allow both www and non-www variants
        if self.frontend_url.startswith("https://www."):
            origins.append(self.frontend_url.replace("https://www.", "https://"))
        elif self.frontend_url.startswith("https://") and not self.frontend_url.startswith("https://www."):
            origins.append(self.frontend_url.replace("https://", "https://www."))
        return origins


settings = Settings()

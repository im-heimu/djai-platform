from dataclasses import dataclass, field
from functools import lru_cache

import os


def _split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _parse_positive_float(value: str) -> float | None:
    try:
        parsed = float(value)
    except ValueError:
        return None

    return parsed if parsed > 0 else None


@dataclass(frozen=True)
class Settings:
    app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "DJAI Platform"))
    api_prefix: str = field(default_factory=lambda: os.getenv("API_PREFIX", "/api/v1"))
    backend_host: str = field(default_factory=lambda: os.getenv("BACKEND_HOST", "0.0.0.0"))
    backend_port: int = field(default_factory=lambda: int(os.getenv("BACKEND_PORT", "8000")))
    cors_origins: list[str] = field(
        default_factory=lambda: _split_csv(
            os.getenv(
                "BACKEND_CORS_ORIGINS",
                "http://localhost:5173,http://127.0.0.1:5173",
            )
        )
    )
    model_api_base_url: str = field(
        default_factory=lambda: os.getenv("MODEL_API_BASE_URL", "").strip()
    )
    model_api_key: str = field(
        default_factory=lambda: os.getenv("MODEL_API_KEY", "").strip()
    )
    model_name: str = field(default_factory=lambda: os.getenv("MODEL_NAME", "").strip())
    model_timeout_seconds: float | None = field(
        default_factory=lambda: _parse_positive_float(
            os.getenv("MODEL_TIMEOUT_SECONDS", "30")
        )
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

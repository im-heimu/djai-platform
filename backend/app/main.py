import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.api.routes import chat_router, system_router
from app.core.config import get_settings
from app.schemas.chat import ApiErrorResponse
from app.services.chat import ModelServiceError

logger = logging.getLogger(__name__)


def _error_response(
    status_code: int,
    error_code: str,
    message: str,
    detail: str | None = None,
) -> JSONResponse:
    payload = ApiErrorResponse(
        error_code=error_code,
        message=message,
        detail=detail,
    )
    return JSONResponse(status_code=status_code, content=payload.model_dump())


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.app_name)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(system_router)
    app.include_router(chat_router, prefix=settings.api_prefix)

    @app.exception_handler(ModelServiceError)
    async def handle_model_service_error(
        request: Request,
        exc: ModelServiceError,
    ) -> JSONResponse:
        return _error_response(
            status_code=exc.status_code,
            error_code=exc.error_code,
            message=exc.message,
            detail=exc.detail,
        )

    @app.exception_handler(RequestValidationError)
    async def handle_request_validation_error(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        return _error_response(
            status_code=422,
            error_code="invalid_request",
            message="Некорректный формат запроса.",
            detail="Проверьте структуру JSON и обязательные поля.",
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(
        request: Request,
        exc: Exception,
    ) -> JSONResponse:
        logger.exception("Unhandled backend error")
        return _error_response(
            status_code=500,
            error_code="internal_error",
            message="Внутренняя ошибка backend.",
        )

    return app


app = create_app()

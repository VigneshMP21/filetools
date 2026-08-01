from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import engine, Base
from app.middleware.logging_middleware import LoggingMiddleware
from app.api.auth.routes import router as auth_router
from app.api.user.routes import router as user_router
from app.api.upload.routes import router as upload_router
from app.api.health.routes import router as health_router

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(upload_router)
app.include_router(health_router)


@app.get("/")
def root():
    return {"name": settings.APP_NAME, "version": settings.APP_VERSION}

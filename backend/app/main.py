from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.api import auth, deposit

app = FastAPI(
    title="MatWerk Zenodo Portal API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
    session_cookie="matwerk_session",
    https_only=False,
    same_site="lax",
    max_age=3600,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(deposit.router, prefix="/deposit", tags=["Deposit"])

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "community": settings.community_id}

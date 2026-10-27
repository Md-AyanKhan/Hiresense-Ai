from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import admin, analysis, auth, chatbot, interview, resume
from app.core.config import settings
from app.db.session import init_db


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-powered resume analyzer, job match engine, and interview preparation API.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    init_db()


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}


app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

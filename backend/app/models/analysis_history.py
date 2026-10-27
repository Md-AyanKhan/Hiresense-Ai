from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time_utils import utc_now_naive
from app.db.session import Base


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    resume_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_data: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    match_result: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    score_breakdown: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    ats_score: Mapped[int] = mapped_column(Integer, nullable=False)
    suggestions: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    interview_questions: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive, nullable=False)

    user = relationship("User", back_populates="analyses")

from collections import Counter
from datetime import timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_admin_user
from app.core.time_utils import utc_now_naive
from app.db.session import get_db
from app.models.analysis_history import AnalysisHistory
from app.models.user import User
from app.schemas.admin import AdminStats, AdminUserRead


router = APIRouter()


@router.get("/users", response_model=list[AdminUserRead])
def list_users(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> list[AdminUserRead]:
    rows = db.execute(
        select(User, func.count(AnalysisHistory.id))
        .outerjoin(AnalysisHistory, AnalysisHistory.user_id == User.id)
        .group_by(User.id)
        .order_by(User.created_at.desc())
    ).all()
    return [
        AdminUserRead(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at,
            analysis_count=count,
        )
        for user, count in rows
    ]


@router.get("/stats", response_model=AdminStats)
def stats(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
) -> AdminStats:
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_analyses = db.scalar(select(func.count(AnalysisHistory.id))) or 0
    avg_ats = float(db.scalar(select(func.avg(AnalysisHistory.ats_score))) or 0)

    analyses = list(db.scalars(select(AnalysisHistory)).all())
    avg_match = 0.0
    if analyses:
        avg_match = sum((item.match_result or {}).get("match_percentage", 0) for item in analyses) / len(analyses)

    since = utc_now_naive() - timedelta(days=6)
    counter: Counter[str] = Counter()
    for item in analyses:
        if item.created_at >= since:
            counter[item.created_at.strftime("%Y-%m-%d")] += 1

    recent_activity = [
        {"date": (since + timedelta(days=offset)).strftime("%Y-%m-%d"), "analyses": counter[(since + timedelta(days=offset)).strftime("%Y-%m-%d")]}
        for offset in range(7)
    ]
    return AdminStats(
        total_users=total_users,
        total_analyses=total_analyses,
        average_ats_score=round(avg_ats, 1),
        average_match_percentage=round(avg_match, 1),
        recent_activity=recent_activity,
    )

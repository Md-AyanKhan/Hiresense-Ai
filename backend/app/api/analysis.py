from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analysis_history import AnalysisHistory
from app.models.user import User
from app.schemas.analysis import AnalysisResponse, HistoryRead, JDMatchRequest
from app.services.ai_suggestions import generate_resume_suggestions
from app.services.file_parser import extract_text_from_file, save_upload
from app.services.interview_service import generate_interview_questions
from app.services.nlp_analyzer import analyze_resume_against_jd
from app.services.resume_parser import parse_resume_text


router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalysisResponse:
    if len(job_description.strip()) < 20:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job description is too short.")

    path = await save_upload(file)
    raw_text = extract_text_from_file(path)
    extracted_data = parse_resume_text(raw_text)
    match_result, ats_score, score_breakdown = analyze_resume_against_jd(raw_text, job_description, extracted_data)
    suggestions = generate_resume_suggestions(extracted_data, match_result, score_breakdown)
    interview_questions = generate_interview_questions(extracted_data, raw_text)

    history = AnalysisHistory(
        user_id=current_user.id,
        resume_filename=file.filename or path.name,
        raw_text=raw_text,
        job_description=job_description,
        extracted_data=extracted_data,
        match_result=match_result,
        score_breakdown=score_breakdown,
        ats_score=ats_score,
        suggestions=suggestions,
        interview_questions=interview_questions,
    )
    db.add(history)
    db.commit()
    db.refresh(history)

    return AnalysisResponse(
        history_id=history.id,
        filename=file.filename or path.name,
        extracted_data=extracted_data,
        match_result=match_result,
        ats_score=ats_score,
        score_breakdown=score_breakdown,
        suggestions=suggestions,
        interview_questions=interview_questions,
    )


@router.post("/match", response_model=AnalysisResponse)
def match_resume_to_jd(
    payload: JDMatchRequest,
    current_user: User = Depends(get_current_user),
) -> AnalysisResponse:
    extracted_data = payload.extracted_data or parse_resume_text(payload.resume_text)
    match_result, ats_score, score_breakdown = analyze_resume_against_jd(
        payload.resume_text,
        payload.job_description,
        extracted_data,
    )
    suggestions = generate_resume_suggestions(extracted_data, match_result, score_breakdown)
    interview_questions = generate_interview_questions(extracted_data, payload.resume_text)
    return AnalysisResponse(
        extracted_data=extracted_data,
        match_result=match_result,
        ats_score=ats_score,
        score_breakdown=score_breakdown,
        suggestions=suggestions,
        interview_questions=interview_questions,
    )


@router.get("/history", response_model=list[HistoryRead])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AnalysisHistory]:
    statement = (
        select(AnalysisHistory)
        .where(AnalysisHistory.user_id == current_user.id)
        .order_by(desc(AnalysisHistory.created_at))
        .limit(50)
    )
    return list(db.scalars(statement).all())


@router.get("/history/{history_id}", response_model=HistoryRead)
def get_history_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalysisHistory:
    history = db.get(AnalysisHistory, history_id)
    if not history or history.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found.")
    return history

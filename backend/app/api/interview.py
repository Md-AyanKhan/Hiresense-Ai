from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analysis import InterviewRequest
from app.services.interview_service import generate_interview_questions
from app.services.resume_parser import parse_resume_text


router = APIRouter()


@router.post("/generate")
def generate_questions(
    payload: InterviewRequest,
    _current_user: User = Depends(get_current_user),
) -> dict[str, list[str]]:
    extracted_data = payload.extracted_data
    if not extracted_data and payload.resume_text:
        extracted_data = parse_resume_text(payload.resume_text)
    questions = generate_interview_questions(extracted_data or {}, payload.resume_text)
    if payload.focus_area:
        focus = payload.focus_area.lower().replace(" ", "_")
        return {key: value for key, value in questions.items() if focus in key or focus == "all"} or questions
    return questions

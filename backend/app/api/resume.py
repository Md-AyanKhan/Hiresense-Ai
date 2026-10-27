from fastapi import APIRouter, Depends, File, UploadFile

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analysis import ResumeParseResponse
from app.services.file_parser import extract_text_from_file, save_upload
from app.services.resume_parser import parse_resume_text


router = APIRouter()


@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(
    file: UploadFile = File(...),
    _current_user: User = Depends(get_current_user),
) -> ResumeParseResponse:
    path = await save_upload(file)
    raw_text = extract_text_from_file(path)
    extracted_data = parse_resume_text(raw_text)
    return ResumeParseResponse(filename=file.filename or path.name, raw_text=raw_text, extracted_data=extracted_data)

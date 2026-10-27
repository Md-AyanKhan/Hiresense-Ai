from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.analysis import ChatRequest, ChatResponse
from app.services.chatbot_service import answer_chat


router = APIRouter()


@router.post("/message", response_model=ChatResponse)
def chat(payload: ChatRequest, _current_user: User = Depends(get_current_user)) -> dict:
    return answer_chat(payload.message, payload.context, payload.history)

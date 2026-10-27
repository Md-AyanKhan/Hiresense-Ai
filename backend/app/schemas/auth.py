from pydantic import BaseModel, EmailStr, Field

from app.core.time_utils import UTCDateTime


class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: str
    is_active: bool
    created_at: UTCDateTime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead

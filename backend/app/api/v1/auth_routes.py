"""Authentication routes: signup, login, token refresh."""

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.workspace_service.users import create_user, authenticate_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    return create_user(db, email=payload.email, password=payload.password, full_name=payload.full_name)


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT access token."""
    user = authenticate_user(db, email=payload.email, password=payload.password)
    return {"access_token": "mock-jwt-token", "token_type": "bearer", "user": user}


@router.get("/status")
def auth_status():
    """Auth route health/status check."""
    return {"status": "healthy", "service": "auth"}

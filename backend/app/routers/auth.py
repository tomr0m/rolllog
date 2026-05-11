from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.crud.user import create_quick_start_user, create_user, get_user_by_email
from app.database import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, QuickStartRequest, SignupRequest, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    if get_user_by_email(db, body.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = create_user(db, email=body.email, password_hash=hash_password(body.password), name=body.name)
    return AuthResponse(user=UserOut.model_validate(user), access_token=create_access_token(user.id))


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, body.email)
    if not user or user.password_hash is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return AuthResponse(user=UserOut.model_validate(user), access_token=create_access_token(user.id))


@router.post("/quick-start", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def quick_start(body: QuickStartRequest, db: Session = Depends(get_db)):
    user = create_quick_start_user(db, name=body.name)
    return AuthResponse(user=UserOut.model_validate(user), access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)

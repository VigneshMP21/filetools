from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import (
    register_user,
    authenticate_user,
    create_tokens,
    refresh_access_token,
    logout_user,
    forgot_password,
    reset_password,
)
from app.dependencies.auth import require_auth
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    UserResponse,
    MessageResponse,
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    user = register_user(db, req)
    tokens = create_tokens(
        db,
        user,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenResponse(**tokens),
    )


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = authenticate_user(db, req.email, req.password)
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    tokens = create_tokens(
        db,
        user,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenResponse(**tokens),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(
    req: RefreshTokenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    logout_user(db, req.refresh_token)
    return MessageResponse(message="Logged out successfully")


@router.post("/refresh", response_model=TokenResponse)
def refresh(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    tokens = refresh_access_token(db, req.refresh_token)
    return TokenResponse(**tokens)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    forgot_password(db, req.email)
    return MessageResponse(message="Password reset email sent if account exists")


@router.post("/reset-password", response_model=MessageResponse)
def reset(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_password(db, req.token, req.new_password)
    return MessageResponse(message="Password reset successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(require_auth)):
    return current_user

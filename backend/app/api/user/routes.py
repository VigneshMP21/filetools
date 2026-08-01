from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.auth import require_auth
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(require_auth)):
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    full_name: str,
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db),
):
    current_user.full_name = full_name
    db.commit()
    db.refresh(current_user)
    return current_user

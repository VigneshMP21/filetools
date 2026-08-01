from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_auth
from app.models.user import User
from app.services.upload_service import (
    save_upload,
    get_user_files,
    get_user_files_count,
    get_file,
    delete_file,
)
from app.schemas.file import FileResponse as FileResponseSchema, FileListResponse, UploadResponse

router = APIRouter(tags=["Files"])


@router.post("/api/upload", response_model=UploadResponse, status_code=201)
def upload_file(
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    uploaded = save_upload(db, file, str(current_user.id))
    return UploadResponse(
        file=FileResponseSchema.model_validate(uploaded),
        message="File uploaded successfully",
    )


@router.get("/api/files", response_model=FileListResponse)
def list_files(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    files = get_user_files(db, str(current_user.id), skip=skip, limit=limit)
    total = get_user_files_count(db, str(current_user.id))
    return FileListResponse(
        files=[FileResponseSchema.model_validate(f) for f in files],
        total=total,
    )


@router.get("/api/files/{file_id}", response_model=FileResponseSchema)
def get_file_metadata(
    file_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    file = get_file(db, file_id, str(current_user.id))
    return FileResponseSchema.model_validate(file)


@router.delete("/api/files/{file_id}")
def delete_file_route(
    file_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    delete_file(db, file_id, str(current_user.id))
    return {"message": "File deleted successfully"}


@router.get("/api/files/{file_id}/download")
def download_file(
    file_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_auth),
):
    file = get_file(db, file_id, str(current_user.id))
    return FileResponse(
        path=file.file_path,
        filename=file.original_name,
        media_type="application/octet-stream",
    )

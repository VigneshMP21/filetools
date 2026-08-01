import os
import uuid
import logging
from typing import List, Optional
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.file import File, FileStatus
from app.models.upload_history import UploadHistory

logger = logging.getLogger("filetools")


def _ensure_upload_dir(user_id: str) -> str:
    upload_path = os.path.join(settings.UPLOAD_DIR, user_id, "original")
    os.makedirs(upload_path, exist_ok=True)
    return upload_path


def save_upload(db: Session, file: UploadFile, user_id: str) -> File:
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB",
        )

    ext = os.path.splitext(file.filename or "file")[1] or ""
    stored_name = f"{uuid.uuid4().hex}{ext}"

    upload_dir = _ensure_upload_dir(user_id)
    file_path = os.path.join(upload_dir, stored_name)

    try:
        content = file.file.read()
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        logger.error(f"Failed to save file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file",
        )

    db_file = File(
        user_id=user_id,
        original_name=file.filename or "unknown",
        stored_name=stored_name,
        file_path=file_path,
        file_size=file_size,
        mime_type=file.content_type or "application/octet-stream",
        status=FileStatus.UPLOADED,
    )
    db.add(db_file)
    db.flush()

    history = UploadHistory(
        user_id=user_id,
        file_id=db_file.id,
        action="upload",
        file_size=file_size,
        file_type=file.content_type or "application/octet-stream",
    )
    db.add(history)
    db.commit()
    db.refresh(db_file)

    return db_file


def get_user_files(
    db: Session, user_id: str, skip: int = 0, limit: int = 50
) -> List[File]:
    return (
        db.query(File)
        .filter(File.user_id == user_id)
        .order_by(File.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_files_count(db: Session, user_id: str) -> int:
    return db.query(File).filter(File.user_id == user_id).count()


def get_file(db: Session, file_id: str, user_id: str) -> Optional[File]:
    file = db.query(File).filter(File.id == file_id, File.user_id == user_id).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    return file


def delete_file(db: Session, file_id: str, user_id: str) -> None:
    file = get_file(db, file_id, user_id)

    try:
        if os.path.exists(file.file_path):
            os.remove(file.file_path)
            logger.info(f"Deleted file from disk: {file.file_path}")
    except Exception as e:
        logger.error(f"Failed to delete file from disk: {e}")

    history = UploadHistory(
        user_id=user_id,
        file_id=file.id,
        action="delete",
        file_size=file.file_size,
        file_type=file.mime_type,
    )
    db.add(history)
    db.delete(file)
    db.commit()

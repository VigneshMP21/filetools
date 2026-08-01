from datetime import datetime
from typing import List
from pydantic import BaseModel


class FileResponse(BaseModel):
    id: str
    original_name: str
    stored_name: str
    file_size: int
    mime_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    file: FileResponse
    message: str


class FileListResponse(BaseModel):
    files: List[FileResponse]
    total: int

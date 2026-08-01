import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class UploadHistory(Base):
    __tablename__ = "upload_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    file_id = Column(UUID(as_uuid=True), ForeignKey("files.id"), nullable=False)
    action = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    file_type = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

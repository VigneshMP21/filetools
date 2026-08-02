# PDF Studio - PDF Protection Tool
# Adds password protection/encryption to a PDF file.

from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter

from app.utils.file_validation import (
    validate_file_size,
    validate_pdf,
)


router = APIRouter(
    prefix="/api/pdf-tools/pdf-protection",
    tags=["PDF Tools"],
)


@router.post("/")
async def pdf_protection(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """
    Protect a PDF using a user-provided password.
    """

    await validate_file_size(file)
    await validate_pdf(file)

    # Validate password.
    password = password.strip()

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password cannot be empty."
        )

    # Initial reasonable limit to prevent abusive input.
    if len(password) > 128:
        raise HTTPException(
            status_code=400,
            detail="Password cannot exceed 128 characters."
        )

    try:
        await file.seek(0)

        reader = PdfReader(file.file)

        # Don't silently re-encrypt an already encrypted PDF.
        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="This PDF is already password protected."
            )

        writer = PdfWriter()

        # Copy all pages to the new PDF.
        for page in reader.pages:
            writer.add_page(page)

        # Encrypt generated PDF.
        writer.encrypt(
            user_password=password,
            algorithm="AES-256",
        )

        output = BytesIO()

        writer.write(output)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                    'attachment; filename="protected.pdf"'
            },
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to protect the PDF file."
        )

    finally:
        await file.close()
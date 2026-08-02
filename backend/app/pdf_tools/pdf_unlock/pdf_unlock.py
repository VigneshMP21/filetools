# PDF Studio - PDF Unlock Tool

from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter

from app.utils.file_validation import (
    validate_file_size,
    validate_pdf,
)

router = APIRouter(
    prefix="/api/pdf-tools/pdf-unlock",
    tags=["PDF Tools"],
)


@router.post("/")
async def pdf_unlock(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """
    Remove password protection from a PDF.
    """

    await validate_file_size(file)
    await validate_pdf(file)

    password = password.strip()

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password cannot be empty."
        )

    try:
        await file.seek(0)

        reader = PdfReader(file.file)

        if not reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="PDF is not password protected."
            )

        # Returns 0 if password is wrong.
        if reader.decrypt(password) == 0:
            raise HTTPException(
                status_code=400,
                detail="Incorrect password."
            )

        writer = PdfWriter()

        # Copy every page into a new unencrypted PDF.
        for page in reader.pages:
            writer.add_page(page)

        output = BytesIO()
        writer.write(output)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="unlocked.pdf"'
            },
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unlock failed: {str(e)}"
        )

    finally:
        await file.close()
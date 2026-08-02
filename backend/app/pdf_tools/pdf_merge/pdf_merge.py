# PDF Studio - PDF Merge Tool
# Multiple validated PDF files are combined into one PDF.

from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter

from app.utils.file_validation import (
    validate_file_size,
    validate_pdf,
)


router = APIRouter(
    prefix="/api/pdf-tools/pdf-merge",
    tags=["PDF Tools"],
)


@router.post("/")
async def merge_pdf(files: list[UploadFile] = File(...)):
    """
    Merge two or more PDF files and return the merged PDF.
    """

    # PDF merging requires at least two files.
    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least two PDF files are required."
        )

    # Validate every uploaded file before processing.
    for file in files:
        await validate_file_size(file)
        await validate_pdf(file)

    writer = PdfWriter()

    try:
        # Read PDFs in the same order they were uploaded.
        for file in files:

            await file.seek(0)

            reader = PdfReader(file.file)

            # Password-protected PDFs should be unlocked
            # using the PDF Unlock tool first.
            if reader.is_encrypted:
                raise HTTPException(
                    status_code=400,
                    detail=f"{file.filename} is password protected. Unlock it before merging."
                )

            for page in reader.pages:
                writer.add_page(page)

        # Keep generated PDF in memory instead of permanently
        # storing user documents on the backend server.
        output = BytesIO()

        writer.write(output)

        # Move pointer back to beginning before sending.
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="merged.pdf"'
            }
        )

    except HTTPException:
        raise

    except Exception:
        # Don't expose internal exception details to users.
        raise HTTPException(
            status_code=500,
            detail="Unable to merge the PDF files."
        )

    finally:
        # Close uploaded temporary file handles.
        for file in files:
            await file.close()
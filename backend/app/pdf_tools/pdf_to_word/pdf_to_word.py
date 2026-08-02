# PDF Studio - PDF to Word Tool
# Converts a validated PDF file into a DOCX document.

import os
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pdf2docx import Converter

from app.utils.file_validation import (
    validate_file_size,
    validate_pdf,
)


router = APIRouter(
    prefix="/api/pdf-tools/pdf-to-word",
    tags=["PDF Tools"],
)


@router.post("/")
async def pdf_to_word(file: UploadFile = File(...)):
    """
    Convert an uploaded PDF file into a Word DOCX document.
    """

    await validate_file_size(file)
    await validate_pdf(file)

    temp_pdf_path = None
    temp_docx_path = None

    try:
        # Create temporary PDF file.
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_pdf:

            temp_pdf_path = temp_pdf.name

            await file.seek(0)

            # Copy uploaded PDF into temporary file.
            while chunk := await file.read(1024 * 1024):
                temp_pdf.write(chunk)

        # Create temporary DOCX output path.
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".docx"
        ) as temp_docx:

            temp_docx_path = temp_docx.name

        # Convert PDF -> DOCX.
        converter = Converter(temp_pdf_path)

        try:
            converter.convert(
                temp_docx_path,
                start=0,
                end=None
            )
        finally:
            converter.close()

        # Make sure conversion actually produced a file.
        if (
            not os.path.exists(temp_docx_path)
            or os.path.getsize(temp_docx_path) == 0
        ):
            raise HTTPException(
                status_code=500,
                detail="PDF to Word conversion failed."
            )

        return FileResponse(
            path=temp_docx_path,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            filename="converted.docx",
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to convert the PDF to Word."
        )

    finally:
        await file.close()

        # Input PDF is no longer needed after conversion.
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

        # IMPORTANT:
        # Don't delete temp_docx_path here.
        # FileResponse still needs the file after this function returns.
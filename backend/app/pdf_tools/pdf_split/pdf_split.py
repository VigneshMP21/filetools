# PDF Studio - PDF Split Tool
# Extract a selected page range from a PDF and return a new PDF.

from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter

from app.utils.file_validation import (
    validate_file_size,
    validate_pdf,
)


router = APIRouter(
    prefix="/api/pdf-tools/pdf-split",
    tags=["PDF Tools"],
)


@router.post("/")
async def pdf_split(
    file: UploadFile = File(...),
    start_page: int = Form(...),
    end_page: int = Form(...),
):
    """
    Extract pages from start_page to end_page.

    Example:
    start_page = 2
    end_page = 5

    Returns pages 2, 3, 4 and 5.
    """

    # Validate uploaded PDF.
    await validate_file_size(file)
    await validate_pdf(file)

    try:
        await file.seek(0)

        reader = PdfReader(file.file)

        # Encrypted PDFs must be unlocked first.
        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Password-protected PDF detected. Unlock it before splitting."
            )

        total_pages = len(reader.pages)

        # Page numbers shown to users start from 1.
        if start_page < 1 or end_page < 1:
            raise HTTPException(
                status_code=400,
                detail="Page numbers must start from 1."
            )

        if start_page > end_page:
            raise HTTPException(
                status_code=400,
                detail="Start page cannot be greater than end page."
            )

        if start_page > total_pages or end_page > total_pages:
            raise HTTPException(
                status_code=400,
                detail=f"Page range exceeds the PDF's total of {total_pages} pages."
            )

        writer = PdfWriter()

        # Python indexing starts at 0,
        # so user page 1 corresponds to reader.pages[0].
        for page_number in range(start_page - 1, end_page):
            writer.add_page(reader.pages[page_number])

        output = BytesIO()

        writer.write(output)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="split_pages_{start_page}-{end_page}.pdf"'
                )
            },
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to split the PDF file."
        )

    finally:
        await file.close()
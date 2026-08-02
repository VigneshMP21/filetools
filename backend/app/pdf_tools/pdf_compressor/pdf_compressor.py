# PDF Studio - PDF Compressor Tool

from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter

from app.utils.file_validation import (
    validate_file_size,
    validate_pdf,
)

router = APIRouter(
    prefix="/api/pdf-tools/pdf-compressor",
    tags=["PDF Tools"],
)


@router.post("/")
async def pdf_compressor(file: UploadFile = File(...)):
    """
    Create an optimized PDF.
    """

    await validate_file_size(file)
    await validate_pdf(file)

    try:
        await file.seek(0)

        reader = PdfReader(file.file)

        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Password-protected PDF detected. Unlock it before compressing."
            )

        writer = PdfWriter()

        # Copy every page
        for page in reader.pages:
            writer.add_page(page)

        # Preserve metadata if available
        if reader.metadata:
            writer.add_metadata(reader.metadata)

        output = BytesIO()

        writer.write(output)

        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="compressed.pdf"'
            },
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Compression failed: {str(e)}"
        )

    finally:
        await file.close()
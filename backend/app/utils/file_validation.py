# Common file validation utilities for PDF Studio.
# Uploaded files are checked here before any processing starts.

from pathlib import Path

from fastapi import HTTPException, UploadFile


# Maximum upload size for the initial version of PDF Studio.
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


PDF_EXTENSIONS = {".pdf"}

WORD_EXTENSIONS = {
    ".docx",
}


async def validate_pdf(file: UploadFile) -> None:
    """
    Validate an uploaded PDF file.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is missing."
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in PDF_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Read the first bytes to verify the PDF file signature.
    header = await file.read(5)

    if header != b"%PDF-":
        await file.seek(0)

        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file."
        )

    # Return file pointer to beginning for later processing.
    await file.seek(0)


async def validate_word(file: UploadFile) -> None:
    """
    Validate an uploaded DOCX file.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is missing."
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in WORD_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only DOCX files are allowed."
        )

    # DOCX is internally a ZIP container.
    header = await file.read(4)

    valid_zip_headers = (
        b"PK\x03\x04",
        b"PK\x05\x06",
        b"PK\x07\x08",
    )

    if header not in valid_zip_headers:
        await file.seek(0)

        raise HTTPException(
            status_code=400,
            detail="Invalid DOCX file."
        )

    await file.seek(0)


async def validate_file_size(file: UploadFile) -> None:
    """
    Prevent empty files and files larger than 50 MB.
    """

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds the 50 MB limit."
        )

    if size == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty files are not allowed."
        )
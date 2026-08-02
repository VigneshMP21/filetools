# PDF Studio - Word to PDF Tool
# Converts a validated DOCX document into PDF using LibreOffice.

import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.utils.file_validation import (
    validate_file_size,
    validate_word,
)


router = APIRouter(
    prefix="/api/word-tools/word-to-pdf",
    tags=["Word Tools"],
)


def get_libreoffice_path() -> str:
    """
    Find LibreOffice executable.

    Windows development:
        C:\\Program Files\\LibreOffice\\program\\soffice.exe

    Linux / Render:
        soffice or libreoffice
    """

    # First check system PATH.
    soffice = shutil.which("soffice")

    if soffice:
        return soffice

    libreoffice = shutil.which("libreoffice")

    if libreoffice:
        return libreoffice

    # Windows default installation path.
    windows_path = (
        r"C:\Program Files\LibreOffice\program\soffice.exe"
    )

    if os.path.exists(windows_path):
        return windows_path

    raise HTTPException(
        status_code=500,
        detail="LibreOffice is not available on the server."
    )


@router.post("/")
async def word_to_pdf(file: UploadFile = File(...)):
    """
    Convert DOCX to PDF using LibreOffice headless mode.
    """

    await validate_file_size(file)
    await validate_word(file)

    temp_directory = None

    try:
        # Create isolated temporary directory for this conversion.
        temp_directory = tempfile.mkdtemp(
            prefix="pdfstudio_word_to_pdf_"
        )

        input_path = Path(temp_directory) / "input.docx"

        # Save uploaded DOCX.
        await file.seek(0)

        with open(input_path, "wb") as output_file:
            while chunk := await file.read(1024 * 1024):
                output_file.write(chunk)

        libreoffice_path = get_libreoffice_path()

        # Convert DOCX -> PDF.
        process = subprocess.run(
            [
                libreoffice_path,
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                temp_directory,
                str(input_path),
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=120,
            check=False,
        )

        output_path = Path(temp_directory) / "input.pdf"

        # Verify LibreOffice successfully generated the PDF.
        if (
            process.returncode != 0
            or not output_path.exists()
            or output_path.stat().st_size == 0
        ):
            raise HTTPException(
                status_code=500,
                detail="Word to PDF conversion failed."
            )

        return FileResponse(
            path=str(output_path),
            media_type="application/pdf",
            filename="converted.pdf",
        )

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Word to PDF conversion timed out."
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to convert the Word document to PDF."
        )

    finally:
        await file.close()

        # NOTE:
        # temp_directory-ai inga delete panna koodadhu.
        # FileResponse function return aana apram dhaan file send pannum.
        # Proper response cleanup-ai later add pannuvom.
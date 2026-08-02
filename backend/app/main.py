# PDF Studio - Word Compressor
#
# Safe DOCX optimization using LibreOffice.
# The document is opened and re-saved by a real office engine
# instead of manually rebuilding the DOCX ZIP package.

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
    prefix="/api/word-tools/word-compressor",
    tags=["Word Tools"],
)


def get_libreoffice_path() -> str:
    """
    Locate LibreOffice on Windows or Linux.
    """

    soffice = shutil.which("soffice")

    if soffice:
        return soffice

    libreoffice = shutil.which("libreoffice")

    if libreoffice:
        return libreoffice

    windows_paths = [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
    ]

    for path in windows_paths:
        if os.path.exists(path):
            return path

    raise HTTPException(
        status_code=500,
        detail="LibreOffice is not available on the server."
    )


@router.post("/")
async def word_compressor(
    file: UploadFile = File(...)
):
    """
    Optimize a DOCX document by opening and re-saving
    it through LibreOffice.

    This prioritizes document integrity over aggressive
    image compression.
    """

    await validate_file_size(file)
    await validate_word(file)

    temp_directory = None

    try:
        temp_directory = tempfile.mkdtemp(
            prefix="pdfstudio_word_compress_"
        )

        temp_path = Path(temp_directory)

        input_directory = temp_path / "input"
        output_directory = temp_path / "output"

        input_directory.mkdir()
        output_directory.mkdir()

        input_path = input_directory / "document.docx"

        # Save uploaded DOCX.
        await file.seek(0)

        with open(input_path, "wb") as output_file:
            while chunk := await file.read(1024 * 1024):
                output_file.write(chunk)

        original_size = input_path.stat().st_size

        libreoffice = get_libreoffice_path()

        # Open and re-save DOCX using LibreOffice.
        process = subprocess.run(
            [
                libreoffice,
                "--headless",
                "--convert-to",
                "docx",
                "--outdir",
                str(output_directory),
                str(input_path),
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=120,
            check=False,
        )

        output_path = output_directory / "document.docx"

        if (
            process.returncode != 0
            or not output_path.exists()
            or output_path.stat().st_size == 0
        ):
            raise HTTPException(
                status_code=500,
                detail="Unable to optimize the Word document."
            )

        optimized_size = output_path.stat().st_size

        # If LibreOffice produced a larger document,
        # return the original instead.
        if optimized_size >= original_size:
            final_path = input_path
        else:
            final_path = output_path

        return FileResponse(
            path=str(final_path),
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            filename="compressed.docx",
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(
                    final_path.stat().st_size
                ),
            },
        )

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Word compression timed out."
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to compress the Word document."
        )

    finally:
        await file.close()

        # Do NOT delete temp_directory here.
        # FileResponse still needs the generated file.
        # Response cleanup will be implemented separately.
# PDF Studio - Word Compressor
#
# Compresses DOCX documents by:
# 1. Extracting the DOCX ZIP package
# 2. Optimizing embedded images
# 3. Rebuilding the DOCX using maximum ZIP compression
#
# Compression levels:
#   low    -> Better quality, smaller compression
#   medium -> Balanced
#   high   -> Maximum practical compression

import os
import shutil
import tempfile
from io import BytesIO
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from PIL import Image

from app.utils.file_validation import (
    validate_file_size,
    validate_word,
)


router = APIRouter(
    prefix="/api/word-tools/word-compressor",
    tags=["Word Tools"],
)


# ------------------------------------------------------------
# Compression configuration
# ------------------------------------------------------------

COMPRESSION_SETTINGS = {
    "low": {
        "quality": 90,
        "max_dimension": 2400,
    },
    "medium": {
        "quality": 75,
        "max_dimension": 1800,
    },
    "high": {
        "quality": 55,
        "max_dimension": 1280,
    },
}


# ------------------------------------------------------------
# Image compression
# ------------------------------------------------------------

def compress_image(
    image_path: Path,
    quality: int,
    max_dimension: int,
) -> None:
    """
    Compress supported images inside a DOCX package.

    JPEG:
        Resize + JPEG quality compression.

    PNG:
        Resize + PNG optimization.

    Unsupported image formats are left unchanged.
    """

    try:
        original_size = image_path.stat().st_size

        with Image.open(image_path) as image:

            width, height = image.size

            # --------------------------------------------
            # Resize large images
            # --------------------------------------------

            if max(width, height) > max_dimension:

                ratio = max_dimension / max(width, height)

                new_width = max(
                    1,
                    int(width * ratio),
                )

                new_height = max(
                    1,
                    int(height * ratio),
                )

                image = image.resize(
                    (new_width, new_height),
                    Image.Resampling.LANCZOS,
                )

            suffix = image_path.suffix.lower()

            temporary_output = BytesIO()

            # --------------------------------------------
            # JPEG
            # --------------------------------------------

            if suffix in {".jpg", ".jpeg"}:

                if image.mode not in {"RGB", "L"}:
                    image = image.convert("RGB")

                image.save(
                    temporary_output,
                    format="JPEG",
                    quality=quality,
                    optimize=True,
                    progressive=True,
                )

            # --------------------------------------------
            # PNG
            # --------------------------------------------

            elif suffix == ".png":

                image.save(
                    temporary_output,
                    format="PNG",
                    optimize=True,
                    compress_level=9,
                )

            else:
                return

            compressed_data = temporary_output.getvalue()

        # Only replace the original image if the
        # compressed version is actually smaller.
        if (
            compressed_data
            and len(compressed_data) < original_size
        ):
            image_path.write_bytes(compressed_data)

    except Exception:
        # A single unsupported/corrupt image should not
        # destroy the complete Word compression request.
        return


# ------------------------------------------------------------
# DOCX package compression
# ------------------------------------------------------------

def rebuild_docx(
    extracted_directory: Path,
) -> BytesIO:
    """
    Rebuild extracted DOCX package using maximum
    ZIP DEFLATE compression.
    """

    output = BytesIO()

    with ZipFile(
        output,
        mode="w",
        compression=ZIP_DEFLATED,
        compresslevel=9,
    ) as zip_file:

        for root, _, files in os.walk(
            extracted_directory
        ):

            for filename in files:

                full_path = Path(root) / filename

                archive_path = full_path.relative_to(
                    extracted_directory
                )

                zip_file.write(
                    full_path,
                    archive_path.as_posix(),
                )

    output.seek(0)

    return output


# ------------------------------------------------------------
# API
# ------------------------------------------------------------

@router.post("/")
async def word_compressor(
    file: UploadFile = File(...),
    compression_level: str = Form("medium"),
):
    """
    Compress a DOCX document.

    compression_level:
        low
        medium
        high
    """

    await validate_file_size(file)
    await validate_word(file)

    compression_level = (
        compression_level
        .strip()
        .lower()
    )

    if compression_level not in COMPRESSION_SETTINGS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid compression level. "
                "Use low, medium, or high."
            ),
        )

    temp_directory = None

    try:
        await file.seek(0)

        original_data = await file.read()

        original_size = len(original_data)

        temp_directory = tempfile.mkdtemp(
            prefix="pdfstudio_word_compress_"
        )

        temp_path = Path(temp_directory)

        input_path = temp_path / "input.docx"

        extract_path = temp_path / "extracted"

        extract_path.mkdir()

        input_path.write_bytes(
            original_data
        )

        # --------------------------------------------------
        # Extract DOCX
        # --------------------------------------------------

        try:

            with ZipFile(
                input_path,
                "r"
            ) as docx_zip:

                docx_zip.extractall(
                    extract_path
                )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid DOCX package.",
            )

        # --------------------------------------------------
        # Compress embedded media
        # --------------------------------------------------

        settings = COMPRESSION_SETTINGS[
            compression_level
        ]

        media_directory = (
            extract_path
            / "word"
            / "media"
        )

        if media_directory.exists():

            for media_file in media_directory.iterdir():

                if not media_file.is_file():
                    continue

                if media_file.suffix.lower() not in {
                    ".jpg",
                    ".jpeg",
                    ".png",
                }:
                    continue

                compress_image(
                    media_file,
                    quality=settings["quality"],
                    max_dimension=settings[
                        "max_dimension"
                    ],
                )

        # --------------------------------------------------
        # Rebuild DOCX
        # --------------------------------------------------

        compressed_output = rebuild_docx(
            extract_path
        )

        compressed_size = len(
            compressed_output.getvalue()
        )

        # If optimization somehow makes the file larger,
        # return the original DOCX instead.
        if compressed_size >= original_size:

            output = BytesIO(
                original_data
            )

        else:

            output = compressed_output

        output.seek(0)

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-"
                "officedocument.wordprocessingml.document"
            ),
            headers={
                "Content-Disposition":
                    'attachment; filename="compressed.docx"',
                "X-Original-Size":
                    str(original_size),
                "X-Compressed-Size":
                    str(
                        min(
                            original_size,
                            compressed_size,
                        )
                    ),
            },
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to compress the Word document.",
        )

    finally:

        await file.close()

        if (
            temp_directory
            and os.path.exists(temp_directory)
        ):

            shutil.rmtree(
                temp_directory,
                ignore_errors=True,
            )
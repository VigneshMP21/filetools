# PDF Studio - Word Merge Tool
# Combines multiple DOCX documents into one DOCX file.

from copy import deepcopy
from io import BytesIO

from docx import Document
from docx.enum.section import WD_SECTION
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.utils.file_validation import (
    validate_file_size,
    validate_word,
)


router = APIRouter(
    prefix="/api/word-tools/word-merge",
    tags=["Word Tools"],
)


@router.post("/")
async def word_merge(files: list[UploadFile] = File(...)):
    """
    Merge two or more DOCX documents.

    Documents are merged in the same order
    in which they are uploaded.
    """

    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least two Word documents are required."
        )

    # Validate every document before processing.
    for file in files:
        await validate_file_size(file)
        await validate_word(file)

    try:
        # -----------------------------
        # First document
        # -----------------------------

        await files[0].seek(0)

        first_content = await files[0].read()

        merged_document = Document(
            BytesIO(first_content)
        )

        # -----------------------------
        # Remaining documents
        # -----------------------------

        for file in files[1:]:

            await file.seek(0)

            content = await file.read()

            source_document = Document(
                BytesIO(content)
            )

            # Start each merged document on a new page.
            merged_document.add_section(
                WD_SECTION.NEW_PAGE
            )

            # Copy document body elements.
            for element in source_document.element.body:

                # sectPr contains section configuration.
                # Don't directly duplicate it here.
                if element.tag.endswith("sectPr"):
                    continue

                merged_document.element.body.append(
                    deepcopy(element)
                )

        # -----------------------------
        # Generate output DOCX
        # -----------------------------

        output = BytesIO()

        merged_document.save(output)

        output.seek(0)

        return StreamingResponse(
            output,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            headers={
                "Content-Disposition":
                    'attachment; filename="merged.docx"'
            },
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to merge the Word documents."
        )

    finally:
        for file in files:
            await file.close()
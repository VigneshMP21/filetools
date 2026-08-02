from fastapi import APIRouter, UploadFile, File

from app.utils.file_validation import validate_file_size, validate_word


router = APIRouter(
    prefix="/api/word-tools/word-to-pdf",
    tags=["Word Tools"]
)


@router.post("/")
async def word_to_pdf(file: UploadFile = File(...)):

    await validate_file_size(file)
    await validate_word(file)

    return {
        "status": "success",
        "tool": "word-to-pdf",
        "message": "Word document is valid and ready for conversion.",
        "filename": file.filename
    }
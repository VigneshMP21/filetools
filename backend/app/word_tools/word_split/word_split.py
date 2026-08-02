from fastapi import APIRouter, UploadFile, File

from app.utils.file_validation import validate_file_size, validate_word


router = APIRouter(
    prefix="/api/word-tools/word-split",
    tags=["Word Tools"]
)


@router.post("/")
async def word_split(file: UploadFile = File(...)):

    await validate_file_size(file)
    await validate_word(file)

    return {
        "status": "success",
        "tool": "word-split",
        "message": "Word document is valid and ready for splitting.",
        "filename": file.filename
    }
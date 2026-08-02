from fastapi import APIRouter, UploadFile, File

from app.utils.file_validation import validate_file_size, validate_word


router = APIRouter(
    prefix="/api/word-tools/word-compressor",
    tags=["Word Tools"]
)


@router.post("/")
async def word_compressor(file: UploadFile = File(...)):

    await validate_file_size(file)
    await validate_word(file)

    return {
        "status": "success",
        "tool": "word-compressor",
        "message": "Word document is valid and ready for compression.",
        "filename": file.filename
    }
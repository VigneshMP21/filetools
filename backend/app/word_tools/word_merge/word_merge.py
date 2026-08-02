from fastapi import APIRouter, UploadFile, File, HTTPException

from app.utils.file_validation import validate_file_size, validate_word


router = APIRouter(
    prefix="/api/word-tools/word-merge",
    tags=["Word Tools"]
)


@router.post("/")
async def word_merge(files: list[UploadFile] = File(...)):

    if len(files) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least two Word documents are required."
        )

    for file in files:
        await validate_file_size(file)
        await validate_word(file)

    return {
        "status": "success",
        "tool": "word-merge",
        "message": "All Word documents are valid and ready for merging.",
        "files_received": len(files),
        "files": [file.filename for file in files]
    }
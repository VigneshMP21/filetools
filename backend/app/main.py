# Main entry point for the PDF Studio backend API.

from fastapi import FastAPI

# PDF Tool Routers
from app.pdf_tools.pdf_to_word.pdf_to_word import router as pdf_to_word_router
from app.pdf_tools.pdf_merge.pdf_merge import router as pdf_merge_router
from app.pdf_tools.pdf_split.pdf_split import router as pdf_split_router
from app.pdf_tools.pdf_compressor.pdf_compressor import router as pdf_compressor_router
from app.pdf_tools.pdf_protection.pdf_protection import router as pdf_protection_router
from app.pdf_tools.pdf_unlock.pdf_unlock import router as pdf_unlock_router

# Word Tool Routers
from app.word_tools.word_to_pdf.word_to_pdf import router as word_to_pdf_router
from app.word_tools.word_merge.word_merge import router as word_merge_router
from app.word_tools.word_split.word_split import router as word_split_router
from app.word_tools.word_compressor.word_compressor import router as word_compressor_router


# Create FastAPI application.
app = FastAPI(
    title="PDF Studio API",
    description="Backend API for PDF Studio PDF and Word tools",
    version="1.0.0"
)


# --------------------------------------------------
# PDF Tool Routers
# --------------------------------------------------

app.include_router(pdf_to_word_router)
app.include_router(pdf_merge_router)
app.include_router(pdf_split_router)
app.include_router(pdf_compressor_router)
app.include_router(pdf_protection_router)
app.include_router(pdf_unlock_router)


# --------------------------------------------------
# Word Tool Routers
# --------------------------------------------------

app.include_router(word_to_pdf_router)
app.include_router(word_merge_router)
app.include_router(word_split_router)
app.include_router(word_compressor_router)


# --------------------------------------------------
# General Routes
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "PDF Studio API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
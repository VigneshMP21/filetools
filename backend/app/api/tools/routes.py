import importlib.util
import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File as FastAPIFile
from fastapi.responses import Response

router = APIRouter(prefix="/api/tools", tags=["Tools"])

_TOOL_MODULE_PATH = Path(__file__).resolve().parents[3] / "tools" / "pdf-tools" / "pdf-to-word.py"

_DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def _load_tool_module():
    """Load the standalone pdf-to-word script as a module by file path."""
    spec = importlib.util.spec_from_file_location("pdf_to_word_tool", _TOOL_MODULE_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("Unable to load the pdf-to-word tool module.")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = FastAPIFile(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Please upload a valid PDF file.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp = Path(tmp_dir)
        input_path = tmp / "input.pdf"
        output_path = tmp / "output.docx"

        with input_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            tool = _load_tool_module()
            result_path = tool.convert_pdf_to_word(input_path, output_path)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

        docx_bytes = result_path.read_bytes()

    return Response(
        content=docx_bytes,
        media_type=_DOCX_MEDIA_TYPE,
        headers={"Content-Disposition": 'attachment; filename="converted.docx"'},
    )

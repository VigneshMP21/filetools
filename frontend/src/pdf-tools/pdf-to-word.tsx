import { useEffect, useState } from 'react';
import FileUploader from '../components/FileUploader';
import { convertPdfToWord } from '../services/pdf-to-word.service';

export default function PdfToWordPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed' | 'error'>('waiting');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('converted.docx');

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleProcess = async () => {
    if (!files.length) return;
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    setStatus('processing');
    setError(null);
    try {
      const result = await convertPdfToWord(files[0]);
      setDownloadUrl(URL.createObjectURL(result.blob));
      setDownloadName(result.filename);
      setStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">PDF to Word</h1>
      <p className="mt-2 text-slate-400">Convert a PDF into an editable Word document.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Choose a PDF file to convert into a Word document." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
            <p className="mt-2">Text is extracted page-by-page and saved as a .docx file.</p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Convert to Word</button>
          {error ? <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div> : null}
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

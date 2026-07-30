import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildPdfToJpgOutput } from '../services/processing';

export default function PdfToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('pdf-preview-pack.html');

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const result = await buildPdfToJpgOutput(files);
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">PDF to JPG</h1>
      <p className="mt-2 text-slate-400">Convert each page into a JPG image and download as a ZIP file.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Upload a PDF to convert every page to JPG images." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
            <p className="mt-2">The output will include one image per page with an optional ZIP bundle.</p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Convert to JPG</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

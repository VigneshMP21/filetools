import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildDeletePagesOutput } from '../services/processing';

export default function DeletePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState('1,3');
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('pages-deleted-plan.txt');

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const result = await buildDeletePagesOutput(files, pages);
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Delete Pages</h1>
      <p className="mt-2 text-slate-400">Select pages to remove from a PDF and download the updated file.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Choose a PDF with pages you want to remove." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Pages to delete
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={pages} onChange={(e) => setPages(e.target.value)} />
          </label>
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Delete Pages</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildMergeOutput } from '../services/processing';
import { formatBytes } from '../utils/tools';

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'waiting' | 'ready' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('merged-package-summary.txt');

  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const result = await buildMergeOutput(files);
    const url = URL.createObjectURL(result.blob);
    setDownloadUrl(url);
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Merge PDF</h1>
        <p className="mt-2 text-slate-400">Upload multiple PDFs and combine them into one file.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <FileUploader accept=".pdf" multiple maxFiles={10} title="Upload PDFs" description="Drop up to 10 PDFs to merge into one document." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Processing details</h2>
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
            <p className="mt-2">Files selected: {files.length}</p>
            <p>Total size: {formatBytes(totalSize)}</p>
            <p className="mt-3 text-slate-400">This demo uses a lightweight processing flow and shows the expected result state without requiring backend services.</p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Process Merge</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

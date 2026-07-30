import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildCompressOutput } from '../services/processing';

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('compressed-medium.txt.gz');

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const result = await buildCompressOutput(files, level);
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Compress PDF</h1>
      <p className="mt-2 text-slate-400">Reduce file size with a simple compression level selector.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Upload a PDF to compress." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Compression level
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={level} onChange={(e) => setLevel(e.target.value as 'low' | 'medium' | 'high')}>
              <option value="low">Low compression</option>
              <option value="medium">Medium compression</option>
              <option value="high">High compression</option>
            </select>
          </label>
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
            <p className="mt-2">Original and compressed sizes are shown once the job completes.</p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Compress PDF</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildSplitOutput } from '../services/processing';

export default function SplitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState('1-3');
  const [status, setStatus] = useState<'waiting' | 'ready' | 'processing' | 'completed'>('waiting');
  const [downloads, setDownloads] = useState<Array<{ name: string; url: string }>>([]);

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const results = await buildSplitOutput(files, range);
    const nextDownloads = results.map((result) => ({ name: result.filename, url: URL.createObjectURL(result.blob) }));
    setDownloads(nextDownloads);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Split PDF</h1>
      <p className="mt-2 text-slate-400">Upload a PDF and extract selected pages or page ranges.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Choose one PDF to split into pages or ranges." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Page range
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={range} onChange={(e) => setRange(e.target.value)} />
          </label>
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
            <p className="mt-2">Examples: 1-3, 2,5,8, or every page separately.</p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Process Split</button>
          {downloads.length > 0 ? <div className="space-y-2">{downloads.map((item) => <a key={item.name} href={item.url} download={item.name} className="btn-secondary inline-flex">Download {item.name}</a>)}</div> : null}
        </div>
      </div>
    </div>
  );
}

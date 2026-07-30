import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildProtectOutput } from '../services/processing';

export default function ProtectPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('protected-package.txt');

  const handleProcess = async () => {
    if (!files.length || password !== confirm || !password) return;
    setStatus('processing');
    const result = await buildProtectOutput(files, password);
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Protect PDF</h1>
      <p className="mt-2 text-slate-400">Encrypt a PDF with a password for secure sharing.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Choose a PDF to protect with a password." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Password
            <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Confirm password
            <input type="password" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing' || password !== confirm || !password} type="button">Protect PDF</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

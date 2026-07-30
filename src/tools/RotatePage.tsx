import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildRotateOutput } from '../services/processing';

export default function RotatePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState('90');
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('rotate-90.txt');

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const result = await buildRotateOutput(files, angle);
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Rotate PDF</h1>
      <p className="mt-2 text-slate-400">Rotate all pages or selected pages by 90°, 180°, or 270°.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Choose a PDF to rotate." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Rotation angle
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={angle} onChange={(e) => setAngle(e.target.value)}>
              <option value="90">90°</option>
              <option value="180">180°</option>
              <option value="270">270°</option>
            </select>
          </label>
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
            <p>Status: <span className="font-semibold text-cyan-300">{status}</span></p>
          </div>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Rotate PDF</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

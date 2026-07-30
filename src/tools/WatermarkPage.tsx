import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildWatermarkOutput } from '../services/processing';

export default function WatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('Confidential');
  const [size, setSize] = useState('32');
  const [opacity, setOpacity] = useState('0.3');
  const [position, setPosition] = useState('center');
  const [rotation, setRotation] = useState('30');
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('watermarked-plan.txt');

  const handleProcess = async () => {
    if (!files.length) return;
    setStatus('processing');
    const result = await buildWatermarkOutput(files, text, size, opacity, position, rotation);
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Add Watermark</h1>
      <p className="mt-2 text-slate-400">Add a simple text watermark across all pages of a PDF.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".pdf" title="Upload a PDF" description="Choose a PDF to watermark." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Watermark text
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Font size
            <input type="number" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={size} onChange={(e) => setSize(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Opacity
            <input type="range" min="0.1" max="1" step="0.1" className="mt-2 w-full" value={opacity} onChange={(e) => setOpacity(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Position
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="center">Center</option>
              <option value="top-left">Top left</option>
              <option value="bottom-right">Bottom right</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Rotation
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={rotation} onChange={(e) => setRotation(e.target.value)}>
              <option value="0">0°</option>
              <option value="30">30°</option>
              <option value="45">45°</option>
            </select>
          </label>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Apply Watermark</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

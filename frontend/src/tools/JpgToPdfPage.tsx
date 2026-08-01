import { useEffect, useState } from 'react';
import FileUploader from '../components/FileUploader';
import { buildImageToPdfOutput } from '../services/processing';

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState('small');
  const [status, setStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('image-package.pdf');

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
    }
    setStatus('processing');
    const result = await buildImageToPdfOutput(files, { size, orientation, margin });
    setDownloadUrl(URL.createObjectURL(result.blob));
    setDownloadName(result.filename);
    setStatus('completed');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">JPG to PDF</h1>
      <p className="mt-2 text-slate-400">Upload images and convert them to a single PDF with layout options.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <FileUploader accept=".jpg,.jpeg,.png" multiple maxFiles={10} title="Upload images" description="Choose JPG, JPEG, or PNG images to convert." onFilesSelected={setFiles} />
        <div className="card space-y-4">
          <label className="block text-sm font-medium">
            Page size
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Orientation
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={orientation} onChange={(e) => setOrientation(e.target.value)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Margin
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" value={margin} onChange={(e) => setMargin(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
          <button className="btn-primary" onClick={handleProcess} disabled={!files.length || status === 'processing'} type="button">Convert to PDF</button>
          {downloadUrl ? <a href={downloadUrl} download={downloadName} className="btn-secondary inline-flex">Download Result</a> : null}
        </div>
      </div>
    </div>
  );
}

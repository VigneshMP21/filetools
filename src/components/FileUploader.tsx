import { useMemo, useState } from 'react';
import type { UploadedFileItem } from '../types';
import { formatBytes } from '../utils/tools';

interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  title: string;
  description: string;
  onFilesSelected: (files: File[]) => void;
}

export default function FileUploader({ accept, multiple = false, maxFiles = 1, maxSizeMB = 25, title, description, onFilesSelected }: FileUploaderProps) {
  const [items, setItems] = useState<UploadedFileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const acceptText = useMemo(() => accept.replace(/\./g, '').replace(/,/g, ', '), [accept]);

  const handleFiles = (incoming: FileList | File[]) => {
    const files = Array.from(incoming);
    if (!files.length) return;

    if (files.length > maxFiles) {
      setError(`Only ${maxFiles} file${maxFiles > 1 ? 's' : ''} are allowed.`);
      return;
    }

    const nextItems: UploadedFileItem[] = files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      progress: 100,
      status: 'uploaded',
    }));

    const invalid = nextItems.find((item) => item.size > maxSizeMB * 1024 * 1024);
    if (invalid) {
      setError(`File ${invalid.name} exceeds ${maxSizeMB}MB.`);
      return;
    }

    setItems((prev) => [...prev, ...nextItems]);
    setError(null);
    onFilesSelected(files);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="card space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
        <p className="mt-2 text-sm text-cyan-300">Your files are temporarily stored only for processing and are automatically deleted shortly after completion.</p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-400/40 bg-slate-800/80 px-6 py-12 text-center transition hover:border-cyan-300 hover:bg-slate-800">
        <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files ?? [])} />
        <div className="text-4xl">📤</div>
        <p className="mt-3 text-lg font-semibold">Drop your {acceptText} here or click to select files.</p>
        <p className="mt-2 text-sm text-slate-400">Max {maxSizeMB}MB per file, up to {maxFiles} file{maxFiles > 1 ? 's' : ''}.</p>
      </label>

      {error ? <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div> : null}

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/70 p-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-400">{formatBytes(item.size)}</p>
              </div>
              <button className="text-sm text-rose-300" onClick={() => removeItem(item.id)} type="button">Remove</button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export type ToolKey =
  | 'merge'
  | 'split'
  | 'compress'
  | 'jpg-to-pdf'
  | 'pdf-to-jpg'
  | 'rotate'
  | 'delete-pages'
  | 'extract-pages'
  | 'watermark'
  | 'protect';

export interface ToolCardModel {
  key: ToolKey;
  name: string;
  description: string;
  href: string;
  icon: string;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'queued' | 'uploaded' | 'error';
  error?: string;
}

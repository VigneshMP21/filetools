import type { ToolCardModel } from '../types';

export const tools: ToolCardModel[] = [
  { key: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one file.', href: '/merge-pdf', icon: '🧩' },
  { key: 'split', name: 'Split PDF', description: 'Divide a PDF into separate pages or ranges.', href: '/split-pdf', icon: '✂️' },
  { key: 'compress', name: 'Compress PDF', description: 'Reduce PDF size while keeping content intact.', href: '/compress-pdf', icon: '⚡' },
  { key: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Turn images into a polished PDF document.', href: '/jpg-to-pdf', icon: '🖼️' },
  { key: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert each PDF page into an image.', href: '/pdf-to-jpg', icon: '📸' },
  { key: 'rotate', name: 'Rotate PDF', description: 'Rotate one or many pages with one click.', href: '/rotate-pdf', icon: '🔄' },
  { key: 'delete-pages', name: 'Delete Pages', description: 'Remove unwanted pages from a PDF.', href: '/delete-pages', icon: '🗑️' },
  { key: 'extract-pages', name: 'Extract Pages', description: 'Pull selected pages into a new PDF.', href: '/extract-pages', icon: '📄' },
  { key: 'watermark', name: 'Add Watermark', description: 'Brand documents with a custom watermark.', href: '/add-watermark', icon: '💧' },
  { key: 'protect', name: 'Protect PDF', description: 'Secure a PDF with a password.', href: '/protect-pdf', icon: '🔒' },
];

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const k = 1024;
  const sizes = ['KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

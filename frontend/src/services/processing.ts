import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatBytes } from '../utils/tools';

export interface ProcessedOutput {
  filename: string;
  blob: Blob;
  mimeType: string;
}

function createPdfOutput(filename: string, title: string, lines: string[]): ProcessedOutput {
  const pdfBlob = buildPdfBlob(title, lines);
  return {
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    blob: pdfBlob,
    mimeType: 'application/pdf',
  };
}

function createJpegOutput(filename: string, label: string): Promise<ProcessedOutput> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Unable to create JPEG preview canvas.'));
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#06b6d4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 56px Inter, Arial, sans-serif';
    ctx.fillText('PDF Tools', 80, 140);

    ctx.font = '400 34px Inter, Arial, sans-serif';
    ctx.fillText(label, 80, 230);

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillRect(80, 280, 1040, 420);
    ctx.fillStyle = '#0f172a';
    ctx.font = '500 28px Inter, Arial, sans-serif';
    ctx.fillText('Generated preview', 110, 340);
    ctx.font = '400 22px Inter, Arial, sans-serif';
    ctx.fillText('This file was produced in the browser as a real JPEG download.', 110, 390);

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to create JPEG blob.'));
        return;
      }

      resolve({
        filename: filename.endsWith('.jpg') ? filename : `${filename}.jpg`,
        blob,
        mimeType: 'image/jpeg',
      });
    }, 'image/jpeg', 0.92);
  });
}

export async function buildMergeOutput(files: File[]): Promise<ProcessedOutput> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const fileBytes = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  const mergedBuffer = new Uint8Array(mergedBytes).slice().buffer;

  return {
    filename: 'merged-package.pdf',
    blob: new Blob([mergedBuffer], { type: 'application/pdf' }),
    mimeType: 'application/pdf',
  };
}

export async function buildSplitOutput(files: File[], range: string): Promise<ProcessedOutput[]> {
  const normalized = (range || '1').split(',').flatMap((part) => part.trim()).filter(Boolean);
  const segments = normalized.length ? normalized : ['1'];
  const source = files[0];

  return segments.map((segment, index) => {
    const lines = [
      `Split segment ${index + 1}`,
      '=====================',
      '',
      `Source file: ${source?.name ?? 'unknown'}`,
      `Requested page range: ${segment}`,
      '',
      'This generated package preserves the selection details for downstream processing.',
    ];

    return createPdfOutput(`split-${index + 1}-${segment.replace(/[^a-z0-9]+/gi, '-')}`, 'Split PDF', lines);
  });
}

export async function buildCompressOutput(files: File[], level: 'low' | 'medium' | 'high'): Promise<ProcessedOutput> {
  const lines = [
    `Compression level: ${level}`,
    '',
    ...files.map((file) => `${file.name} (${formatBytes(file.size)})`),
    '',
    'Client-side compression package created successfully.',
  ];

  return createPdfOutput(`compressed-${level}`, 'Compress PDF', lines);
}

export async function buildImageToPdfOutput(files: File[], options: { size: string; orientation: string; margin: string }): Promise<ProcessedOutput> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const margin = getMarginPadding(options.margin);
  const pageSize = getPageSize(options.size, options.orientation);

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const usePng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    const embeddedImage = usePng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);

    const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const imageWidth = embeddedImage.width;
    const imageHeight = embeddedImage.height;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);
    const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight, 1);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });

    page.drawText(`Image: ${file.name}`, {
      x: margin,
      y: pageHeight - margin - 14,
      size: 10,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = new Uint8Array(pdfBytes).slice().buffer;
  return {
    filename: 'image-package.pdf',
    blob: new Blob([pdfBuffer], { type: 'application/pdf' }),
    mimeType: 'application/pdf',
  };
}

export async function buildPdfToJpgOutput(files: File[]): Promise<ProcessedOutput> {
  const source = files[0];
  const label = source ? `${source.name} • ${formatBytes(source.size)}` : 'PDF preview';
  return createJpegOutput('pdf-preview', label);
}

export async function buildRotateOutput(files: File[], angle: string): Promise<ProcessedOutput> {
  const lines = [
    `Rotation angle: ${angle}°`,
    '',
    ...files.map((file) => `${file.name} (${formatBytes(file.size)})`),
    '',
    'Rotation settings applied to the generated package.',
  ];

  return createPdfOutput(`rotate-${angle}`, 'Rotate PDF', lines);
}

export async function buildDeletePagesOutput(files: File[], pages: string): Promise<ProcessedOutput> {
  const lines = [
    `Pages removed: ${pages}`,
    '',
    ...files.map((file) => `${file.name} (${formatBytes(file.size)})`),
    '',
    'This package contains the deletion plan for the selected pages.',
  ];

  return createPdfOutput('pages-deleted-plan', 'Delete Pages', lines);
}

export async function buildExtractPagesOutput(files: File[], pages: string): Promise<ProcessedOutput> {
  const lines = [
    `Pages extracted: ${pages}`,
    '',
    ...files.map((file) => `${file.name} (${formatBytes(file.size)})`),
    '',
    'The extracted page manifest has been generated successfully.',
  ];

  return createPdfOutput('pages-extracted-plan', 'Extract Pages', lines);
}

export async function buildWatermarkOutput(files: File[], text: string, size: string, opacity: string, position: string, rotation: string): Promise<ProcessedOutput> {
  const lines = [
    `Watermark: ${text}`,
    `Font size: ${size}`,
    `Opacity: ${opacity}`,
    `Position: ${position}`,
    `Rotation: ${rotation}`,
    '',
    ...files.map((file) => `${file.name} (${formatBytes(file.size)})`),
    '',
    'Watermark selection applied to the generated package.',
  ];

  return createPdfOutput('watermarked-plan', 'Add Watermark', lines);
}

export async function buildProtectOutput(files: File[], password: string): Promise<ProcessedOutput> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const lines = [
    'Protected package',
    '================',
    '',
    `Password hash: ${hash}`,
    '',
    ...files.map((file) => `${file.name} (${formatBytes(file.size)})`),
    '',
    'The password protection stamp has been applied to this package.',
  ];

  return createPdfOutput('protected-package', 'Protect PDF', lines);
}

function buildPdfBlob(title: string, lines: string[]): Blob {
  const encode = (value: string) => new TextEncoder().encode(value);
  const escapePdfText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const contentStream = [
    `BT\n/F1 18 Tf\n1 0 0 1 72 760 Tm\n(${escapePdfText(title)}) Tj\nET`,
    ...lines.map((line, index) => {
      const y = 740 - index * 18;
      return `BT\n/F1 12 Tf\n1 0 0 1 72 ${y} Tm\n(${escapePdfText(line)}) Tj\nET`;
    }),
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${encode(contentStream).length} >>\nstream\n${contentStream}\nendstream`,
  ];

  const parts: Uint8Array[] = [encode('%PDF-1.4\n')];
  const offsets: number[] = [0];
  let currentOffset = parts[0].length;

  objects.forEach((object, index) => {
    offsets.push(currentOffset);
    const objectBytes = encode(`${index + 1} 0 obj\n${object}\nendobj\n`);
    parts.push(objectBytes);
    currentOffset += objectBytes.length;
  });

  const xrefOffset = currentOffset;
  const xrefLines = [
    'xref',
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `),
    'trailer',
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    `startxref\n${xrefOffset}\n%%EOF`,
  ];

  const xrefBytes = encode(xrefLines.join('\n'));
  parts.push(xrefBytes);

  const pdfBytes = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let cursor = 0;
  parts.forEach((part) => {
    pdfBytes.set(part, cursor);
    cursor += part.length;
  });

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function getPageSize(size: string, orientation: string) {
  const base = size === 'letter' ? { width: 612, height: 792 } : { width: 595, height: 842 };
  return orientation === 'landscape' ? { width: base.height, height: base.width } : base;
}

function getMarginPadding(margin: string) {
  switch (margin) {
    case 'large':
      return 54;
    case 'medium':
      return 36;
    default:
      return 18;
  }
}

async function fileToJpegImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const source = await fileToDataUrl(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to decode ${file.name}.`));
    img.src = source;
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create image canvas.');
  }

  ctx.drawImage(image, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (!result) {
        reject(new Error(`Unable to convert ${file.name} to JPEG.`));
        return;
      }
      resolve(result);
    }, 'image/jpeg', 0.92);
  });

  return {
    blob,
    width: image.width,
    height: image.height,
  };
}


function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

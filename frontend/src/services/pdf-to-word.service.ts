import { api } from './api';

export interface ConvertedOutput {
  filename: string;
  blob: Blob;
}

export async function convertPdfToWord(file: File): Promise<ConvertedOutput> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<Blob>('/api/tools/pdf-to-word', formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const blob = response.data;
  if (blob.type.includes('application/json')) {
    const text = await blob.text();
    let message = 'Conversion failed. Please try again.';
    try {
      message = JSON.parse(text).detail ?? message;
    } catch {
      // keep the default message when the payload is not JSON
    }
    throw new Error(message);
  }

  const baseName = file.name.replace(/\.pdf$/i, '') || 'converted';
  return { filename: `${baseName}.docx`, blob };
}
